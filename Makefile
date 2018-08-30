install:
	npm install

test:
	npm test

start:
	nodemon --exec babel-node src/bin/index.js

lint:
	npm run eslint .