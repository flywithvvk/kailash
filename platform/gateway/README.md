# Platform Gateway

Single entry point for consumer products. Routes `/<service>/<path>` to the
corresponding internal FastAPI service. Forwards `X-Platform-Token` for
upstream auth and propagates `x-request-id`.

Override upstream URLs via `DOCUMENT_AI_URL`, `FORECASTING_URL`,
`ANOMALY_URL`, `RAG_URL`, `VISION_GATEWAY_URL`, `SPEECH_URL`,
`MODEL_REGISTRY_URL`, `KNOWLEDGE_GRAPH_URL`, `AUTOMOBILE_LLM_URL`.

```bash
cd platform/gateway
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8100
```
