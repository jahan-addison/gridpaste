FROM python:3.7.3-stretch

RUN apt-get update && \
    apt-get install libbz2-dev

WORKDIR /dayz-maps

COPY pyproject.toml .

RUN poetry install

COPY . .

ENTRYPOINT [ "python", "gridpaste" ]
