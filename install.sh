#!/bin/bash

cp default.conf /etc/nginx/conf.d/default.conf
cp -r app landing /usr/share/nginx/

systemctl restart nginx

echo 'Installed'
