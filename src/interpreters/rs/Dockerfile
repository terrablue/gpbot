FROM rust:latest

RUN useradd gp

WORKDIR /app

COPY --chown=gp:gp run.sh /app

USER gp

RUN cargo install runner --root .
