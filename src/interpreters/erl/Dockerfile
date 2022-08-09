FROM debian:unstable-slim

RUN apt-get update \
  && apt-get install -y erlang-base \
  && apt-get clean autoclean

RUN useradd gp

WORKDIR /app

USER gp

CMD ["erl"]
