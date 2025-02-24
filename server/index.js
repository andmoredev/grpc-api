const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.resolve(__dirname, '../proto/hello.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const helloProto = grpc.loadPackageDefinition(packageDefinition).hello;

function sayHello(call, callback) {
    const name = call.request.name;
    callback(null, { message: `Hello, ${name}!` });
}

function main() {
    const server = new grpc.Server();
    server.addService(helloProto.Greeter.service, { SayHello: sayHello });

    const PORT = process.env.PORT || 50051;
    server.bindAsync(
        `0.0.0.0:${PORT}`,
        grpc.ServerCredentials.createInsecure(),
        () => {
            console.log(`🚀 gRPC Server running on port ${PORT}`);
            server.start();
        }
    );
}

main();