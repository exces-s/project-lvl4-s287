import Koa from 'koa';

const app = new Koa();

app.use(async (ctx) => {
  ctx.body = 'Hellooooooo World';
});

export default app;
