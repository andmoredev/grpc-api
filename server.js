const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const http = require('http');

// Load proto file
const PROTO_PATH = path.resolve(__dirname, './proto/hello.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const helloProto = grpc.loadPackageDefinition(packageDefinition).hello;

// gRPC service implementation
function sayHello(call, callback) {
  const name = call.request.name || 'World';
  console.log(`📞 gRPC request received: sayHello for ${name}`);
  callback(null, { message: `Hello, ${name}! booyah` });
}

// Health check for gRPC
function checkHealth(call, callback) {
  callback(null, { status: 'SERVING' });
}

// Create gRPC server
function startGrpcServer() {
  const server = new grpc.Server();
  server.addService(helloProto.Greeter.service, { SayHello: sayHello });

  const PORT = process.env.PORT || 50051;
  server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('❌ Failed to start gRPC server:', err);
      process.exit(1);
    }
    console.log(`🚀 gRPC Server running on port ${port}`);
    server.start();
  });
}

// Create HTTP health check endpoint
function startHealthCheckServer() {
  const healthPort = process.env.HEALTH_PORT || 8080;

  const server = http.createServer((req, res) => {
    if (req.url === '/health' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'healthy' }));
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  server.listen(healthPort, '0.0.0.0', () => {
    console.log(`✅ Health check endpoint running on port ${healthPort}`);
  });
}

// Start both gRPC and HTTP servers
startGrpcServer();
startHealthCheckServer();