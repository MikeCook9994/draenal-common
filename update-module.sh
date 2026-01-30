#!/bin/bash

if [ $1 == "true" ] then
    docker container stop foundryvtt
fi

git pull
ln -s ./module /home/mike/homelab/pve1/warlock/foundry/data/modules/data/Data/modules/draenal-common

if [ $1 == "true" ] then
    docker container start foundryvtt
fi
