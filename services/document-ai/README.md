# Document AI

OCR, layout understanding, field extraction and validation.

## Consumers
- URGAA (certificates)
- GSTSAAS (invoices)
- Ignition (RC book)
- ARJUN (ID proof)

## Tech stack
- Azure Document Intelligence (bootstrap)
- LayoutLMv3 (in-house, scale)
- Tesseract fallback

## Endpoints (stub)

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/extract` | Extract structured fields from a document (multipart upload). |
| `POST` | `/ocr` | Raw OCR text + bounding boxes. |
| `POST` | `/validate` | Validate extracted fields against a schema profile (e.g. "rc_book", "gst_invoice"). |
| `GET` | `/health` | Liveness probe. |
| `GET` | `/`       | Service metadata. |

## Run locally

```bash
cd services/document-ai
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8101
```

## Docker

```bash
docker build -t kailash-ai/document-ai services/document-ai
docker run --rm -p 8101:8101 kailash-ai/document-ai
```

## Status
Scaffold only — endpoints return **501** until implementations land.
See [`docs/architecture/platform-overview.md`](../../docs/architecture/platform-overview.md) for the target architecture.
