
FROM node:20-alpine
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .


EXPOSE 5173
# Build the React app
# RUN npm run build

# # Use an official nginx image to serve the build

# FROM nginx:alpine
# COPY --from=0 /app/dist /usr/share/nginx/html

# # Expose port 80
# EXPOSE 80

# Start nginx
# CMD ["nginx", "-g", "daemon off;"]
CMD ["npm", "run", "dev"]

# # Build the React app
# RUN npm run build

# # Use an official nginx image to serve the build
# FROM nginx:alpine
# COPY --from=0 /app/dist /usr/share/nginx/html

# # Expose port 80
# EXPOSE 80

# # Start nginx
# CMD ["nginx", "-g", "daemon off;"]