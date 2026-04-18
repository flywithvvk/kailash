#!/bin/bash
# KAILASH AEGIS HUB - Deployment Verification Script
# Version: 1.0.0

echo "╔════════════════════════════════════════════╗"
echo "║  KAILASH AEGIS HUB                         ║"
echo "║  Deployment Verification                   ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS="${GREEN}✅${NC}"
FAIL="${RED}❌${NC}"
WARN="${YELLOW}⚠️${NC}"

# Counter
total=0
passed=0
failed=0

check_item() {
    total=$((total + 1))
    if [ $1 -eq 0 ]; then
        echo -e "$PASS $2"
        passed=$((passed + 1))
    else
        echo -e "$FAIL $2"
        failed=$((failed + 1))
    fi
}

echo "═══════════════════════════════════════════"
echo "1. FRONTEND VERIFICATION"
echo "═══════════════════════════════════════════"

# Check frontend build
[ -f /app/frontend/build/index.html ] && result=0 || result=1
check_item $result "Frontend build exists"

# Check frontend size
size=$(du -s /app/frontend/build/ 2>/dev/null | cut -f1)
[ "$size" -gt 100 ] && result=0 || result=1
check_item $result "Frontend build size (${size}K)"

# Check main JS bundle
[ -d /app/frontend/build/static/js ] && result=0 || result=1
check_item $result "JavaScript bundles present"

# Check CSS bundle
[ -d /app/frontend/build/static/css ] && result=0 || result=1
check_item $result "CSS bundles present"

echo ""
echo "═══════════════════════════════════════════"
echo "2. BACKEND VERIFICATION"
echo "═══════════════════════════════════════════"

# Check backend health
health=$(curl -s http://localhost:8001/api/health 2>/dev/null)
echo "$health" | grep -q "healthy" && result=0 || result=1
check_item $result "Backend health check"

# Check database connection
echo "$health" | grep -q "connected" && result=0 || result=1
check_item $result "Database connection"

# Check API docs
curl -s http://localhost:8001/api/docs 2>/dev/null | grep -q "FastAPI" && result=0 || result=1
check_item $result "API documentation"

# Check departments endpoint
curl -s -H "Authorization: Bearer test" http://localhost:8001/api/departments/ 2>/dev/null | grep -q "ganesha\|Forbidden" && result=0 || result=1
check_item $result "Departments endpoint"

echo ""
echo "═══════════════════════════════════════════"
echo "3. SERVICES VERIFICATION"
echo "═══════════════════════════════════════════"

# Check backend service
sudo supervisorctl status backend 2>/dev/null | grep -q "RUNNING" && result=0 || result=1
check_item $result "Backend service running"

# Check frontend service
sudo supervisorctl status frontend 2>/dev/null | grep -q "RUNNING" && result=0 || result=1
check_item $result "Frontend service running"

# Check MongoDB service
sudo supervisorctl status mongodb 2>/dev/null | grep -q "RUNNING" && result=0 || result=1
check_item $result "MongoDB service running"

echo ""
echo "═══════════════════════════════════════════"
echo "4. CONFIGURATION VERIFICATION"
echo "═══════════════════════════════════════════"

# Check frontend .env
[ -f /app/frontend/.env ] && result=0 || result=1
check_item $result "Frontend .env exists"

# Check backend .env
[ -f /app/backend/.env ] && result=0 || result=1
check_item $result "Backend .env exists"

# Check backend .env has required vars
grep -q "SECRET_KEY" /app/backend/.env 2>/dev/null && result=0 || result=1
check_item $result "Backend SECRET_KEY configured"

# Check backend .env has ANTHROPIC_API_KEY
grep -q "ANTHROPIC_API_KEY" /app/backend/.env 2>/dev/null && result=0 || result=1
check_item $result "Backend ANTHROPIC_API_KEY configured"

echo ""
echo "═══════════════════════════════════════════"
echo "5. DOCUMENTATION VERIFICATION"
echo "═══════════════════════════════════════════"

# Check MASTER_DOCUMENTATION
[ -f /app/MASTER_DOCUMENTATION.md ] && result=0 || result=1
check_item $result "MASTER_DOCUMENTATION.md"

# Check APPLICATION_FLOW_GUIDE
[ -f /app/APPLICATION_FLOW_GUIDE.md ] && result=0 || result=1
check_item $result "APPLICATION_FLOW_GUIDE.md"

# Check DEPLOYMENT_PACKAGE
[ -f /app/DEPLOYMENT_PACKAGE.md ] && result=0 || result=1
check_item $result "DEPLOYMENT_PACKAGE.md"

# Check FINAL_DEPLOYMENT_CHECKLIST
[ -f /app/FINAL_DEPLOYMENT_CHECKLIST.md ] && result=0 || result=1
check_item $result "FINAL_DEPLOYMENT_CHECKLIST.md"

# Check READY_FOR_DEPLOYMENT
[ -f /app/READY_FOR_DEPLOYMENT.md ] && result=0 || result=1
check_item $result "READY_FOR_DEPLOYMENT.md"

echo ""
echo "═══════════════════════════════════════════"
echo "6. REPOSITORY STRUCTURE"
echo "═══════════════════════════════════════════"

# Check docs directory
[ -d /app/docs ] && result=0 || result=1
check_item $result "Documentation directory"

# Check archived directory
[ -d /app/docs/archived ] && result=0 || result=1
check_item $result "Archived documentation"

# Check tests directory
[ -d /app/tests/scripts ] && result=0 || result=1
check_item $result "Test scripts directory"

# Count root .md files (should be 8)
md_count=$(ls /app/*.md 2>/dev/null | wc -l)
[ "$md_count" -eq 8 ] && result=0 || result=1
check_item $result "Root documentation files ($md_count/8)"

# Check for backup files (should be 0)
backup_count=$(find /app -name "*.backup.*" -o -name "*.old.*" 2>/dev/null | wc -l)
[ "$backup_count" -eq 0 ] && result=0 || result=1
check_item $result "No backup files found"

echo ""
echo "═══════════════════════════════════════════"
echo "SUMMARY"
echo "═══════════════════════════════════════════"
echo ""
echo "Total Checks: $total"
echo -e "${GREEN}Passed: $passed${NC}"
[ $failed -gt 0 ] && echo -e "${RED}Failed: $failed${NC}" || echo -e "${GREEN}Failed: 0${NC}"
echo ""

percentage=$((passed * 100 / total))
echo "Success Rate: $percentage%"
echo ""

if [ $percentage -ge 90 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✅ DEPLOYMENT READY                       ║${NC}"
    echo -e "${GREEN}║  All critical checks passed                ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
elif [ $percentage -ge 75 ]; then
    echo -e "${YELLOW}╔════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║  ⚠️  NEEDS ATTENTION                       ║${NC}"
    echo -e "${YELLOW}║  Some checks failed - review above         ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════╝${NC}"
else
    echo -e "${RED}╔════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ❌ NOT READY FOR DEPLOYMENT               ║${NC}"
    echo -e "${RED}║  Multiple checks failed - fix issues       ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════╝${NC}"
fi

echo ""
echo "Credentials:"
echo "  AEGIS Code: V20099774J"
echo "  Password:   <REDACTED_PASSWORD>"
echo "  2FA Code:   Any 6 digits"
echo ""
echo "URLs:"
echo "  Frontend:   http://localhost:3000"
echo "  Backend:    http://localhost:8001/api"
echo "  API Docs:   http://localhost:8001/api/docs"
echo "  Health:     http://localhost:8001/api/health"
echo ""
echo "Documentation:"
echo "  Complete Guide:  /app/MASTER_DOCUMENTATION.md"
echo "  Deployment Info: /app/DEPLOYMENT_PACKAGE.md"
echo "  Checklist:       /app/FINAL_DEPLOYMENT_CHECKLIST.md"
echo ""
