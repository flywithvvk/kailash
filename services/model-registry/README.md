# Model Registry & Evals

Registry of fine-tuned models, evaluation runs, and prompt/completion traces.

## Consumers
- Internal ML team

## Tech stack
- MLflow (registry + tracking)
- LangSmith (prompt traces)
- Braintrust (evals)

## Endpoints (stub)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/models` | List registered models & versions. |
| `POST` | `/models` | Register a new model version. |
| `GET` | `/evals/{eval_id}` | Fetch an evaluation run. |
| `GET` | `/health` | Liveness probe. |
| `GET` | `/`       | Service metadata. |

## Run locally

```bash
cd services/model-registry
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8107
```

## Docker

```bash
docker build -t kailash-ai/model-registry services/model-registry
docker run --rm -p 8107:8107 kailash-ai/model-registry
```

## Status
Scaffold only — endpoints return **501** until implementations land.
See [`docs/architecture/platform-overview.md`](../../docs/architecture/platform-overview.md) for the target architecture.
