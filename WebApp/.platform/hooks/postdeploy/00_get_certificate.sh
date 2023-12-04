#!/usr/bin/env bash
sudo certbot -n --expand -d mindfulmediasurvey.com,www.mindfulmediasurvey.com --nginx --agree-tos --email isintex42@gmail.com
sudo certbot -n --expand -d mindfulmediasurvey.us-east-1.elasticbeanstalk.com --nginx --agree-tos --email isintex42@gmail.com