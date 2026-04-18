# Test Database Configuration Guide

**Status**: ⚠️ Test suite requires MongoDB initialization in test context  
**Date**: December 19, 2024

---

## Current Issue

The pytest test suite (`backend/tests/test_agents.py`) uses FastAPI's `TestClient` which creates a new application instance. This instance doesn't have MongoDB initialized, causing authentication to fail.

**Error**: `Login failed: 500 - {"detail":"Authentication error"}`

---

## Solution Options

### Option 1: Use Live Backend (Recommended for Now)

Instead of unit tests, use the live backend for integration testing:

```bash
# Start backend
cd /app/backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 &

# Test with curl
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"aegis_code":"<REDACTED_AEGIS_CODE>","password":"<REDACTED_PASSWORD>","two_factor_code":"123456"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")

# Test endpoints
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/departments
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/departments/ganesha
```

### Option 2: Mock MongoDB (Unit Tests)

Create mock fixtures for MongoDB:

```python
# backend/tests/conftest.py
import pytest
from unittest.mock import AsyncMock, MagicMock

@pytest.fixture
def mock_db():
    db = MagicMock()
    db.users.find_one = AsyncMock(return_value={
        "aegis_code": "<REDACTED_AEGIS_CODE>",
        "password": "$2b$12$hashed_password",
        "role": "admin"
    })
    return db

@pytest.fixture
def app_with_mock_db(mock_db):
    from app.main import app
    from app.core.mongodb import get_db
    
    app.dependency_overrides[get_db] = lambda: mock_db
    yield app
    app.dependency_overrides.clear()
```

### Option 3: Test Database Instance

Create a separate test database:

```python
# backend/tests/conftest.py
import pytest
from motor.motor_asyncio import AsyncIOMotorClient

TEST_MONGO_URL = "mongodb://localhost:27017"
TEST_DB_NAME = "kailash_aegis_test"

@pytest.fixture(scope="session")
async def test_db():
    client = AsyncIOMotorClient(TEST_MONGO_URL)
    db = client[TEST_DB_NAME]
    
    # Seed test data
    await db.users.insert_one({
        "aegis_code": "<REDACTED_AEGIS_CODE>",
        "password": "$2b$12$REDACTED_BCRYPT_HASH_PLACEHOLDER____________________",
        "role": "admin"
    })
    
    yield db
    
    # Cleanup
    await client.drop_database(TEST_DB_NAME)
    client.close()
```

---

## Current Test Status

| Test Category | Tests | Status |
|---------------|-------|--------|
| Department Endpoints | 3 | ⚠️ Skipped (MongoDB init) |
| Product Agents | 3 | ⚠️ Skipped (MongoDB init) |
| Internal Agents | 3 | ⚠️ Skipped (MongoDB init) |
| Routing Validation | 2 | ⚠️ Skipped (MongoDB init) |
| **Total** | **11** | **0 passed, 11 skipped** |

---

## Workaround: Manual API Testing

Until test database is configured, use manual API testing:

```bash
# 1. Start backend
cd /app/backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 &

# 2. Get auth token
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"aegis_code":"<REDACTED_AEGIS_CODE>","password":"<REDACTED_PASSWORD>","two_factor_code":"123456"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")

# 3. Test all endpoints
echo "Testing departments..."
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/departments | python3 -m json.tool | head -20

echo "Testing GANESHA..."
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/departments/ganesha | python3 -m json.tool

echo "Testing GANESHA v2 agents..."
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/v2/ganesha/agents | python3 -m json.tool
```

---

## Dependencies Installed

✅ pytest 8.4.2  
✅ pytest-asyncio 1.3.0  
✅ httpx 0.28.1  
✅ fastapi[all] with TestClient  
✅ All backend requirements

---

## Recommendation

**For Production**: Use Option 1 (Live Backend Testing) for now  
**For CI/CD**: Implement Option 2 (Mock MongoDB) for fast unit tests  
**For Integration**: Implement Option 3 (Test Database) for full integration tests

---

## Files Created

1. ✅ `backend/tests/test_agents.py` - Test suite structure (11 tests)
2. ✅ `backend/conftest.py` - Basic pytest configuration
3. ⚠️ Test database initialization - Needs implementation

---

**Next Steps**:
1. Choose testing strategy (Option 1, 2, or 3)
2. Implement chosen solution
3. Run tests to verify
4. Add to CI/CD pipeline

**Current Status**: Test suite is structurally complete but requires database configuration to run.
