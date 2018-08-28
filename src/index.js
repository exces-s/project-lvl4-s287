import Koa from 'koa';
import Router from 'koa-router';
import koaWebpack from 'koa-webpack';
import serve from 'koa-static';
import Rollbar from 'rollbar';

const app = new Koa();
const router = new Router();
const rollbar = new Rollbar('52d7eb6a0e554fdc9a59d7410b26a108');

router
  .get('/500', (ctx, next) => {
    ctx.body = '500 test';
    next();
  })
  .get('/', (ctx, next) => {
    ctx.body = 'World Hello';
    next();
  });

app
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      rollbar.error(err, ctx.request);
    }
  })
  .use(serve(`${__dirname}/assets`))
  .use(router.routes())
  .use(router.allowedMethods());


// koaWebpack('{.. options ..}')
//   .then((middleware) => {
//     app
//       .use(async (ctx, next) => {
//         try {
//           await next();
//         } catch (err) {
//           rollbar.error(err, ctx.request);
//         }
//       })
//       .use(middleware)
//       .use(serve(`${__dirname}/assets`))
//       .use(router.routes())
//       .use(router.allowedMethods());
//   });

export default app;
