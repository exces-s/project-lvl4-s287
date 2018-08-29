import _ from 'lodash';
import Koa from 'koa';
import Router from 'koa-router';
import koaWebpack from 'koa-webpack';
import serve from 'koa-static';
import Rollbar from 'rollbar';
import Pug from 'koa-pug';
import path from 'path';
import dotenv from 'dotenv';
import webpackConfig from '../webpack.config';


dotenv.config();

const app = new Koa();
const router = new Router();
const rollbar = new Rollbar(process.env.ROLLBAR);

router
  .get('/', (ctx, next) => {
    ctx.render('index');
    next();
  });

// if (process.env.NODE_ENV !== 'production') {
//   app.use(middleware({
//     config: webpackConfig,
//   }));
// }

app
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      rollbar.error(err, ctx.request);
    }
  })
  .use(serve(path.resolve(__dirname, './assets')))
  .use(router.routes())
  .use(router.allowedMethods());

koaWebpack({ config: webpackConfig })
  .then((middleware) => {
    app.use(middleware);
  });

const pug = new Pug({
  viewPath: path.join(__dirname, 'views'),
  noCache: process.env.NODE_ENV === 'development',
  debug: true,
  pretty: true,
  compileDebug: true,
  locals: [],
  basedir: path.join(__dirname, 'views'),
  helperPath: [
    { _ },
    { urlFor: (...args) => router.url(...args) },
  ],
});
pug.use(app);

export default app;
