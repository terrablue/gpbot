FROM node:latest

RUN useradd gp

WORKDIR /app

COPY --chown=gp:gp run.sh /app

RUN npm i --prefix /app ts-node

USER gp

CMD ["bash", "run.sh"]
