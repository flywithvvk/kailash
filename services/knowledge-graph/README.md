# Knowledge Graph

Unified graph over regulations, parts, HSN codes, workflows, and certifications.

## Consumers
- URGAA
- GSTSAAS
- ARJUN

## Tech stack
- Neo4j
- Cypher queries over embeddings

## Endpoints (stub)

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/cypher` | Run a parameterized Cypher query. |
| `GET` | `/entities/{entity_id}` | Fetch an entity with neighbors (1-hop). |
| `GET` | `/health` | Liveness probe. |
| `GET` | `/`       | Service metadata. |

## Run locally

```bash
cd services/knowledge-graph
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8108
```

## Docker

```bash
docker build -t kailash-ai/knowledge-graph services/knowledge-graph
docker run --rm -p 8108:8108 kailash-ai/knowledge-graph
```

## Status
Scaffold only — endpoints return **501** until implementations land.
See [`docs/architecture/platform-overview.md`](../../docs/architecture/platform-overview.md) for the target architecture.
