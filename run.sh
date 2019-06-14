#!/bin/bash

poetry run gunicorn --access-logfile - --workers 3 --bind unix:/home/wired/gridpaste/gridpaste.sock homepage.wsgi:application
