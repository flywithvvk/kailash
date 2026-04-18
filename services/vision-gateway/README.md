# Vision LLM Gateway

Route vision/text LLM calls across GPT-4o, Gemini 1.5, Claude 3.5, and OpenRouter based on cost, latency, and capability.

## Consumers
- All products

## Tech stack
- OpenRouter
- OpenAI / Anthropic / Google GenAI SDKs
- Cost- & latency-aware router

## Endpoints (stub)

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/chat/completions` | OpenAI-compatible completions (auto-route). |
| `POST` | `/vision/analyze` | Analyze an image + prompt; structured JSON response. |
| `POST` | `/embeddings` | Generate embeddings via the configured embedding model. |
| `GET` | `/health` | Liveness probe. |
| `GET` | `/`       | Service metadata. |

## Run locally

```bash
cd services/vision-gateway
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8105
```

## Docker

```bash
docker build -t kailash-ai/vision-gateway services/vision-gateway
docker run --rm -p 8105:8105 kailash-ai/vision-gateway
```

## Status
Scaffold only — endpoints return **501** until implementations land.
See [`docs/architecture/platform-overview.md`](../../docs/architecture/platform-overview.md) for the target architecture.
