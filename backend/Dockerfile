# syntax=docker/dockerfile:1
FROM python:3.13-slim AS base

WORKDIR /app

# curl is required by the docker-compose healthcheck; python:3.13-slim does not ship it.
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

FROM base AS development

COPY requirements-dev.txt ./
RUN pip install --no-cache-dir -r requirements-dev.txt

EXPOSE 8000 5678

# NOTE: `--reload` is intentionally omitted. Combined with the bind-mount
# volume in docker-compose.yml, Python's __pycache__/.pyc writes trigger an
# infinite uvicorn restart loop. See docs/operational-blockers.md (Issue #1).
CMD ["python", "-m", "debugpy", "--listen", "0.0.0.0:5678", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

FROM base AS production

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
