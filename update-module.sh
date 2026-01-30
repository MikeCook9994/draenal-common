if [ $1 ] then
    docker container stop foundryvtt
end

git pull
ln -s ./module /home/mike/homelab/pve1/warlock/foundry/data/modules/data/Data/modules/draenal-common

if [ $1 ] then
    docker container start foundryvtt
end
