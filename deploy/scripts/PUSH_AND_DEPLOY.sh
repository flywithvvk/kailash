#!/bin/bash
echo "🚀 KAILASH - Push to GitHub & Deploy"
echo "====================================="
echo ""

# Check git status
echo "📋 Checking git status..."
cd /app
git status --short

echo ""
echo "📦 Ready to push 3 commits:"
git log --oneline -3

echo ""
read -p "Push to GitHub main branch? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Pushing to GitHub..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Successfully pushed to GitHub!"
        echo ""
        echo "🚀 Emergent Deployment:"
        echo "  - Emergent will auto-detect the push"
        echo "  - Check Emergent dashboard for deployment status"
        echo "  - Monitor logs in Emergent console"
        echo ""
        echo "📊 What was deployed:"
        echo "  ✅ Department ID fix (ganesha → GANESHA)"
        echo "  ✅ Security improvements"
        echo "  ✅ Performance optimizations"
        echo "  ✅ System health monitoring"
        echo ""
        echo "🔍 Verify deployment:"
        echo "  curl https://your-domain/api/health"
        echo "  curl https://your-domain/api/departments/ganesha/summary"
    else
        echo ""
        echo "❌ Push failed. Check credentials:"
        echo "  git remote set-url origin https://YOUR_TOKEN@github.com/G4GURGAA/AEGISHUB.git"
    fi
else
    echo "❌ Push cancelled"
fi
