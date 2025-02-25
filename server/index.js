const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load proto file
const PROTO_PATH = path.resolve(__dirname, '../proto/hello.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const helloProto = grpc.loadPackageDefinition(packageDefinition).hello;

// Implement service methods
function sayHello(call, callback) {
  const name = call.request.name || 'World';
  console.log(`gRPC request received: sayHello for ${name}`);
  callback(null, { message: `Hello, ${name}!` });
}

// Health check implementation (useful for container health checks)
function checkHealth(call, callback) {
  callback(null, { status: 'SERVING' });
}

function main() {
  const server = new grpc.Server();

  // Add your main service
  console.log('Adding service:', helloProto.Greeter.service);
  server.addService(helloProto.Greeter.service, {
    SayHello: sayHello
  });

  // Add health check service if defined in your proto
  // If not defined in your proto, you can skip this part
  if (helloProto.Health && helloProto.Health.service) {
    server.addService(helloProto.Health.service, {
      Check: checkHealth
    });
  }

  // Get port from environment variable (for App Runner compatibility)
  const PORT = process.env.PORT || 443;

  // Bind to all interfaces (0.0.0.0) for container networking
  server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error('Failed to start gRPC server:', error);
        process.exit(1);
      }
      console.log(`🚀 gRPC Server running on port ${PORT}`);

      console.log('Proto path:', PROTO_PATH);
      console.log('Proto services:', Object.keys(helloProto));

      server.start();

      // Handle graceful shutdown
      const signals = ['SIGINT', 'SIGTERM'];
      signals.forEach(signal => {
        process.on(signal, () => {
          console.log(`Received ${signal}, shutting down gRPC server...`);
          server.tryShutdown(() => {
            console.log('Server shutdown complete');
            process.exit(0);
          });

          // Force shutdown after 5 seconds if graceful shutdown fails
          setTimeout(() => {
            console.log('Forcing server shutdown after timeout');
            process.exit(1);
          }, 5000);
        });
      });
    }
  );
}

main();

