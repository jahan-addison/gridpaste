.PHONY: install assets postgres-start start

SHELL := /bin/bash

install:
	$(shell sudo sh build.sh)
	$(shell source ~/.profile && nvm install v10.15.3)
	$(shell curl -sSL https\://raw.githubusercontent.com/sdispater/poetry/master/get-poetry.py | python)
	$(shell poetry install)

assets:
	source ~/.profile && nvm use \
		&& yarn --cwd ./application run sass \
		&& yarn --cwd ./application run js

postgres-start:
	sudo docker-compose up postgres

start: assets
	source ~/.profile && nvm use && yarn --cwd ./application install
	sh run.sh