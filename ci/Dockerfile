FROM ubuntu:18.04
ARG APP_ENV
ENV NODE_ENV=$APP_ENV
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
RUN apt-get install -y nodejs
ADD ./ /mystique/
EXPOSE 3000
WORKDIR /mystique
ENTRYPOINT ["/usr/bin/npm"]
CMD ["run", "-s", "start"]
