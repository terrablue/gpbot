FROM superarch/minarch

RUN pacman --overwrite "*" -Sy --noconfirm --nodeps ruby

WORKDIR /app

COPY run.sh /app

CMD ["bash", "run.sh"]
