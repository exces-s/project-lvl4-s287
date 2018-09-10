install:
	npm install

test:
	npm test

test_watch:
	npm test -- --watch

start:
	nodemon --exec babel-node src/bin/index.js

lint:
	npm run eslint .