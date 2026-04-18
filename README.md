# KAILASH-AI

> **The engine room.** Shared ML/AI platform that powers every sibling
> product. Not sold directly — treat as internal infrastructure.

KAILASH-AI exposes nine services behind a single gateway. Consumer
products (URGAA, GSTSAAS, Ignition, ARJUN, AEGIS Hub) call into the
gateway over HTTP with a shared internal token.

| Service | Port | Purpose |
|---|---|---|
| `platform/gateway`         | 8100 | Reverse proxy, auth forwarding, tracing |
| `services/document-ai`     | 8101 | OCR, layout, extraction, validation |
| `services/forecasting`     | 8102 | Demand, uptime, breakdown, energy |
| `services/anomaly`         | 8103 | SLA / fraud / trust anomaly detection |
| `services/rag`             | 8104 | Embeddings + shared vector store |
| `services/vision-gateway`  | 8105 | Routes GPT-4o / Gemini 1.5 / Claude 3.5 |
| `services/speech`          | 8106 | IndicWhisper ASR + TTS |
| `services/model-registry`  | 8107 | MLflow + LangSmith + Braintrust |
| `services/knowledge-graph` | 8108 | Neo4j + Cypher over embeddings |
| `services/automobile-llm`  | 8109 | Llama-3.1-8B → 13B fine-tune (the moat) |

Full design, capability matrix, and the Automobile-LLM moat strategy are
in [`docs/architecture/platform-overview.md`](docs/architecture/platform-overview.md).
Quick visual: [`ARCHITECTURE.md`](ARCHITECTURE.md).

## Repository Layout

```
apps/                  Consumer apps (AEGIS Hub backend + frontend)
platform/
  gateway/             Single entry point for consumers
  shared/              Response envelope, internal auth
services/              The 9 KAILASH-AI services (FastAPI, Dockerized)
deploy/docker/         docker-compose files (incl. docker-compose.platform.yml)
docs/                  architecture, api, deployment, guides
scripts/ · tools/      dev & ops utilities
tests/                 cross-cutting tests
```

## Quick Start

### Run the whole platform locally

```bash
cd deploy/docker
docker compose -f docker-compose.platform.yml up -d
curl http://localhost:8100/health
curl http://localhost:8100/document-ai/health
```

### Run the AEGIS Hub consumer (backend)

```bash
cd apps/backend
cp .env.example .env            # fill in your keys (OpenRouter, Mongo, etc.)
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## AI Provider Configuration

The backend chooses an LLM provider in this precedence:

1. `OPENROUTER_API_KEY` → OpenAI-compatible `/chat/completions`
2. `ANTHROPIC_API_KEY`  → Claude direct
3. Keyword fallback (no network calls)

See `apps/backend/.env.example`.

## Service Contract

Every service exposes:

- `GET /health` — `{ "service": "...", "status": "ok", "version": "..." }`
- `GET /`       — metadata
- Domain endpoints returning `platform.shared.schemas.ApiResponse`

Internal auth: callers send `X-Platform-Token`; services validate via
`platform.shared.auth.require_internal_token`. The gateway forwards the
header unchanged and propagates `x-request-id`.

## Security & Secrets

- **No real secrets in the repo.** `.env.example` files are the source of truth for variable names.
- Push protection is enabled upstream; commits containing provider keys are rejected automatically.
- If a secret ever lands: rotate the key at the provider, then scrub history.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

Proprietary — see [`LICENSE`](LICENSE).
