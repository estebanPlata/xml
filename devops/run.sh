#!/bin/sh
BASEDIR=$(dirname "$0")
docker stop $1
docker rm $1
docker run --name=$1 \
--env-file=$BASEDIR/qa.env \
-d -p $2:80 \
$3 \
/bin/sh -c 'node app.js'