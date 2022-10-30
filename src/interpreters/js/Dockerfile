FROM superarch/minarch

RUN pacman --overwrite "*" -Sy --noconfirm base-devel git libgit2

WORKDIR /app

RUN git clone https://github.com/flogjs/flog flog-repo

WORKDIR /app/flog-repo

RUN make

RUN cp flog /app

COPY run.sh /app

WORKDIR /app

# call flog once to have it initialise

RUN /app/flog -e "1"

CMD ["bash", "run.sh"]
