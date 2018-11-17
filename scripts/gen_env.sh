#!/usr/bin/env bash

for line in $(cat .env)
do
  if [ ! -z ${line} ]; then
    echo "insert ${line}"
    travis encrypt ${line} -a;
  fi
done


