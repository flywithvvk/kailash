"""Forecasting Service — KAILASH-AI platform.

Time-series forecasting for demand, uptime, breakdowns, and energy.

Status: stub. Endpoints respond 501 until concrete implementations land.
"""
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os

SERVICE_ID = "forecasting"
SERVICE_TITLE = "Forecasting"
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


@router.post("/forecast")
async def handle__forecast(payload: dict | None = None):
    """Forecast a series given history + horizon."""
    raise HTTPException(status_code=501, detail="Not implemented: forecasting POST /forecast")

@router.post("/backtest")
async def handle__backtest(payload: dict | None = None):
    """Rolling-origin backtest with MAPE/SMAPE/MAE metrics."""
    raise HTTPException(status_code=501, detail="Not implemented: forecasting POST /backtest")

app.include_router(router)
