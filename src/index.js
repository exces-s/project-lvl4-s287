import _ from 'lodash';
import Koa from 'koa';
import Router from 'koa-router';
import koaWebpack from 'koa-webpack';
import serve from 'koa-static';
import Rollbar from 'rollbar';
import webpack from 'webpack';
import Pug from 'koa-pug';
import path from 'path';
import config from '../webpack.config';


const app = new Koa();
const router = new Router();
const rollbar = new Rollbar('52d7eb6a0e554fdc9a59d7410b26a108');
const compiler = webpack(config);

router
  .get('/', (ctx, next) => {
    ctx.render('index');
    next();
  });


koaWebpack({ compiler })
  .then((middleware) => {
    app
      .use(async (ctx, next) => {
        try {
          await next();
        } catch (err) {
          rollbar.error(err, ctx.request);
        }
      })
      .use(middleware)
      .use(serve(`${__dirname}/assets`))
      .use(router.routes())
      .use(router.allowedMethods());
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
