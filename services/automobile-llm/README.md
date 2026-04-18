# Automobile LLM

Domain LLM fine-tuned on automobile/EV regulations, parts catalogs, and anonymized customer data. Starts as Llama-3.1-8B; targeted path to a 13B model licensable to OEMs and DISCOMs.

## Consumers
- All products (eventually)
- External OEM / DISCOM licensees

## Tech stack
- Llama-3.1-8B (base)
- LoRA/QLoRA fine-tuning
- Synthetic data pipelines
- Llama-3.1-13B (roadmap)

## Endpoints (stub)

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/chat/completions` | OpenAI-compatible chat completions (domain-tuned). |
| `POST` | `/complete` | Raw text completion. |
| `GET` | `/health` | Liveness probe. |
| `GET` | `/`       | Service metadata. |

## Run locally

```bash
cd services/automobile-llm
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8109
```

## Docker

```bash
docker build -t kailash-ai/automobile-llm services/automobile-llm
docker run --rm -p 8109:8109 kailash-ai/automobile-llm
```

## Status
Scaffold only — endpoints return **501** until implementations land.
See [`docs/architecture/platform-overview.md`](../../docs/architecture/platform-overview.md) for the target architecture.
