"""Document AI Service — KAILASH-AI platform.

OCR, layout understanding, field extraction and validation.

Status: stub. Endpoints respond 501 until concrete implementations land.
"""
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os

SERVICE_ID = "document-ai"
SERVICE_TITLE = "Document AI"
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


@router.post("/extract")
async def handle__extract(payload: dict | None = None):
    """Extract structured fields from a document (multipart upload)."""
    raise HTTPException(status_code=501, detail="Not implemented: document-ai POST /extract")

@router.post("/ocr")
async def handle__ocr(payload: dict | None = None):
    """Raw OCR text + bounding boxes."""
    raise HTTPException(status_code=501, detail="Not implemented: document-ai POST /ocr")

@router.post("/validate")
async def handle__validate(payload: dict | None = None):
    """Validate extracted fields against a schema profile (e.g. "rc_book", "gst_invoice")."""
    raise HTTPException(status_code=501, detail="Not implemented: document-ai POST /validate")

app.include_router(router)
