# Use the official Nginx image as a base
FROM nginx:alpine

# Set the working directory
WORKDIR /usr/share/nginx/html

# Copy the static files into the Nginx HTML directory
COPY . .

# Expose port 80
EXPOSE 80

# Start Nginx (this is the default command for the Nginx image)
CMD ["nginx", "-g", "daemon off;"]