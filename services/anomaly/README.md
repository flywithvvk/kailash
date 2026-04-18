# Anomaly Detection

Detect anomalies in operational streams (SLA, fraud, trust).

## Consumers
- URGAA (SLA breaches)
- GSTSAAS (invoice fraud)
- Ignition (charger trust)

## Tech stack
- Isolation Forest
- Autoencoder (torch)
- Streaming z-score baseline

## Endpoints (stub)

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/detect` | Score a batch of records and return anomalies + explanations. |
| `POST` | `/train` | Fit a detector on a labeled/unlabeled sample. |
| `GET` | `/health` | Liveness probe. |
| `GET` | `/`       | Service metadata. |

## Run locally

```bash
cd services/anomaly
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8103
```

## Docker

```bash
docker build -t kailash-ai/anomaly services/anomaly
docker run --rm -p 8103:8103 kailash-ai/anomaly
```

## Status
Scaffold only — endpoints return **501** until implementations land.
See [`docs/architecture/platform-overview.md`](../../docs/architecture/platform-overview.md) for the target architecture.
