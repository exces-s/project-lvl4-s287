import _ from 'lodash';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import koaWebpack from 'koa-webpack';
import serve from 'koa-static';
import Rollbar from 'rollbar';
import Pug from 'koa-pug';
import path from 'path';
import dotenv from 'dotenv';
import session from 'koa-session';
import flash from 'koa-flash-simple';
import koaLogger from 'koa-logger';
import methodOverride from 'koa-methodoverride';
import webpackConfig from '../webpack.config';
import handleErr from './lib/handleErr';
import addRoutes from './routes';
import container from './container';


dotenv.config();

const app = new Koa();
const rollbar = new Rollbar(process.env.ROLLBAR);
const router = new Router();
addRoutes(router, container);

app.keys = ['some secret hurr'];

if (process.env.NODE_ENV !== ('production' && 'test')) {
  koaWebpack({ config: webpackConfig })
    .then((middleware) => {
      app.use(middleware);
    });
}

app.use(handleErr);
app
  .use(koaLogger())
  .use(bodyParser())
  .use(session(app))
  .use(flash())
  .use(methodOverride('_method'))
  .use(async (ctx, next) => {
    ctx.state = {
      flash: ctx.flash,
      isSignedIn: () => ctx.session.userId !== undefined,
      isAuth: id => ctx.session && ctx.session.userId === Number(id),
      userId: ctx.session.userId,
    };
    await next();
  })
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      rollbar.error(err, ctx.request);
    }
  })
  .use(serve(path.resolve(__dirname, './assets')))
  .use(router.allowedMethods())
  .use(router.routes());


const pug = new Pug({
  viewPath: path.join(__dirname, 'views'),
  noCache: process.env.NODE_ENV === 'development',
  debug: true,
  pretty: true,
  compileDebug: true,
  locals: {},
  basedir: path.join(__dirname, 'views'),
  helperPath: [
    { _ },
    { urlFor: (...args) => router.url(...args) },
  ],
});
pug.use(app);

export default app;
