import request from 'supertest';
import dotenv from 'dotenv';
import faker from 'faker';
import _ from 'lodash';
import app from '../src';
import db from '../src/models';


dotenv.config();

const port = process.env.PORT || 4000;

describe('Request tests:', () => {
  let server;

  beforeEach(() => {
    server = app.listen(port);
  });

  afterEach((done) => {
    server.close();
    done();
  });

  test('1. GET 200', async (done) => {
    const res = await request.agent(server).get('/');
    expect(res.statusCode).toBe(200);
    done();
  });

  test('2. GET 404', async (done) => {
    const res = await request.agent(server).get('/wrong-path');
    expect(res.statusCode).toBe(404);
    done();
  });
});


describe('Create users tests:', () => {
  let server;

  const userData = {
    email: 'test@test.com',
    password: 'password',
    firstName: 'Tom',
    lastName: 'Sawyer',
  };

  beforeAll(async () => {
    server = app.listen(port);
    await db.sequelize.sync({ force: true });
  });

  afterAll((done) => {
    server.close();
    done();
  });

  test('1. Get list of users', async (done) => {
    const res = await request.agent(server).get('/users');
    expect(res.statusCode).toBe(200);
    done();
  });

  test('2. Create user 302', async (done) => {
    const res = await request.agent(server)
      .post('/users')
      .send({ form: userData });
    expect(res.statusCode).toBe(302);
    done();
  });

  test('3. Create one user', async (done) => {
    await request.agent(server)
      .post('/users')
      .send({ form: userData });

    const users = await db.User.findAll();
    const user = _.head(users);
    expect(user.dataValues.firstName).toBe('Tom');
    done();
  });

  test('4. Create several users', async (done) => {
    const userData1 = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };

    const userData2 = {
      email: faker.internet.email(),
      password: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };

    await request.agent(server)
      .post('/users')
      .send({ form: userData });
    await request.agent(server)
      .post('/users')
      .send({ form: userData1 });
    await request.agent(server)
      .post('/users')
      .send({ form: userData2 });

    const users = await db.User.findAll();
    expect(Object.keys(users).length).toBe(3);
    done();
  });
});

describe('Sessions tests:', () => {
  let server;

  const userData = {
    email: 'test@test.com',
    password: 'password',
    firstName: 'Tom',
    lastName: 'Sawyer',
  };

  beforeAll(async () => {
    server = app.listen(port);
    await db.sequelize.sync({ force: true });
  });

  afterAll((done) => {
    server.close();
    done();
  });

  test('1. Get /session/new', async (done) => {
    const res = await request.agent(server).get('/session/new');
    expect(res.statusCode).toBe(200);
    done();
  });

  test('2. Create session', async (done) => {
    await db.User.create(userData);

    const res = await request.agent(server)
      .post('/session')
      .send({ form: userData });
    expect(res.statusCode).toBe(302);
    done();
  });

  test('3. Delete session', async (done) => {
    const res = await request.agent(server)
      .delete('/session');
    expect(res.statusCode).toBe(302);
    done();
  });
});
