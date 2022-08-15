FROM superarch/minarch

RUN pacman --overwrite "*" -Sy --noconfirm --nodeps python coreutils

WORKDIR /app

COPY run.sh /app

CMD ["bash", "run.sh"]
