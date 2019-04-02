FROM python:3.7.2-stretch

RUN apt-get update

COPY . /newgrid/

RUN cd gridpaste/ && \
    pip install -r requirements.txt

WORKDIR /newgrid
ENTRYPOINT [ "python", "gridpaste" ]
