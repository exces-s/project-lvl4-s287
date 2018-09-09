import request from 'supertest';
import app from '../src';

const port = process.env.PORT || 3000;

describe('requests', () => {
  let server;

  beforeEach(() => {
    server = app.listen(port);
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

  afterEach(async (done) => {
    await server.close();
    done();
  });
});
