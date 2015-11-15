#Makefile
SRC:=$(wildcard src/*.ts)
BLD:=$(patsubst src/%.ts,build/%.js,$(SRC))
CC:=tsc

all:$(BLD)

build/%.js: src/%.ts
	$(CC) $< --outfile $@

