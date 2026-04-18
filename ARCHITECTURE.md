# Architecture

See [`docs/architecture/platform-overview.md`](docs/architecture/platform-overview.md)
for the full KAILASH-AI platform architecture, capability matrix, service
contracts, and the Automobile-LLM moat strategy.

```mermaid
flowchart LR
  Consumers["URGAA · GSTSAAS · Ignition · ARJUN · AEGIS Hub"] --> GW["platform/gateway :8100"]
  GW --> S["9 KAILASH-AI services<br/>document-ai · forecasting · anomaly · rag<br/>vision-gateway · speech · model-registry<br/>knowledge-graph · automobile-llm"]
```
