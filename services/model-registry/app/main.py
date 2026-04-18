"""Model Registry & Evals Service — KAILASH-AI platform.

Registry of fine-tuned models, evaluation runs, and prompt/completion traces.

Status: stub. Endpoints respond 501 until concrete implementations land.
"""
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os

SERVICE_ID = "model-registry"
SERVICE_TITLE = "Model Registry & Evals"
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


@router.get("/models")
async def handle__models(payload: dict | None = None):
    """List registered models & versions."""
    raise HTTPException(status_code=501, detail="Not implemented: model-registry GET /models")

@router.post("/models")
async def handle__models(payload: dict | None = None):
    """Register a new model version."""
    raise HTTPException(status_code=501, detail="Not implemented: model-registry POST /models")

@router.get("/evals/{eval_id}")
async def handle__evals_eval_id(payload: dict | None = None):
    """Fetch an evaluation run."""
    raise HTTPException(status_code=501, detail="Not implemented: model-registry GET /evals/{eval_id}")

app.include_router(router)
