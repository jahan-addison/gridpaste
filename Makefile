lint:
	poetry run flake8 .
	
build: 
	sudo sh build.sh ; poetry install

postgres-start:
	sudo docker-compose up postgres

start:
	sh run.sh
