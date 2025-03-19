package com.example.grpc;

import io.grpc.Server;
import io.grpc.ServerBuilder;
import io.grpc.protobuf.services.ProtoReflectionService;
import io.grpc.stub.StreamObserver;
import java.io.IOException;

public class GrpcServer {

    public static void main(String[] args) throws IOException, InterruptedException {
        Server server = ServerBuilder.forPort(50051)
                .addService(new GreeterImpl()) // Make sure this is added
                .addService(ProtoReflectionService.newInstance()) // Ensure reflection is enabled
                .build();

        System.out.println("Starting gRPC server...");
        server.start();
        System.out.println("Server started on port 50051");

        server.awaitTermination();
    }

    // Greeter implementation
    static class GreeterImpl extends GreeterGrpc.GreeterImplBase {
        @Override
        public void sayHello(HelloRequest request, StreamObserver<HelloReply> responseObserver) {
          System.out.println("Received request: " + request.getName());
            HelloReply reply = HelloReply.newBuilder()
                    .setMessage("Hello, Mr. " + request.getName())
                    .build();
            responseObserver.onNext(reply);
            responseObserver.onCompleted();
        }
    }
}