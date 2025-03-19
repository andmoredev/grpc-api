FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app
COPY target/grpc-server-1.0-SNAPSHOT.jar /app/grpc-server.jar

EXPOSE 50051
CMD ["java", "-jar", "grpc-server.jar"]