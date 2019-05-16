.PHONY: lint assets install postgres-start start

lint:
	poetry run flake8 .

assets:
	. ~/.profile && nvm use
	yarn --cwd ./application run sass

install:
	sudo apt install nodejs
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
	npm install -g yarn
	. ~/.profile && nvm install v10.15.3
	sudo sh build.sh
	poetry install

postgres-start:
	sudo docker-compose up postgres

start: assets
	. ~/.profile && nvm use
	yarn --cwd ./application install
	sh run.sh
