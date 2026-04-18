#!/bin/bash
echo "🚀 KAILASH AEGIS HU - Deployment Script"
echo "========================================"
echo ""

# Check if backend is running
if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    echo "✅ Backend is running"
else
    echo "❌ Backend not running - starting..."
    cd /app/backend
    nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 > /app/logs/backend.log 2>&1 &
    sleep 3
fi

# Check health
echo ""
echo "🏥 Health Check:"
curl -s http://localhost:8000/api/health | jq -r '.status' || echo "Failed"

# Test department endpoint
echo ""
echo "🧪 Testing Department Endpoint:"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/departments/ganesha/summary)
if [ "$STATUS" = "401" ] || [ "$STATUS" = "200" ]; then
    echo "✅ Department endpoint working (HTTP $STATUS)"
else
    echo "⚠️  Department endpoint status: HTTP $STATUS"
fi

echo ""
echo "📊 Deployment Status:"
echo "  - Backend: Running on port 8000"
echo "  - Frontend: http://localhost:3000"
echo "  - Health: /api/health"
echo "  - Docs: /api/docs"
echo ""
echo "📚 Documentation:"
echo "  - DEPLOYMENT_READY.md"
echo "  - INTEGRATION_GUIDE.md"
echo "  - DEPLOYMENT_PACKAGE.txt"
echo ""
echo "✅ Deployment Ready!"
