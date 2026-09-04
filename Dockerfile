# ── Stage 1: build frontend assets (sass + browserify) ──────────────
# node-sass 4.x needs an old Node ABI; application/dist/ is gitignored
# and must be rebuilt from source on every image build.
FROM node:12-buster AS assets

WORKDIR /gridpaste/application

COPY application/package.json application/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY application/ ./
RUN yarn run sass && yarn run js

# ── Stage 2: Django app ──────────────────────────────────────────────
FROM python:3.9-slim-bullseye AS app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=homepage.settings

WORKDIR /gridpaste

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
COPY --from=assets /gridpaste/application/dist ./application/dist

RUN mkdir -p logs

EXPOSE 8000

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["gunicorn", "--access-logfile", "-", "--workers", "3", "--bind", "0.0.0.0:8000", "homepage.wsgi:application"]
