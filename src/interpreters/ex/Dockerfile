FROM superarch/minarch

RUN pacman --overwrite "*" -Sy --noconfirm --nodeps elixir coreutils base

RUN localedef -c -f UTF-8 -i en_US en_US.UTF-8

ENV LC_ALL en_US.UTF-8 

WORKDIR /app

COPY run.sh /app

CMD ["bash", "run.sh"]
