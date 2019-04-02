.PHONY: pip-compile pip-install lint type

setup:
	$(shell which python3.7) -m venv venv; pip install pip-tools

pip-compile:
	source venv/bin/activate; pip-compile requirements.in

pip-install:
	source venv/bin/activate; pip install --upgrade pip; pip install -r requirements.txt;

lint:
	source venv/bin/activate; flake8 gridpaste/
	
type:
	source venv/bin/activate; mypy --ignore-missing-imports gridpaste/;

build: pip-install lint type
