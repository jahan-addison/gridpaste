.PHONY: lint assets install postgres-start start

SHELL := /bin/bash

lint:
	poetry run flake8 .

assets:
	source ~/.profile && nvm use && yarn --cwd ./application run sass

install:
	touch ~/.profile
	sudo apt update
	sudo apt install nodejs npm
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
	sudo npm install -g yarn
	source ~/.profile && nvm install v10.15.3
	sudo sh build.sh
	poetry install

postgres-start:
	sudo docker-compose up postgres

start: assets
	source ~/.profile && nvm use && yarn --cwd ./application install
	sh run.sh
