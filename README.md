# gRPC Service Deployment Guide

## Local Deployment via Terminal

### Node.js gRPC Service
```bash
# Navigate to Node.js service directory
cd grpc-service

# Build and run with Docker
docker build -t grpc-node-server .
docker run -p 50051:50051 grpc-node-server

# Or using docker-compose
docker-compose up --build
```

### Java gRPC Service
```bash
# Navigate to Java service directory
cd grpc-service-java

# Build and run with Docker
docker build -t grpc-java-server .
docker run -p 50051:50051 -p 8080:8080 grpc-java-server

# Or using docker-compose
docker-compose up --build

# Build and run without Docker (requires Java 21 and Gradle)
./gradlew build
java -jar build/libs/grpc-service-java-1.0-SNAPSHOT.jar
```

## GitHub Actions Deployment

To deploy either service using GitHub Actions, add one of the following workflow files to `.github/workflows/`:

### Node.js Service Workflow (deploy-node.yml)
```yaml
name: Deploy Node.js gRPC Service

on:
  push:
    branches: [ main ]
    paths:
      - 'grpc-service/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: grpc-node-service
          IMAGE_TAG: ${{ github.sha }}
        run: |
          cd grpc-service
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
```

### Java Service Workflow (deploy-java.yml)
```yaml
name: Deploy Java gRPC Service

on:
  push:
    branches: [ main ]
    paths:
      - 'grpc-service-java/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up JDK 21
        uses: actions/setup-java@v2
        with:
          java-version: '21'
          distribution: 'adopt'
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: grpc-java-service
          IMAGE_TAG: ${{ github.sha }}
        run: |
          cd grpc-service-java
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
```

Both workflows require the following secrets to be configured in your GitHub repository:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY 
- AWS_REGION