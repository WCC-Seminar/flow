#Makefile
SRC:=$(wildcard src/*.ts)
BLD:=$(patsubst src/%.ts,build/%.js,$(SRC))
MAIN:=build/main.js
CC:=tsc

main:$(MAIN)

$(MAIN): $(SRC)
	$(CC) src/main.ts --outfile $@

all:$(BLD)

clean:
	rm build/*.js

rebuild: clean all;

build/%.js: src/%.ts
	$(CC) $< --outfile $@

