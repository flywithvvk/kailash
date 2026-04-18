# KAILASH-AI developer Makefile
# Works on Linux/macOS and Windows (Git Bash / WSL).

PY ?= python
SERVICES := document-ai forecasting anomaly rag vision-gateway speech model-registry knowledge-graph automobile-llm
COMPOSE := docker compose -f deploy/docker/docker-compose.platform.yml

.PHONY: help install install-shared install-services test test-shared test-services lint fmt up down logs ps clean

help:
	@echo "Targets:"
	@echo "  install           create venv and install platform + all services"
	@echo "  install-shared    install kailash_shared into current python"
	@echo "  install-services  install each service requirements.txt"
	@echo "  test              run all tests (shared + each service)"
	@echo "  lint              ruff check on services + platform"
	@echo "  fmt               ruff format"
	@echo "  up / down / logs  docker compose for the full platform"

install: install-shared install-services

install-shared:
	$(PY) -m pip install -e platform
	$(PY) -m pip install pytest httpx

install-services:
	@for s in $(SERVICES); do \
		echo "[install] $$s"; \
		$(PY) -m pip install -r services/$$s/requirements.txt; \
	done
	$(PY) -m pip install python-multipart

test: test-shared test-services

test-shared:
	$(PY) -m pytest -q tests/platform

test-services:
	@for s in $(SERVICES); do \
		echo "::group::$$s"; \
		( cd services/$$s && $(PY) -m pytest -q ) || exit $$?; \
		echo "::endgroup::"; \
	done

lint:
	$(PY) -m ruff check platform services

fmt:
	$(PY) -m ruff format platform services

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

clean:
	find . -type d -name __pycache__ -prune -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .pytest_cache -prune -exec rm -rf {} + 2>/dev/null || true
