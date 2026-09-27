FROM node:20-bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive
ENV ARDUINO_UPDATER_ENABLE_NOTIFICATION=false

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl xz-utils python3 \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /opt/arduino-cli/bin \
    && curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | BINDIR=/opt/arduino-cli/bin sh \
    && /opt/arduino-cli/bin/arduino-cli core update-index \
    && /opt/arduino-cli/bin/arduino-cli core install arduino:avr \
    && /opt/arduino-cli/bin/arduino-cli config add board_manager.additional_urls https://espressif.github.io/arduino-esp32/package_esp32_index.json \
    && /opt/arduino-cli/bin/arduino-cli core update-index \
    && /opt/arduino-cli/bin/arduino-cli core install esp32:esp32 \
    && /opt/arduino-cli/bin/arduino-cli config add board_manager.additional_urls https://github.com/earlephilhower/arduino-pico/releases/download/global/package_rp2040_index.json \
    && /opt/arduino-cli/bin/arduino-cli core update-index \
    && /opt/arduino-cli/bin/arduino-cli core install rp2040:rp2040 \
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
