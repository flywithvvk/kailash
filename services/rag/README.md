# Embedding & RAG

Shared vector store, chunking, indexing, and retrieval pipelines.

## Consumers
- All products

## Tech stack
- pgvector (start)
- Pinecone / Qdrant (scale)
- OpenAI / bge-m3 embeddings via Vision LLM Gateway

## Endpoints (stub)

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/index` | Index a document (chunks + embeddings). |
| `POST` | `/query` | Semantic / hybrid search with optional filters. |
| `DELETE` | `/documents/{doc_id}` | Remove a document and its chunks. |
| `GET` | `/health` | Liveness probe. |
| `GET` | `/`       | Service metadata. |

## Run locally

```bash
cd services/rag
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8104
```

## Docker

```bash
docker build -t kailash-ai/rag services/rag
docker run --rm -p 8104:8104 kailash-ai/rag
```

## Status
Scaffold only — endpoints return **501** until implementations land.
See [`docs/architecture/platform-overview.md`](../../docs/architecture/platform-overview.md) for the target architecture.
