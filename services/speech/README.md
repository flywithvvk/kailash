# Speech

IndicWhisper ASR + multi-voice TTS for Indian languages.

## Consumers
- Ignition
- GSTSAAS voice
- ARJUN

## Tech stack
- AI4Bharat IndicWhisper
- ElevenLabs (premium TTS)
- Coqui (self-hosted TTS)

## Endpoints (stub)

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/asr` | Speech-to-text (multipart audio). |
| `POST` | `/tts` | Text-to-speech; returns audio stream. |
| `GET` | `/health` | Liveness probe. |
| `GET` | `/`       | Service metadata. |

## Run locally

```bash
cd services/speech
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8106
```

## Docker

```bash
docker build -t kailash-ai/speech services/speech
docker run --rm -p 8106:8106 kailash-ai/speech
```

## Status
Scaffold only — endpoints return **501** until implementations land.
See [`docs/architecture/platform-overview.md`](../../docs/architecture/platform-overview.md) for the target architecture.
