# Let docker-compose or user set APP3_ENV_NAME at build time
ARG APP3_ENV_NAME
ARG NODE_ENV
# Wheezy is needed for node-sass support
FROM node:8.9.3-wheezy

WORKDIR /var/core/app

COPY . /var/core/app

# Install npm dependencies supressing the output
RUN npm install --quiet && \
  # Remove unnecessary tar balls as they'll never be used again in docker and just take up sapce
  npm cache clean --force

CMD npm run start