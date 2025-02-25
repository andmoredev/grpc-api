# Use Node.js LTS as the base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose gRPC port
EXPOSE 50051

# Set environment variable for port (App Runner will use this)
ENV PORT=50051

# Start the gRPC server
CMD ["node", "server/index.js"]