# Use Node.js LTS as the base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy application files
COPY . .

# Install dependencies
RUN npm install

# Expose gRPC port
EXPOSE 50051

# Start the gRPC server
CMD ["node", "server/index.js"]