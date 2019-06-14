#!/bin/bash

poetry run gunicorn --access-logfile - --workers 3 --bind unix:$HOME/gridpaste/gridpaste.sock homepage.wsgi:application
