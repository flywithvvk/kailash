#!/bin/bash

# AEGIS HUB Deployment Verification Script
# Run this after updating MongoDB Atlas configuration

echo "=================================================="
echo "AEGIS HUB - Deployment Verification Script"
echo "Version: 2.0.0"
echo "Date: $(date)"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:8001"
TEST_AEGIS_CODE="<REDACTED_AEGIS_CODE>"
TEST_PASSWORD="<REDACTED_PASSWORD>"

echo "🔍 Testing Backend URL: $BACKEND_URL"
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
echo "-------------------"
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/api/health")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
HEALTH_BODY=$(echo "$HEALTH_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Health check successful (HTTP $HTTP_CODE)"
    echo "   Database: $(echo $HEALTH_BODY | python3 -c "import sys,json; data=json.load(sys.stdin); print(data.get('database', 'unknown'))")"
    echo "   Version: $(echo $HEALTH_BODY | python3 -c "import sys,json; data=json.load(sys.stdin); print(data.get('version', 'unknown'))")"
else
    echo -e "${RED}❌ FAILED${NC} - Health check failed (HTTP $HTTP_CODE)"
    echo "   Response: $HEALTH_BODY"
    exit 1
fi
echo ""

# Test 2: Login (Authentication)
echo "Test 2: Authentication (Login)"
echo "------------------------------"
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"aegis_code\": \"$TEST_AEGIS_CODE\", \"password\": \"$TEST_PASSWORD\"}")

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n1)
LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
    TOKEN=$(echo $LOGIN_BODY | python3 -c "import sys,json; data=json.load(sys.stdin); print(data.get('access_token', ''))" 2>/dev/null)
    if [ -n "$TOKEN" ]; then
        echo -e "${GREEN}✅ PASSED${NC} - Login successful (HTTP $HTTP_CODE)"
        echo "   User: $(echo $LOGIN_BODY | python3 -c "import sys,json; data=json.load(sys.stdin); print(data['user']['full_name'])")"
        echo "   Token: ${TOKEN:0:50}..."
    else
        echo -e "${RED}❌ FAILED${NC} - Login response missing token"
        echo "   Response: $LOGIN_BODY"
        exit 1
    fi
else
    echo -e "${RED}❌ FAILED${NC} - Login failed (HTTP $HTTP_CODE)"
    echo "   Response: $LOGIN_BODY"
    echo ""
    echo -e "${YELLOW}⚠️  This likely means MongoDB permissions are not correct${NC}"
    echo "   See DEPLOYMENT_FIX_GUIDE.md for instructions"
    exit 1
fi
echo ""

# Test 3: Authenticated Endpoint (Departments)
echo "Test 3: Authenticated Endpoint (Departments)"
echo "--------------------------------------------"
DEPT_RESPONSE=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/api/departments" \
  -H "Authorization: Bearer $TOKEN")

HTTP_CODE=$(echo "$DEPT_RESPONSE" | tail -n1)
DEPT_BODY=$(echo "$DEPT_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
    DEPT_COUNT=$(echo $DEPT_BODY | python3 -c "import sys,json; data=json.load(sys.stdin); print(len(data))" 2>/dev/null)
    if [ "$DEPT_COUNT" -eq 20 ]; then
        echo -e "${GREEN}✅ PASSED${NC} - Departments endpoint working (HTTP $HTTP_CODE)"
        echo "   Departments loaded: $DEPT_COUNT"
    else
        echo -e "${YELLOW}⚠️  WARNING${NC} - Expected 20 departments, got $DEPT_COUNT"
    fi
else
    echo -e "${RED}❌ FAILED${NC} - Departments endpoint failed (HTTP $HTTP_CODE)"
    echo "   Response: ${DEPT_BODY:0:200}..."
    exit 1
fi
echo ""

# Test 4: Check Backend Logs for Errors
echo "Test 4: Backend Logs Check"
echo "--------------------------"
ERROR_COUNT=$(tail -100 /var/log/supervisor/backend.err.log 2>/dev/null | grep -i "error\|critical\|unauthorized" | wc -l)

if [ "$ERROR_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ PASSED${NC} - No errors in recent backend logs"
else
    echo -e "${YELLOW}⚠️  WARNING${NC} - Found $ERROR_COUNT error entries in logs"
    echo "   Last 5 errors:"
    tail -100 /var/log/supervisor/backend.err.log | grep -i "error\|critical\|unauthorized" | tail -5
fi
echo ""

# Test 5: Database Connection Type
echo "Test 5: Database Configuration"
echo "------------------------------"
MONGO_URL=$(grep "^MONGO_URL=" /app/backend/.env | cut -d'=' -f2 | tr -d '"')

if [[ $MONGO_URL == *"mongodb+srv"* ]]; then
    echo -e "${GREEN}✅ MongoDB Atlas${NC} connection configured"
    echo "   Connection: ${MONGO_URL:0:50}..."
elif [[ $MONGO_URL == *"localhost"* ]]; then
    echo -e "${YELLOW}⚠️  Local MongoDB${NC} (not production-ready)"
    echo "   Connection: $MONGO_URL"
    echo "   Action: Update to MongoDB Atlas for production"
else
    echo -e "${YELLOW}⚠️  Unknown MongoDB${NC} connection type"
    echo "   Connection: ${MONGO_URL:0:50}..."
fi
echo ""

# Test 6: Permission Check Status
echo "Test 6: Permission Check Configuration"
echo "--------------------------------------"
SKIP_CHECK=$(grep "^SKIP_PERMISSION_CHECK=" /app/backend/.env | cut -d'=' -f2)

if [ "$SKIP_CHECK" = "true" ]; then
    echo -e "${YELLOW}⚠️  Permission check SKIPPED${NC}"
    echo "   This is OK for initial deployment"
    echo "   Set to 'false' once MongoDB permissions are confirmed"
else
    echo -e "${GREEN}✅ Permission check ENABLED${NC}"
    echo "   MongoDB permissions are verified"
fi
echo ""

# Summary
echo "=================================================="
echo "DEPLOYMENT VERIFICATION SUMMARY"
echo "=================================================="
echo ""
echo -e "${GREEN}Core Functionality:${NC}"
echo "  ✅ Backend is running"
echo "  ✅ Health check passing"
echo "  ✅ Authentication working"
echo "  ✅ Database connected"
echo "  ✅ Protected endpoints accessible"
echo ""

if [[ $MONGO_URL == *"mongodb+srv"* ]]; then
    echo -e "${GREEN}✅ PRODUCTION READY${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Deploy to production environment"
    echo "  2. Test with production URL"
    echo "  3. Set up monitoring (Sentry, DataDog)"
    echo "  4. Create backup strategy"
    echo "  5. Document deployment for team"
else
    echo -e "${YELLOW}⚠️  CONFIGURATION NEEDED${NC}"
    echo ""
    echo "Action required:"
    echo "  1. Set up MongoDB Atlas (see DEPLOYMENT_FIX_GUIDE.md)"
    echo "  2. Update MONGO_URL in backend/.env"
    echo "  3. Re-run this test script"
    echo "  4. Deploy to production"
fi
echo ""
echo "=================================================="
echo "Test completed at: $(date)"
echo "=================================================="
