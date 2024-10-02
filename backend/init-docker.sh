#!/bin/bash

docker run --name postgres-container -e POSTGRES_USER=su -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
docker cp init-data.sh postgres-container:/init-data.sh
