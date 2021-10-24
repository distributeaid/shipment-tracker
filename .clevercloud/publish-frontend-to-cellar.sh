#!/usr/bin/env bash

[ "$DEBUG" == 'true' ] && set -x
set -e

cd frontend
export REACT_APP_VERSION=$COMMIT_ID
yarn build
cd ..

curl -O https://downloads.rclone.org/rclone-current-linux-amd64.zip
unzip rclone-current-linux-amd64.zip

echo "Uploading site to bucket $CELLAR_BUCKET ..."

export RCLONE_CONFIG_MYS3_ACCESS_KEY_ID=$CELLAR_ADDON_KEY_ID
export RCLONE_CONFIG_MYS3_SECRET_ACCESS_KEY=$CELLAR_ADDON_KEY_SECRET
export RCLONE_CONFIG_MYS3_ENDPOINT=$CELLAR_ADDON_HOST
export RCLONE_CONFIG_MYS3_TYPE="s3"

./rclone-*-linux-amd64/rclone sync ./frontend/build mys3:$CELLAR_BUCKET --progress --s3-acl=public-read

echo "Done. Site should be available on $ORIGIN now."