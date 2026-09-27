FROM node:20-bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive
ENV ARDUINO_UPDATER_ENABLE_NOTIFICATION=false

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl xz-utils \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /opt/arduino-cli/bin \
    && curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | BINDIR=/opt/arduino-cli/bin sh \
    && /opt/arduino-cli/bin/arduino-cli core update-index \
    && /opt/arduino-cli/bin/arduino-cli core install arduino:avr \
    && /opt/arduino-cli/bin/arduino-cli version \
    && /opt/arduino-cli/bin/arduino-cli core list

ENV PATH="/opt/arduino-cli/bin:${PATH}"
ENV ARDUINO_CLI="/opt/arduino-cli/bin/arduino-cli"

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

ENV NODE_ENV=production
ENV PORT=10000
EXPOSE 10000
CMD ["npm","start"]
