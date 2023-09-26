FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

RUN yarn compile

# Expose the port your application listens on
EXPOSE 3000

# Command to run your Node.js application
CMD ["node", "dist/server.js"]