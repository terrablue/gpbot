FROM haskell:latest

RUN useradd gp

WORKDIR /app

COPY --chown=gp:gp run.sh /app

USER gp

CMD ["bash", "run.sh"]
