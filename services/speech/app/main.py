"""Speech Service — KAILASH-AI platform.

IndicWhisper ASR + multi-voice TTS for Indian languages.

Status: stub. Endpoints respond 501 until concrete implementations land.
"""
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os

SERVICE_ID = "speech"
SERVICE_TITLE = "Speech"
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


@router.post("/asr")
async def handle__asr(payload: dict | None = None):
    """Speech-to-text (multipart audio)."""
    raise HTTPException(status_code=501, detail="Not implemented: speech POST /asr")

@router.post("/tts")
async def handle__tts(payload: dict | None = None):
    """Text-to-speech; returns audio stream."""
    raise HTTPException(status_code=501, detail="Not implemented: speech POST /tts")

app.include_router(router)
