# INSTALL UBUNTU
# FROM node:10.16.0-alpine
FROM registry.gitlab.com/alkosto/microservices/oracledb-client:0.1.2


LABEL maintainer="Alkosto" \
      description="Ck Invoice XML"

VOLUME /home/admin/volumes/xml/

# Copy source code
COPY . /var/app

# Change working directory
WORKDIR /var/app

# Change the Time Zone in the Node Server
ENV TZ=America/Bogota

# You have to specify "--unsafe-perm" with npm install
# when running as root.  Failing to do this can cause
# install to appear to succeed even if a preinstall
# script fails, and may have other adverse consequences
# as well.
# This command will also cat the npm-debug.log file after the
# build, if it exists.
RUN npm install --unsafe-perm || \
  ((if [ -f npm-debug.log ]; then \
      cat npm-debug.log; \
    fi) && false)

# Launch application
CMD ["npm","start"]
