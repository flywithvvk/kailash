# Forecasting

Time-series forecasting for demand, uptime, breakdowns, and energy.

## Consumers
- All products

## Tech stack
- Prophet / NeuralProphet
- XGBoost (regressor stack)

## Endpoints (stub)

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/forecast` | Forecast a series given history + horizon. |
| `POST` | `/backtest` | Rolling-origin backtest with MAPE/SMAPE/MAE metrics. |
| `GET` | `/health` | Liveness probe. |
| `GET` | `/`       | Service metadata. |

## Run locally

```bash
cd services/forecasting
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8102
```

## Docker

```bash
docker build -t kailash-ai/forecasting services/forecasting
docker run --rm -p 8102:8102 kailash-ai/forecasting
```

## Status
Scaffold only — endpoints return **501** until implementations land.
See [`docs/architecture/platform-overview.md`](../../docs/architecture/platform-overview.md) for the target architecture.
