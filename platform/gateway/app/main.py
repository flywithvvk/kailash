"""KAILASH-AI Platform Gateway — reverse proxy to internal services."""
from __future__ import annotations

import os
import uuid
from typing import Dict

import httpx
from fastapi import FastAPI, HTTPException, Request, Response

SERVICE_MAP: Dict[str, str] = {
    "document-ai":     os.environ.get("DOCUMENT_AI_URL",     "http://document-ai:8101"),
    "forecasting":     os.environ.get("FORECASTING_URL",     "http://forecasting:8102"),
    "anomaly":         os.environ.get("ANOMALY_URL",         "http://anomaly:8103"),
    "rag":             os.environ.get("RAG_URL",             "http://rag:8104"),
    "vision-gateway":  os.environ.get("VISION_GATEWAY_URL",  "http://vision-gateway:8105"),
    "speech":          os.environ.get("SPEECH_URL",          "http://speech:8106"),
    "model-registry":  os.environ.get("MODEL_REGISTRY_URL",  "http://model-registry:8107"),
    "knowledge-graph": os.environ.get("KNOWLEDGE_GRAPH_URL", "http://knowledge-graph:8108"),
    "automobile-llm":  os.environ.get("AUTOMOBILE_LLM_URL",  "http://automobile-llm:8109"),
}

app = FastAPI(title="KAILASH-AI Platform Gateway", version="0.1.0")


@app.get("/health")
async def health():
    return {"service": "gateway", "status": "ok", "services": list(SERVICE_MAP)}


@app.api_route("/{service}/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def proxy(service: str, path: str, request: Request):
    upstream = SERVICE_MAP.get(service)
    if not upstream:
        raise HTTPException(status_code=404, detail=f"unknown service: {service}")

    request_id = request.headers.get("x-request-id") or uuid.uuid4().hex
    body = await request.body()
    headers = {k: v for k, v in request.headers.items() if k.lower() not in {"host", "content-length"}}
    headers["x-request-id"] = request_id

    url = f"{upstream.rstrip('/')}/{path}"
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.request(request.method, url, params=request.query_params, content=body, headers=headers)

    out_headers = {k: v for k, v in r.headers.items() if k.lower() not in {"content-encoding", "transfer-encoding"}}
    out_headers["x-request-id"] = request_id
    return Response(content=r.content, status_code=r.status_code, headers=out_headers)
