# Copilot Instructions for AEGIS HUB (KAILASH AI)

## Project Overview
- **Domain:** kailash-ai.in
- **Purpose:** AI-powered command center for managing EV charging operations (Go4Garage URGAA)
- **Core:** Modular backend (Python), frontend (JS/React), orchestrated by AI departments and sub-agents

## Architecture & Key Components
- **Backend:**
  - Located in `/backend/` (see `server.py`, `agents/`, `app/`)
  - Major agents: GANESHA (orchestrator), VISHWAKARMA, SURYA, etc.
  - Fix/repair scripts: `fix_corruption.py`, `fix_numeric_corruption.py`, `advanced_fix.py`, `comprehensive_fix.py`
  - Uses FastAPI (see `uvicorn app.main:app ...` in docs)
  - MongoDB is the primary database (see `mongodb_*` scripts in `/scripts/`)
- **Frontend:**
  - Located in `/frontend/` (React, Tailwind, see `src/`, `components.json`)
  - Custom config: `craco.config.js`, `tailwind.config.js`
- **Docs:**
  - Start with `MASTER_DOCUMENTATION.md` and `APPLICATION_FLOW_GUIDE.md`
  - API docs: `/docs/API_REFERENCE.md` and live at `/api/docs`

## Developer Workflows
- **Start all services:**
  - Recommended: `sudo supervisorctl start all`
  - Manual backend: `cd backend && pip install -r requirements.txt && uvicorn app.main:app --host 0.0.0.0 --port 8 --reload`
  - Manual frontend: `cd frontend && yarn install && yarn start`
- **Testing:**
  - Use scripts like `backend_test.py`, `comprehensive_backend_test.py`, `investor_demo_test.py`
  - Test results in `test_result.md`, `COMPREHENSIVE_DASHBOARD_TEST_RESULTS.md`
- **Deployment:**
  - See `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile`
  - Health checks: `verify_deployment.sh`, `mongodb_health_check.sh`

## Project-Specific Conventions
- **AI Departments/Agents:**
  - Each agent in `/backend/agents/` encapsulates a business domain (see `base_department.py`)
  - GANESHA agent coordinates AI and Claude API integration
- **Security:**
  - Rate limiting, login lockout, and input sanitization are enforced (see README and backend code)
- **Data:**
  - MongoDB is required; permissions issues are a common blocker (see documentation)
- **Docs:**
  - Historical and phase docs in `/docs/archived/` and `/documentation/`

## Integration & External Dependencies
- **Claude API** for AI orchestration (see GANESHA agent)
- **MongoDB Atlas** (ensure permissions)
- **Supervisor** for process management

## Examples
- To run backend locally:
  ```bash
  cd backend
  pip install -r requirements.txt
  uvicorn app.main:app --host 0.0.0.0 --port 8 --reload
  ```
- To run all tests:
  ```bash
  python backend_test.py
  python comprehensive_backend_test.py
  ```

## Key Files & Directories
- `/backend/agents/` — AI department logic
- `/backend/server.py` — Backend entrypoint
- `/frontend/src/` — Frontend source
- `/docs/`, `/documentation/` — Extensive documentation
- `/scripts/` — Utility and DB scripts

---
For more, see `README.md`, `MASTER_DOCUMENTATION.md`, and `docs/API_REFERENCE.md`.
