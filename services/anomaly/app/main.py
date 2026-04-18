"""Anomaly Detection Service — KAILASH-AI platform.

Detect anomalies in operational streams (SLA, fraud, trust).

Status: stub. Endpoints respond 501 until concrete implementations land.
"""
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os

SERVICE_ID = "anomaly"
SERVICE_TITLE = "Anomaly Detection"
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


@router.post("/detect")
async def handle__detect(payload: dict | None = None):
    """Score a batch of records and return anomalies + explanations."""
    raise HTTPException(status_code=501, detail="Not implemented: anomaly POST /detect")

@router.post("/train")
async def handle__train(payload: dict | None = None):
    """Fit a detector on a labeled/unlabeled sample."""
    raise HTTPException(status_code=501, detail="Not implemented: anomaly POST /train")

app.include_router(router)
