# Use Node.js 22 base image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project
COPY . .

# Expose the gRPC port
EXPOSE 50051

# Run the server
CMD ["node", "server.js"]