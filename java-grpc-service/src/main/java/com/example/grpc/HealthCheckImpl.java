package com.example.grpc;

import io.grpc.health.v1.HealthCheckRequest;
import io.grpc.health.v1.HealthCheckResponse;
import io.grpc.health.v1.HealthGrpc;
import io.grpc.stub.StreamObserver;

public class HealthCheckImpl extends HealthGrpc.HealthImplBase {
    @Override
    public void check(HealthCheckRequest request, StreamObserver<HealthCheckResponse> responseObserver) {
        HealthCheckResponse response = HealthCheckResponse.newBuilder()
                .setStatus(HealthCheckResponse.ServingStatus.SERVING)
                .build();
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void watch(HealthCheckRequest request, StreamObserver<HealthCheckResponse> responseObserver) {
        HealthCheckResponse response = HealthCheckResponse.newBuilder()
                .setStatus(HealthCheckResponse.ServingStatus.SERVING)
                .build();
        responseObserver.onNext(response);
    }
}