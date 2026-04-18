# db_inspector.py - GANESHA v2 Database Inspection
# Run: python db_inspector.py

from pymongo import MongoClient
from datetime import datetime

# Connection
uri = "mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/?appName=ganesha-v2-api&maxPoolSize=5&retryWrites=true&timeoutMS=10000&w=majority"

client = MongoClient(uri)

print("=" * 70)
print("GANESHA v2 - COMPLETE DATABASE INSPECTION")
print(f"Timestamp: {datetime.now().isoformat()}")
print("=" * 70)

# ============================================================================
# SECTION 1: LIST ALL DATABASES
# ============================================================================
print("\n" + "=" * 70)
print("SECTION 1: ALL DATABASES")
print("=" * 70)

all_dbs = client.list_database_names()
for db_name in all_dbs:
    print(f"  📁 {db_name}")

# ============================================================================
# SECTION 2: DETAILED COLLECTION ANALYSIS
# ============================================================================
print("\n" + "=" * 70)
print("SECTION 2: DETAILED COLLECTION ANALYSIS")
print("=" * 70)

for db_name in all_dbs:
    if db_name not in ['admin', 'local', 'config']:
        db = client[db_name]
        collections = db.list_collection_names()
        
        print(f"\n{'='*70}")
        print(f"📂 DATABASE: {db_name}")
        print(f"   Total Collections: {len(collections)}")
        print(f"{'='*70}")
        
        for coll_name in sorted(collections):
            coll = db[coll_name]
            count = coll.count_documents({})
            
            print(f"\n   📄 COLLECTION: {coll_name}")
            print(f"      Document Count: {count}")
            
            # Get sample document
            sample = coll.find_one()
            if sample:
                # Get all field names
                fields = list(sample.keys())
                print(f"      Fields ({len(fields)}): {fields}")
                
                # Show field types
                print(f"      Field Types:")
                for key, value in sample.items():
                    val_type = type(value).__name__
                    val_preview = str(value)[:50] + "..." if len(str(value)) > 50 else str(value)
                    print(f"         - {key}: {val_type} = {val_preview}")
            else:
                print(f"      ⚠️ Collection is empty")
            
            # Get indexes
            indexes = list(coll.list_indexes())
            if indexes:
                print(f"      Indexes ({len(indexes)}):")
                for idx in indexes:
                    print(f"         - {idx['name']}: {idx['key']}")

# ============================================================================
# SECTION 3: EXPECTED COLLECTIONS CHECK
# ============================================================================
print("\n" + "=" * 70)
print("SECTION 3: EXPECTED COLLECTIONS FOR GANESHA v2")
print("=" * 70)

# Define expected collections
expected_collections = {
    "users": ["_id", "email", "password", "role"],
    "organizations": ["_id", "name", "subscription"],
    "conversations": ["_id", "user_id", "messages", "created_at"],
    "messages": ["_id", "conversation_id", "role", "content"],
    "agents": ["agent_id", "name", "product", "specialty"],
    "agent_usage": ["agent_id", "query_count", "timestamp"],
    "rag_sources": ["source", "product", "doc_type"],
    "sessions": ["_id", "user_id", "token", "expires_at"],
    "audit_logs": ["_id", "user_id", "action", "timestamp"],
    "settings": ["_id", "key", "value"],
}

# Check against actual
for db_name in all_dbs:
    if db_name not in ['admin', 'local', 'config']:
        db = client[db_name]
        actual_collections = set(db.list_collection_names())
        
        print(f"\n📂 Checking: {db_name}")
        
        for expected_coll, expected_fields in expected_collections.items():
            if expected_coll in actual_collections:
                coll = db[expected_coll]
                sample = coll.find_one()
                actual_fields = list(sample.keys()) if sample else []
                
                missing_fields = [f for f in expected_fields if f not in actual_fields]
                
                if missing_fields:
                    print(f"   ⚠️ {expected_coll}: EXISTS but missing fields: {missing_fields}")
                else:
                    print(f"   ✅ {expected_coll}: OK ({coll.count_documents({})} docs)")
            else:
                print(f"   ❌ {expected_coll}: MISSING")

# ============================================================================
# SECTION 4: DATA STATISTICS
# ============================================================================
print("\n" + "=" * 70)
print("SECTION 4: DATA STATISTICS SUMMARY")
print("=" * 70)

total_docs = 0
for db_name in all_dbs:
    if db_name not in ['admin', 'local', 'config']:
        db = client[db_name]
        db_docs = 0
        for coll_name in db.list_collection_names():
            count = db[coll_name].count_documents({})
            db_docs += count
        total_docs += db_docs
        print(f"   {db_name}: {db_docs} total documents")

print(f"\n   📊 GRAND TOTAL: {total_docs} documents across all databases")

# ============================================================================
# SECTION 5: RECENT ACTIVITY CHECK
# ============================================================================
print("\n" + "=" * 70)
print("SECTION 5: RECENT ACTIVITY (if timestamps exist)")
print("=" * 70)

for db_name in all_dbs:
    if db_name not in ['admin', 'local', 'config']:
        db = client[db_name]
        
        for coll_name in db.list_collection_names():
            coll = db[coll_name]
            
            # Try to find most recent document by common timestamp fields
            for ts_field in ['created_at', 'updated_at', 'timestamp', 'createdAt', 'updatedAt']:
                try:
                    latest = coll.find_one(
                        {ts_field: {"$exists": True}},
                        sort=[(ts_field, -1)]
                    )
                    if latest and ts_field in latest:
                        print(f"   {db_name}.{coll_name}: Last {ts_field} = {latest[ts_field]}")
                        break
                except:
                    pass

# ============================================================================
# SECTION 6: USER & AUTH STATUS
# ============================================================================
print("\n" + "=" * 70)
print("SECTION 6: USER & AUTH STATUS")
print("=" * 70)

for db_name in all_dbs:
    if db_name not in ['admin', 'local', 'config']:
        db = client[db_name]
        
        # Check users
        if 'users' in db.list_collection_names():
            users_coll = db['users']
            total_users = users_coll.count_documents({})
            
            # Count by role if role field exists
            sample = users_coll.find_one()
            if sample and 'role' in sample:
                roles = users_coll.distinct('role')
                print(f"   {db_name}.users: {total_users} users")
                for role in roles:
                    role_count = users_coll.count_documents({'role': role})
                    print(f"      - {role}: {role_count}")
            else:
                print(f"   {db_name}.users: {total_users} users (no role field)")

# ============================================================================
# CLOSE CONNECTION
# ============================================================================
client.close()

print("\n" + "=" * 70)
print("✅ DATABASE INSPECTION COMPLETE")
print("=" * 70)
