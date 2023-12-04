#!/usr/bin/env bash
sudo certbot delete --cert-name mindfulmediasurvey.com
sudo certbot delete --cert-name www.mindfulmediasurvey.com
sudo certbot delete --cert-name mindfulmediasurvey.us-east-1.elasticbeanstalk.com
sudo certbot -n --expand -d mindfulmediasurvey.com --nginx --agree-tos --email isintex42@gmail.com