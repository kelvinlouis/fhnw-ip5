#!/bin/bash
imageName=ip5:latest
containerName=ip5-latest

#git fetch --all
#git reset --hard origin/master

npm install
npm run build 

cd ..

docker build --pull -t $imageName -f Dockerfile .

echo Delete old container...
docker rm -f $containerName

echo Run new container...
docker run -d -p 80:80 --name $containerName $imageName
