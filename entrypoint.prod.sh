#!/bin/bash

rsync -arv --progress /usr/src/cache/node_modules/. /usr/src/app/node_modules/
rsync -arv --progress /usr/src/cache/.next/. /usr/src/app/.next/

echo "Starting frontend..."
exec yarn start
