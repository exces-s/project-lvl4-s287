export default async (ctx, next) => {
  ctx.assert(ctx.state.isSignedIn(), 401);
  await next();
};
