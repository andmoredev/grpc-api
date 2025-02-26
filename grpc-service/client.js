const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.resolve(__dirname, "./proto/helloworld.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const helloProto = grpc.loadPackageDefinition(packageDefinition).helloworld;

const client = new helloProto.Greeter(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

client.SayHello({ name: "Serverless Developer" }, (error, response) => {
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Response:", response.message);
  }
});