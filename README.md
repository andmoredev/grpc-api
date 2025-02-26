docker build -t grpc-node-server .
docker run -p 50051:50051 grpc-node-server

docker-compose up --build