#!/bin/sh

sudo docker-compose down

sudo docker image rm server-node

sudo docker builder prune -f

sudo docker-compose up -d

echo "done"
