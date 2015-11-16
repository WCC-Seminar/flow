#Makefile
SRC:=$(wildcard src/*.ts)
BLD:=$(patsubst src/%.ts,build/%.js,$(SRC))
CC:=tsc

all:$(BLD)

clean:
	rm build/*.js

rebuild: clean all;

build/%.js: src/%.ts
	$(CC) $< --outfile $@

