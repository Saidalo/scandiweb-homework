FROM node:16-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy all app files (this will be overridden by volumes in development)
COPY . .

# Expose the development server port
EXPOSE 3000

# Start the React development server
CMD ["yarn", "start"]
