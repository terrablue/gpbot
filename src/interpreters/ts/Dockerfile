FROM superarch/minarch

RUN pacman --overwrite "*" -Sy --noconfirm --nodeps nodejs npm coreutils

WORKDIR /app

COPY run.sh /app

RUN npm i --prefix /app ts-node

CMD ["bash", "run.sh"]
