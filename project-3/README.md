# Monolith to Microservices at Scale Project

## Modules

1. udacity-c3-deplyment
    - includes docker compose file
    - includes k8s deployment,service and config documents
2. udacity-c3-frontend
3. udacity-c3-restapi-feed
4. udacity-c3-rest-api-user



## Run Application

All the modules are containerized. Docker files for modules are located in modules
Docker compose file is located in udacity-c3-deplyment

For runnig application open a new terminal within the project directory and run:

1. Build images `docker-compose -f docker-compose-build.yaml build --parallel` 
2. Push images to docker hub `docker-compose -f docker-compose-build.yaml push`  
3. Run containers `docker-compose up`

You'll need to create a new node server. Open a new terminal within the project directory and run:

1. Initialize a new project: `npm i`
2. run the development server with `npm run dev`


## Deploying your system

K8s cluster create on aws: https://github.com/kubermatic/kubeone/blob/master/docs/quickstart-aws.md

For deploying images to k8s cluster run  `kubectl apply -f FILENAME` for config , depyonment and service files located in following path https://github.com/volkanbaran/udacity-cloud-developer/tree/master/project-3/refactor-to-microservice/udacity-c3-deployment/k8s


## Documents
Spec Document
https://github.com/volkanbaran/udacity-cloud-developer/blob/dev/project-3/refactor-to-microservice/refactor-to-microservice%20-%20Project%20Spec.docx


