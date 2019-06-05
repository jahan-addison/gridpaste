.PHONY: install assets postgres-start start

SHELL := /bin/bash

install:
    touch ~/.profile
    sudo apt update
    sudo apt install nodejs npm
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | sh
    sudo npm install -g yarn
    source ~/.profile && nvm install v10.15.3
    sudo sh build.sh
    curl -sSL https://raw.githubusercontent.com/sdispater/poetry/master/get-poetry.py | python
    poetry install

assets:
	source ~/.profile && nvm use && yarn --cwd ./application run sass

postgres-start:
	sudo docker-compose up postgres

start: assets
	source ~/.profile && nvm use && yarn --cwd ./application install
	sh run.sh
