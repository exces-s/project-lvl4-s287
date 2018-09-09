export default async (ctx, next) => {
  try {
    await next();
    const status = ctx.status || 404;
    if (status === 404) {
      ctx.throw(404);
    }
  } catch (err) {
    ctx.status = err.status || 500;
    switch (ctx.status) {
      case 404:
        ctx.render('errors/404');
        break;
      default:
        ctx.body = `Error 500: ${err.status}`;
        break;
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
//     const message = ctx.status === 404 ?
//      'The page you are looking for was not found.' : err.message;
//     ctx.app.emit('error', err, ctx);
//     await ctx.render('errors/error', { status: ctx.status, message });
//   }
// });
