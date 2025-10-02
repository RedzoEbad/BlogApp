FROM node:lts-alpine 

# Create app user
RUN adduser -D appuser

# Set working directory
WORKDIR /app

# Copy only package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Switch to non-root user   
USER appuser

# Expose the app port
EXPOSE 3000

# Start the app (dev mode)
CMD ["npm", "run", "dev"]
