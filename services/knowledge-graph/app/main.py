"""Knowledge Graph Service — KAILASH-AI platform.

Unified graph over regulations, parts, HSN codes, workflows, and certifications.

Status: stub. Endpoints respond 501 until concrete implementations land.
"""
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os

SERVICE_ID = "knowledge-graph"
SERVICE_TITLE = "Knowledge Graph"
VERSION = "0.1.0"

app = FastAPI(title=f"KAILASH-AI · {SERVICE_TITLE}", version=VERSION)
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter()


@app.get("/health")
async def health():
    return {"service": SERVICE_ID, "status": "ok", "version": VERSION}


@app.get("/")
async def root():
    return {"service": SERVICE_ID, "title": SERVICE_TITLE, "version": VERSION}


@router.post("/cypher")
async def handle__cypher(payload: dict | None = None):
    """Run a parameterized Cypher query."""
    raise HTTPException(status_code=501, detail="Not implemented: knowledge-graph POST /cypher")

@router.get("/entities/{entity_id}")
async def handle__entities_entity_id(payload: dict | None = None):
    """Fetch an entity with neighbors (1-hop)."""
    raise HTTPException(status_code=501, detail="Not implemented: knowledge-graph GET /entities/{entity_id}")

app.include_router(router)
