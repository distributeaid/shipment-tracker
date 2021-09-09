#!/usr/bin/env bash

export RCLONE_CONFIG_MYS3_ACCESS_KEY_ID=$CELLAR_ADDON_KEY_ID
export RCLONE_CONFIG_MYS3_SECRET_ACCESS_KEY=$CELLAR_ADDON_KEY_SECRET
export RCLONE_CONFIG_MYS3_ENDPOINT=$CELLAR_ADDON_HOST
export RCLONE_CONFIG_MYS3_TYPE="s3"

curl https://rclone.org/install.sh | bash

rclone sync ./frontend/build mys3:$CELLAR_BUCKET.$CELLAR_ADDON_HOST --progress --s3-acl=public-read
