# CI/CD

If you need to add a new env variable, do not forget to update ./config.yml and backend-task-definition-template.json files

Some sensitive information, like database connection was moved to circleci.com panel.
It is much safe to keep such information there and not expose it to everyone who can access the code repository.

Currently any changes to master and develop branches are triggering CI/CD pipeline to build docker image (Dockerfile) and update Fargate service at AWS.

# CircleCI ENVs

set the following env variables at circleci project configuration

AWS_DEFAULT_REGION

// is used by CI to apply changes
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY

AWS_ACCESS_KEY_ID_DEV
AWS_SECRET_ACCESS_KEY_DEV
DATABASE_URL_DEV
MEDIA_BUCKET_DEV
JWT_SECRET_DEV

AWS_ACCESS_KEY_ID_MASTER
AWS_SECRET_ACCESS_KEY_MASTER
DATABASE_URL_MASTER
MEDIA_BUCKET_MASTER
JWT_SECRET_MASTER