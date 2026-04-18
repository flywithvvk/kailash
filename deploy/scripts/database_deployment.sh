#!/bin/bash

echo "💾 DATABASE DEPLOYMENT SCRIPT"
echo "============================="

MONGO_URI="${MONGO_URI:-mongodb://localhost:27017/kailash_aegis}"

echo ""
echo "Connecting to: $MONGO_URI"
echo ""

# 1. Update all departments with v2.0 metadata
echo "1. Updating departments metadata..."
mongosh "$MONGO_URI" --quiet --eval '
db.departments.updateMany(
    {},
    {
        $set: {
            version: "2.0.0",
            analytics_enabled: true,
            last_updated: new Date()
        }
    }
)' | grep -E "Modified|matched"

# 2. Create indexes for performance
echo ""
echo "2. Creating performance indexes..."
mongosh "$MONGO_URI" --quiet --eval '
db.departments.createIndex({name: 1}, {unique: true});
db.departments.createIndex({status: 1});
db.analytics.createIndex({timestamp: -1});
db.analytics.createIndex({metric: 1, timestamp: -1});
' > /dev/null 2>&1 && echo "✅ Indexes created"

# 3. Insert initial analytics data
echo ""
echo "3. Initializing analytics data..."
mongosh "$MONGO_URI" --quiet --eval '
db.analytics.insertMany([
    {
        timestamp: new Date(),
        metric: "total_agents",
        value: 36,
        platform: "GANESHA v2.0"
    },
    {
        timestamp: new Date(),
        metric: "rag_vectors",
        value: 851,
        platform: "GANESHA v2.0"
    },
    {
        timestamp: new Date(),
        metric: "departments",
        value: 27,
        platform: "KAILASH AEGIS HUB"
    }
], {ordered: false})' > /dev/null 2>&1 && echo "✅ Analytics initialized"

# 4. Verify deployment
echo ""
echo "4. Verifying deployment..."
DEPT_COUNT=$(mongosh "$MONGO_URI" --quiet --eval "db.departments.countDocuments({})")
ANALYTICS_COUNT=$(mongosh "$MONGO_URI" --quiet --eval "db.analytics.countDocuments({})")

echo "  Departments: $DEPT_COUNT"
echo "  Analytics records: $ANALYTICS_COUNT"

echo ""
echo "✅ DATABASE DEPLOYMENT COMPLETE"
