# KAILASH — AEGIS Hub

**AI-Powered Organizational Management Platform for Go4Garage URGAA**

[![Status](https://img.shields.io/badge/status-production--ready-success)](./docs/deployment/production-deployment.md)
[![Domain](https://img.shields.io/badge/domain-kailash--ai.in-blue)](https://kailash-ai.in)
[![License](https://img.shields.io/badge/license-Proprietary-lightgrey)](./LICENSE)

KAILASH AEGIS Hub is a command-center platform for managing EV charging operations
at scale. It orchestrates 20 AI "deity" departments and 4 specialized sub-agents
across a FastAPI backend, a React frontend, and a MongoDB data layer.

---

## Table of Contents

- [Architecture](#architecture)
- [Repository Layout](#repository-layout)
- [Quick Start](#quick-start)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Architecture

| Layer      | Technology                               | Location            |
| ---------- | ---------------------------------------- | ------------------- |
| Frontend   | React, TailwindCSS, CRACO                | `apps/frontend`     |
| Backend    | FastAPI (Python 3.11+), Motor, Pydantic  | `apps/backend`      |
| Database   | MongoDB / MongoDB Atlas                  | —                   |
| AI Agents  | GANESHA, VISHWAKARMA, SURYA, 17 others   | `apps/backend/agents` |
| Runtime    | Docker, Docker Compose, Nginx            | `deploy/docker`     |

See [`docs/architecture`](./docs/architecture) for detailed diagrams and flows.

## Repository Layout

```
kailash/
├── apps/
│   ├── backend/            # FastAPI service, agents, routers
│   └── frontend/           # React SPA
├── deploy/
│   ├── docker/             # docker-compose.yml, nginx.conf
│   └── scripts/            # Deployment / verification shell scripts
├── docs/
│   ├── api/                # API reference & quick-reference
│   ├── architecture/       # System design, flows, audits
│   ├── business/           # BRD, branding, market gaps
│   ├── deployment/         # Deploy & DB setup guides
│   ├── guides/             # Integration / operator guides
│   └── reports/            # Historical status, summaries, audits
├── scripts/                # Operational scripts (MongoDB, health checks)
├── tests/
│   ├── backend/            # Backend test suites
│   └── integration/        # Cross-service / demo tests
├── tools/                  # One-off utilities (seed, inspectors)
├── .devcontainer/          # VS Code dev-container definition
├── .github/                # Workflows & Copilot instructions
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+ and Yarn
- MongoDB 6+ (local or Atlas)
- Docker 24+ (optional, for containerized run)

### Run with Docker Compose
```bash
cd deploy/docker
docker compose up --build
```
Backend: `http://localhost:8000`  · Frontend: `http://localhost:3000`

### Run Locally

**Backend**
```bash
cd apps/backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn server:app --reload
```

**Frontend**
```bash
cd apps/frontend
yarn install
yarn start
```

## Development

- Coding standards and workflow: see [`CONTRIBUTING.md`](./CONTRIBUTING.md).
- Editor defaults are enforced via [`.editorconfig`](./.editorconfig).
- A pre-configured dev container is available under [`.devcontainer/`](./.devcontainer).

## Testing

```bash
# Backend unit & integration
pytest tests/backend

# Full integration / demo flows
pytest tests/integration
```

See [`docs/reports/test-results.md`](./docs/reports/test-results.md) for the
historical testing protocol.

## Deployment

Production deployment is containerized and documented in:

- [`docs/deployment/production-deployment.md`](./docs/deployment/production-deployment.md)
- [`docs/deployment/production-database-setup.md`](./docs/deployment/production-database-setup.md)
- [`deploy/scripts/`](./deploy/scripts) — automation and verification scripts

## Documentation

| Topic         | Entry point                                                            |
| ------------- | ---------------------------------------------------------------------- |
| Overview      | [`docs/guides/kailash-overview.md`](./docs/guides/kailash-overview.md) |
| Master guide  | [`docs/guides/master-documentation.md`](./docs/guides/master-documentation.md) |
| API reference | [`docs/api/api-reference.md`](./docs/api/api-reference.md)             |
| Architecture  | [`docs/architecture/`](./docs/architecture)                            |
| Deployment    | [`docs/deployment/`](./docs/deployment)                                |
| Reports       | [`docs/reports/`](./docs/reports)                                      |

## Contributing

Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) for branch naming, commit
conventions, review expectations, and the local tooling setup.

## License

This project is proprietary to **Go4Garage (URGAA)**. See [`LICENSE`](./LICENSE).

---

_Maintainer: Go4Garage Engineering · Patna, India_
