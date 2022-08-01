FROM rust:latest

WORKDIR /usr/src/app
COPY . .

RUN cargo install runner --root .

CMD ["bash", "run.sh"]
