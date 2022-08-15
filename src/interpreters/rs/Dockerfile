FROM superarch/minarch

RUN pacman --overwrite "*" -Sy --noconfirm --nodeps rust cargo coreutils

WORKDIR /app

COPY run.sh /app

RUN cargo install runner --root .

CMD ["bash", "run.sh"]
