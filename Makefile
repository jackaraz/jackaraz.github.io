.PHONY: all install build dev clean test

NODE_BIN := ./node_modules/.bin

all: install build

## Install all npm dependencies
install: package.json
	npm install

## Build assets (Gulp) then generate static site (Eleventy)
build: install
	$(NODE_BIN)/gulp
	$(NODE_BIN)/eleventy

## Production build with minification
production: install
	NODE_ENV=production $(NODE_BIN)/gulp
	NODE_ENV=production $(NODE_BIN)/eleventy

## Start development server (asset watcher + Eleventy live reload)
dev: install
	$(NODE_BIN)/gulp
	$(NODE_BIN)/concurrently "$(NODE_BIN)/gulp watch" "$(NODE_BIN)/eleventy --serve"

## Run tests
test: build
	node test/build.test.js

## Remove all build output and installed packages
clean:
	rm -rf dist node_modules package-lock.json

## Remove only the build output (keep node_modules)
clean-dist:
	rm -rf dist
