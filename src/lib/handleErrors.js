import { rollbar } from '..';

export default () => async (ctx, next) => {
  try {
    await next();
    const status = ctx.status || 404;
    if (status === 404) {
      ctx.throw(404);
    }
  } catch (err) {
    rollbar.error(err, ctx.request);
    switch (err.status) {
      case 401:
        ctx.render('errors/401');
        return;
      case 403:
        ctx.render('errors/403');
        return;
      case 404:
        ctx.render('errors/404');
        return;
      default:
        ctx.render('errors/500');
    }
  }
};


// app.use(async (ctx, next) => {
//   try {
//     await next();
//     if (ctx.status === 404) {
//       ctx.throw(404);
//     }
//   } catch (err) {
//     ctx.status = err.status || 500;
//     const message = ctx.status === 404 ? 'The page you are looking for was not found.' : 'Something wrong.';
//     ctx.app.emit('error', err, ctx);
//     if (devMode) {
//       ctx.body = err.message;
//       return;
//     }
//     if (ctx.status === 401) {
//       await ctx.render('errors/reqAuth');
//       return;
//     }
//     await ctx.render('errors/error', { status: ctx.status, message });
//   }
// });

// app.on('error', (err, ctx) => {
//   if (productionMode) {
//     rollbar.error(err, ctx.request);
//   }
//   log('Error %s', err.message);
// });