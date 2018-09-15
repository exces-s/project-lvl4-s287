install:
	npm install

test:
	npm test

test_watch:
	npm test -- --watch

start:
	nodemon --exec babel-node src/bin/index.js

work:
	npm run babel-node -- src/deSerialize.js

lint:
	npm run eslint .