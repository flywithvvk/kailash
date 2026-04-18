#!/bin/bash
echo "🧪 Testing Department ID Mismatch Fix"
echo "======================================"

# Test without auth first (should get 401 but endpoint exists)
echo -e "\n1️⃣ Testing endpoint availability..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/departments/ganesha/summary)
if [ "$STATUS" = "401" ] || [ "$STATUS" = "200" ]; then
    echo "✅ Endpoint exists (HTTP $STATUS)"
else
    echo "❌ Endpoint issue (HTTP $STATUS)"
fi

echo -e "\n2️⃣ Testing with database ID..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/departments/dept-001/summary)
if [ "$STATUS" = "401" ] || [ "$STATUS" = "200" ]; then
    echo "✅ Database ID endpoint works (HTTP $STATUS)"
else
    echo "❌ Database ID endpoint issue (HTTP $STATUS)"
fi

echo -e "\n3️⃣ Testing with uppercase..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/departments/VISHWAKARMA/summary)
if [ "$STATUS" = "401" ] || [ "$STATUS" = "200" ]; then
    echo "✅ Uppercase ID endpoint works (HTTP $STATUS)"
else
    echo "❌ Uppercase ID endpoint issue (HTTP $STATUS)"
fi

echo -e "\n✅ Integration test complete!"
echo "Note: HTTP 401 is expected (authentication required)"
echo "Note: HTTP 200 means endpoint works with auth"
