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
