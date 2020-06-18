#!/usr/bin/env bash

# See https://github.com/headout/deployment/wiki/Continuous-Integration-&-Deployment for details

set -e

mkdir -p .ebextensions
rm -rf .ebextensions/*

cat > .ebextensions/app.config << EOC
option_settings:
  aws:elasticbeanstalk:application:
    'Application Healthcheck URL': 'HTTP:80/api/health-check'
EOC

cat > Dockerrun.aws.json << EOL
{
  "AWSEBDockerrunVersion": 2,
  "authentication": {
    "bucket": "$AWS_EB_S3_BUCKET",
    "key": "docker/.dockercfg"
  },
  "volumes": [
    {
      "name": "mystique-logs",
      "host": {
        "sourcePath": "/var/log/mystique"
      }
    }
  ],
  "containerDefinitions": [
    {
      "name": "mystique",
      "image": "$ECR_DOCKER_REPO_HOST/headout/mystique:$DOCKER_IMAGE_TAG",
      "essential": true,
      "memoryReservation": 1536,
      "dockerLabels": {
        "git_hash": "$(git show -s --format=%h)",
        "git_version": "${TRAVIS_TAG:-$TRAVIS_BRANCH}",
        "app_env": "$APP_ENV"
      },
      "portMappings": [
        {"hostPort": 80, "containerPort": 3000}
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "$APP_ENV"},
        {"name": "PORT", "value": "3000"}
      ],
      "mountPoints": [
        {
          "sourceVolume": "mystique-logs",
          "containerPath": "/mystique/log",
          "readOnly": false
        }
      ]
    }
  ]
}
EOL
