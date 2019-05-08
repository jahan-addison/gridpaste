#!/bin/bash

poetry run python manage.py migrate
poetry run python manage.py runserver