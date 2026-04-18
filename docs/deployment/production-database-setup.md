# Production Database Setup Guide

**Date**: December 19, 2024  
**Database**: kailash_aegis  
**Status**: ✅ Export Ready

---

## 📦 Database Export Complete

All local database data has been exported to production-ready format.

### Export Location
```
/tmp/production_db_export/
```

### Exported Data
- **27 departments** (including Prajapati)
- **2 users** (admin accounts)
- **7 sub-agents**
- **48 knowledge base documents**
- **14 collections total**

---

## 🚀 Import to Production

### Option 1: Automated Import (Recommended)

```bash
# Set your production MongoDB Atlas connection string
export PRODUCTION_MONGO_URL='mongodb+srv://username:password@cluster.mongodb.net'

# Run import script
bash /tmp/production_db_export/IMPORT_TO_PRODUCTION.sh
```

### Option 2: Manual Import via mongorestore

```bash
mongorestore \
  --uri="mongodb+srv://username:password@cluster.mongodb.net" \
  --db=kailash_aegis \
  --drop \
  /tmp/production_db_export/kailash_aegis/
```

### Option 3: Import via MongoDB Atlas UI

1. Go to MongoDB Atlas Console
2. Select your cluster
3. Click "Collections"
4. Click "Import Data"
5. Upload these JSON files:
   - `/tmp/production_db_export/departments.json` (27 records)
   - `/tmp/production_db_export/users.json` (2 records)
   - `/tmp/production_db_export/sub_agents.json` (7 records)
   - `/tmp/production_db_export/knowledge_base_docs.json` (48 records)

---

## 📋 What Will Be Imported

### Departments (27)
- GANESHA (AI Orchestrator)
- VISHWAKARMA (Engineering)
- SURYA (URGAA Product)
- PRAJAPATI (Creator/Builder) ✅ **NEW**
- LAKSHMI (CFO)
- KUBERA (Sales)
- And 21 more...

### Users (2)
- Admin user (<REDACTED_AEGIS_CODE>)
- Test user

### Sub-Agents (7)
- Product-specific agents
- Internal department agents

### Knowledge Base (48 documents)
- Technical documentation
- Product information
- Process guides

---

## ⚠️ Important Notes

### Before Import
1. **Backup existing production database** (if any)
2. Get production MongoDB Atlas connection string from Emergent secrets
3. Verify connection string has write permissions

### After Import
1. Verify all collections imported successfully
2. Test login with admin credentials
3. Check department list shows all 27 departments
4. Verify Prajapati department appears

### Connection String Format
```
mongodb+srv://username:password@cluster.mongodb.net/kailash_aegis?retryWrites=true&w=majority
```

---

## 🔐 Get Production MongoDB URL

Your production MongoDB URL is stored in Emergent secrets as `MONGO_URL`.

To get it:
1. Go to Emergent Platform
2. Navigate to your project settings
3. Find "Secrets" or "Environment Variables"
4. Copy the `MONGO_URL` value

---

## ✅ Verification Commands

After import, verify data:

```bash
# Connect to production
mongosh "mongodb+srv://cluster.mongodb.net/kailash_aegis" --username <user>

# Check collections
show collections

# Count documents
db.departments.countDocuments()  // Should be 27
db.users.countDocuments()        // Should be 2
db.sub_agents.countDocuments()   // Should be 7

# Verify Prajapati exists
db.departments.findOne({name: "PRAJAPATI"})
```

---

## 📊 Export Summary

| Collection | Records | File Size |
|------------|---------|-----------|
| departments | 27 | 15 KB |
| users | 2 | 898 B |
| sub_agents | 7 | 1.6 KB |
| knowledge_base_docs | 48 | 15 KB |
| analytics | 5 | 523 B |
| ganesha_commands | 3 | 567 B |
| daily_intelligence | 2 | 1.1 KB |
| department_gaps | 4 | 1.3 KB |
| department_tasks | 4 | 1.5 KB |
| knowledge_base_queries | 8 | 1.5 KB |
| live_data_cache | 9 | - |
| error_logs | 6 | 18 KB |
| activities | 0 | - |
| tasks | 0 | - |

**Total**: 125+ documents across 14 collections

---

## 🎯 Next Steps

1. ✅ Get production MongoDB Atlas URL from Emergent
2. ✅ Run import script with production URL
3. ✅ Verify all data imported
4. ✅ Test department list in production
5. ✅ Confirm Prajapati appears

---

**Made with ❤️ for KAILASH AEGIS HU** 🇮🇳⚡
