FROM rust:latest

RUN useradd gp

WORKDIR /app

COPY --chown=gp:gp run.sh /app

RUN cargo install runner --root .

USER gp
