# Base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency files first (layer caching optimization)
COPY package.json .

# Install dependencies
RUN npm install --production

# Copy rest of the app
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]
