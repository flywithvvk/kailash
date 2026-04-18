# KAILASH AI - Current Integration Status & Data Flow

**Last Updated**: December 16, 2025
**Status**: Development/MVP Stage

---

## ✅ WHAT IS ACTUALLY INTEGRATED & WORKING

### 1. **Authentication System** ✅
**Status**: Fully Working
**Integration**:
- JWT-based authentication
- MongoDB user storage
- Temporary account system (24-hour expiration)
- Role-based access (admin, user)

**Components**:
- Backend: `/app/backend/app/api/auth.py`
- Frontend: Zustand store (`useAuthStore`)
- Database: `users` collection in MongoDB

**Data Flow**:
```
User Login → POST /api/auth/login
    ↓
Backend validates credentials against MongoDB
    ↓
Generate JWT token (24-hour expiry)
    ↓
Return token + user info
    ↓
Frontend stores in localStorage
    ↓
All subsequent requests use: Authorization: Bearer {token}
```

---

### 2. **Knowledge Base System** ✅
**Status**: Fully Working
**Integration**:
- **Pre-Data**: 84 static knowledge files (Markdown + JSON)
  - 20 departments × 4 files each = 80 files
  - 1 global directory × 4 files = 4 files
- **Post-Data**: Daily intelligence storage structure
- File-based storage (no database)

**Components**:
- Pre-Data: `/app/backend/knowledge/pre-data/`
- Post-Data: `/app/backend/knowledge/post-data/`
- Config: `/app/backend/knowledge/config/api_sources.json`

**Data Flow**:
```
Pre-Data (Static):
Files on disk → API reads files → Frontend displays

Post-Data (Dynamic):
Perplexity API → Daily intelligence → Saved to JSON files → API reads → Frontend displays
```

---

### 3. **Daily Learning Pipeline** ✅ (Manual Trigger Only)
**Status**: Working but NOT Automated
**Integration**:
- **Perplexity API**: Real-time search integration
  - Model: "sonar"
  - API Key: Configured in `.env`
- **Claude LLM** (via Emergent Integrations): Intelligence processing
- **Celery**: Task queue (installed but not auto-scheduled)
- **Redis**: Message broker (running)

**Components**:
- Pipeline: `/app/backend/app/tasks/daily_learning.py`
- API Endpoint: `POST /api/knowledge/trigger-learning`
- Data Storage: `/app/backend/knowledge/post-data/`

**Data Flow**:
```
MANUAL TRIGGER (Admin only):
POST /api/knowledge/trigger-learning
    ↓
Start background task (Celery)
    ↓
For each department (20 departments):
    1. Query Perplexity API with department-specific query
    2. Receive intelligence + citations
    3. Process with Claude LLM (extract relevant insights)
    4. Save to /post-data/daily-digest/{date}/{department}.json
    5. Wait 2 seconds (rate limiting)
    ↓
Generate summary.json
    ↓
Complete (takes ~60-90 seconds)
```

**What's NOT Working**:
- ❌ Automatic daily execution at 06:00 UTC
- ❌ Celery Beat scheduler not configured

---

### 4. **Department Intelligence API** ✅
**Status**: Fully Working
**Integration**:
- MongoDB collections:
  - `department_gaps` - Detected issues
  - `department_tasks` - Current tasks
  - `sub_agents` - AI agents per department
- API sources config (file-based)
- Knowledge files (file-based)

**Components**:
- API: `/app/backend/app/api/department_intelligence.py`
- Endpoints:
  - `GET /api/departments/{name}/summary`
  - `POST /api/departments/{name}/detect-gaps`

**Data Flow**:
```
Frontend requests department summary:
GET /api/departments/lakshmi/summary
    ↓
Backend gathers data from multiple sources:
    1. Pre-data files (domain_expertise.md, rules.json, etc.)
    2. Post-data files (latest intelligence)
    3. MongoDB: gaps, tasks, sub_agents
    4. Config: API sources
    ↓
Combine all data into single response
    ↓
Return JSON with:
    - Department info
    - Automation rate
    - API sources (4 for LAKSHMI)
    - Latest intelligence
    - Gaps (1 for LAKSHMI)
    - Tasks (2 for LAKSHMI)
    - Sub-agents (3 for LAKSHMI)
    - Daily tasks
    ↓
Frontend displays on department page
```

---

### 5. **Gap Detection & Alert System** ✅ (Manual Only)
**Status**: Structure Working, Detection Manual
**Integration**:
- MongoDB collections:
  - `department_gaps` - Store detected gaps
  - `ganesha_alerts` - Alerts to GANESHA
  - `parvati_alerts` - Escalations to PARVATI
- Alert flow: Department → GANESHA → PARVATI

**Components**:
- Gap storage: MongoDB
- Alert logic: `/app/backend/app/api/department_intelligence.py`

**Data Flow**:
```
Gap Detected (currently manual sample data):
    ↓
Store in department_gaps collection:
    - gap_id
    - department
    - severity (critical/high/medium/low)
    - category (compliance/data/api/policy)
    - title, description
    - detected_at timestamp
    - alerted_to_ganesha: false
    - alerted_to_parvati: false
    ↓
Alert GANESHA:
    - Create alert in ganesha_alerts collection
    - Update gap: alerted_to_ganesha = true
    ↓
If severity = critical OR high:
    - Escalate to PARVATI
    - Create alert in parvati_alerts collection
    - Update gap: alerted_to_parvati = true
    ↓
Frontend displays gap with alert badges:
    ✓ Alerted to GANESHA
    ✓ Escalated to PARVATI
```

**What's NOT Working**:
- ❌ Automatic gap detection (no real monitoring)
- ❌ API health checks
- ❌ Compliance deadline monitoring

---

### 6. **Frontend Department Pages** ✅
**Status**: Fully Working
**Integration**:
- React Router for navigation
- Fetch API for backend calls
- localStorage for token storage
- Tailwind CSS for styling

**Components**:
- Main page: `/app/frontend/src/pages/DepartmentDetailNew.jsx`
- Routing: `/app/frontend/src/App.js`
- Auth store: Zustand

**Data Flow**:
```
User clicks department:
    ↓
Navigate to /department/lakshmi
    ↓
Component loads:
    1. Get token from localStorage
    2. Fetch department summary from API
    3. Display loading state
    ↓
API response received:
    4. Parse and set state
    5. Render sections:
       - Department overview (4 metrics)
       - Latest intelligence
       - API sources (grid)
       - Gaps & issues (if any)
       - Current tasks
       - Sub-agents
       - Daily tasks
    ↓
User sees complete department page
```

---

### 7. **MongoDB Database** ✅
**Status**: Fully Working
**Integration**:
- Motor (async MongoDB driver)
- Connection pooling
- Multiple collections

**Collections in Use**:
```javascript
users                   // User accounts
department_gaps         // Detected gaps (3 records)
department_tasks        // Current tasks (4 records)
sub_agents             // AI agents (7 records)
ganesha_alerts         // GANESHA notifications
parvati_alerts         // PARVATI escalations
conversations          // Chat history
dashboard_cache        // Cached data
```

**Data Flow**:
```
Application startup:
    ↓
Connect to MongoDB (mongodb://localhost:27017)
    ↓
Initialize collections
    ↓
All CRUD operations use Motor async driver
    ↓
Queries return documents (exclude _id)
```

---

### 8. **API Configuration** ✅
**Status**: Configured but NOT Integrated
**Integration**:
- JSON file with API source definitions
- 13 API sources across 6 departments
- NO actual API calls being made

**File**: `/app/backend/knowledge/config/api_sources.json`

**Configured APIs**:
```json
LAKSHMI: RBI Policy, GST Updates, Stripe API, Financial Data
VISHWAKARMA: GitHub, Stack Overflow, AWS Service Health
INDRA: CVE Database, NIST Security
YAMA: GDPR Updates, MCA Portal
SURYA: DISCOM Tariff, OCPP Standards, Weather API
VARUNA: Twilio, SendGrid
```

**What's NOT Working**:
- ❌ No actual API health monitoring
- ❌ No authentication setup
- ❌ No real data being fetched from these APIs
- ❌ Static configuration only

---

### 9. **Environment Variables** ✅
**Status**: Configured
**Integration**:
- `.env` files in backend and frontend
- dotenv for loading

**Backend** (`/app/backend/.env`):
```bash
MONGO_URL=mongodb://localhost:27017
EMERGENT_LLM_KEY=sk-emergent-xxx
PERPLEXITY_API_KEY=pplx-REDACTED
REDIS_URL=redis://localhost:6379/0
```

**Frontend** (`/app/frontend/.env`):
```bash
REACT_APP_BACKEND_URL=https://kailash-ai.in/api
```

---

### 10. **Supervisor Services** ✅
**Status**: Running
**Integration**:
- Backend: FastAPI on port 8001
- Frontend: React dev server on port 3000
- Hot reload enabled

**Services**:
```bash
backend    RUNNING   pid xxx
frontend   RUNNING   pid xxx
```

---

## ❌ WHAT IS NOT INTEGRATED

### 1. **Real-time IoT Data**
- ❌ No OCPP integration
- ❌ No charger telemetry
- ❌ No WebSocket connections
- ❌ No sensor data streaming

### 2. **Machine Learning Models**
- ❌ No trained models
- ❌ No prediction endpoints
- ❌ No model serving infrastructure

### 3. **Time-Series Database**
- ❌ No InfluxDB or TimescaleDB
- ❌ No high-frequency data storage
- ❌ Only MongoDB (document store)

### 4. **Payment Processing**
- ❌ Stripe API key exists but no integration
- ❌ No payment flow implemented
- ❌ No billing system

### 5. **Mobile Apps**
- ❌ No iOS app
- ❌ No Android app
- ❌ Web only

### 6. **Real-time Monitoring**
- ❌ No WebSocket dashboard
- ❌ No live updates
- ❌ Batch updates only

### 7. **Automatic Scheduling**
- ❌ Celery Beat not configured
- ❌ Manual trigger only for daily learning

### 8. **API Integrations**
- ❌ No actual calls to RBI, GST, GitHub, etc.
- ❌ Configuration exists but not used

---

## 📊 COMPLETE DATA FLOW DIAGRAM

### Current System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER (Browser)                        │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTPS
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  React Frontend (Port 3000)                  │
│  - Login page                                                │
│  - Executive dashboard                                       │
│  - Department detail pages                                   │
│  - Zustand (state management)                               │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ REST API (JWT token)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                FastAPI Backend (Port 8001)                   │
│                                                              │
│  Endpoints:                                                  │
│  - POST /api/auth/login                                     │
│  - GET  /api/departments/{name}/summary                     │
│  - POST /api/knowledge/trigger-learning                     │
│  - POST /api/departments/{name}/detect-gaps                 │
│                                                              │
└──┬────────────────┬─────────────────┬──────────────────┬────┘
   │                │                 │                  │
   │ MongoDB        │ File System     │ Perplexity API   │ Celery
   │                │                 │                  │
   ↓                ↓                 ↓                  ↓
┌────────┐   ┌──────────────┐   ┌──────────┐   ┌──────────┐
│MongoDB │   │Knowledge Base│   │Perplexity│   │  Redis   │
│        │   │              │   │   API    │   │ (Broker) │
│users   │   │/pre-data/... │   │          │   │          │
│gaps    │   │/post-data/...│   │API calls │   │Task Queue│
│tasks   │   │/config/...   │   │(manual)  │   │          │
│agents  │   │              │   │          │   │          │
└────────┘   └──────────────┘   └──────────┘   └──────────┘
```

---

## 🔄 DETAILED DATA FLOWS

### Flow 1: User Login
```
1. User enters AEGIS code + password
2. POST /api/auth/login
3. Backend queries MongoDB users collection
4. Validate password (bcrypt)
5. Generate JWT token (24h expiry)
6. Return: {access_token, user{full_name, is_admin}}
7. Frontend stores token in localStorage
8. Redirect to dashboard
```

### Flow 2: View Department Page
```
1. User navigates to /department/lakshmi
2. Component fetches: GET /api/departments/lakshmi/summary
3. Backend performs 5 parallel operations:
   a. Read /pre-data/internal/lakshmi/domain_expertise.md
   b. Read /pre-data/internal/lakshmi/rules.json
   c. Read /post-data/daily-digest/2025-12-15/lakshmi.json
   d. Query MongoDB: department_gaps where department=lakshmi
   e. Query MongoDB: department_tasks where department=lakshmi
   f. Query MongoDB: sub_agents where department=lakshmi
   g. Read /config/api_sources.json for LAKSHMI
4. Combine all data into single JSON response
5. Frontend renders:
   - Overview: automation 90%, 1 gap, 2 tasks, 3 agents
   - API Sources: 4 sources (RBI, GST, Stripe, World Bank)
   - Gap: "GST API Authentication Expired" (HIGH)
   - Tasks: 2 tasks with status
   - Agents: 3 agents with active/idle status
```

### Flow 3: Daily Learning Pipeline (Manual Trigger)
```
1. Admin calls: POST /api/knowledge/trigger-learning
2. Backend starts Celery task: daily_learning_pipeline()
3. For each of 20 departments:
   a. Build query (e.g., "Latest fintech trends for LAKSHMI")
   b. Call Perplexity API with query
   c. Receive intelligence + citations
   d. Call Claude LLM to process and extract insights
   e. Save to /post-data/daily-digest/{date}/{dept}.json
   f. Save to /post-data/department-specific/{scope}/{dept}/{date}.json
   g. Wait 2 seconds
4. Generate summary.json with success/failure counts
5. Return: {status: "started", message: "Pipeline running"}
6. Takes 60-90 seconds to complete
```

### Flow 4: Gap Detection (Manual)
```
1. Admin or system calls: POST /api/departments/lakshmi/detect-gaps
2. Backend creates sample gap (currently hardcoded):
   {
     gap_id: "gap_lakshmi_xxx",
     department: "lakshmi",
     severity: "high",
     category: "api",
     title: "GST API Authentication Expired",
     description: "...",
     detected_at: "2025-12-16T...",
     resolved: false
   }
3. Save to MongoDB: department_gaps
4. Trigger alert_ganesha() function:
   a. Create alert in ganesha_alerts collection
   b. Update gap: alerted_to_ganesha = true
5. If severity = high or critical:
   - Trigger alert_parvati() function
   - Create alert in parvati_alerts collection
   - Update gap: alerted_to_parvati = true
6. Return: {status: "success", gaps_detected: 1}
```

---

## 📈 DATA STATISTICS

**Current Data in System**:
```
Knowledge Files: 84 files (332 KB)
  - Pre-data: 80 files (4 per department × 20)
  - Global: 4 files

Post-data: 20 files per day (~500 KB)
  - Daily digest: 20 department files + 1 summary

MongoDB Records: ~20 records
  - Users: 2 (admin + temp user)
  - Gaps: 3 (LAKSHMI, VISHWAKARMA, SURYA)
  - Tasks: 4
  - Sub-agents: 7
  - Alerts: Created on-demand

API Configurations: 13 sources
  - But NO actual data from these APIs
```

**Data Flow Rate**:
```
Daily Intelligence: Manual trigger only
  - If run daily: 20 files/day × 30 KB = 600 KB/day
  - Monthly: ~18 MB

User Requests: ~10-50 requests/minute (development)
  - Login: Once per session
  - Department pages: 1 request per page load
  - API response time: < 200ms
```

---

## 🎯 SUMMARY

### What Works (Data Flows)
✅ User login → JWT token → Authenticated requests
✅ Department page request → Multi-source data fetch → Display
✅ Manual intelligence gathering → Perplexity → Claude → File storage
✅ Gap creation → MongoDB → Alert GANESHA/PARVATI
✅ Frontend ↔️ Backend communication (REST API)

### What Doesn't Work (No Data Flow)
❌ Real-time IoT data → No sensors connected
❌ Automatic daily learning → No scheduler
❌ API health monitoring → No actual API calls
❌ Payment processing → No Stripe integration
❌ Real-time alerts → No WebSocket
❌ ML predictions → No models deployed

### Current System Type
**Knowledge Management System with Alert Framework**
- Stores and retrieves knowledge
- Manual intelligence updates
- Gap tracking and alerting
- Department structure and organization

**NOT Yet**:
- Real-time monitoring system
- Predictive AI system
- Operational automation system
- Production IoT platform

---

**Last Integration**: December 16, 2025
**Next Priority**: Fix auth bug, automate daily learning, add real API monitoring
