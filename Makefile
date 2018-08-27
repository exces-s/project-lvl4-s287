install:
	npm install

lint:
	npm eslint .

test:
	npm test

build:
	npm run babel -- src --out-dir dist --source-maps inline

start:
	nodemon --exec babel-node src/bin/index.js

lint:
	npm run eslint .