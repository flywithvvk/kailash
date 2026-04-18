"""Embedding & RAG Service — KAILASH-AI platform.

Shared vector store, chunking, indexing, and retrieval pipelines.

Status: stub. Endpoints respond 501 until concrete implementations land.
"""
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os

SERVICE_ID = "rag"
SERVICE_TITLE = "Embedding & RAG"
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


@router.post("/index")
async def handle__index(payload: dict | None = None):
    """Index a document (chunks + embeddings)."""
    raise HTTPException(status_code=501, detail="Not implemented: rag POST /index")

@router.post("/query")
async def handle__query(payload: dict | None = None):
    """Semantic / hybrid search with optional filters."""
    raise HTTPException(status_code=501, detail="Not implemented: rag POST /query")

@router.delete("/documents/{doc_id}")
async def handle__documents_doc_id(payload: dict | None = None):
    """Remove a document and its chunks."""
    raise HTTPException(status_code=501, detail="Not implemented: rag DELETE /documents/{doc_id}")

app.include_router(router)
