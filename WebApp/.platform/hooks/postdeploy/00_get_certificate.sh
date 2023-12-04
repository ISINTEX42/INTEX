#!/usr/bin/env bash
sudo certbot -n -d mindfulmediasurvey.com -d www.mindfulmediasurvey.com -d --nginx --agree-tos --email isintex42@gmail.com
sudo certbot -n -d mindfulmediasurvey.us-east-1.elasticbeanstalk.com -d --nginx --agree-tos --email isintex42@gmail.com