# Use an official node image as the base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies, including nodemon globally
RUN npm install -g nodemon && npm install

# Copy the rest of the application code
COPY . .

# Copy the .env file (if required)
COPY .env .env

# Expose the port the server runs on
EXPOSE 3000

# Start the server using npm run dev
CMD ["npm", "run", "dev"]
