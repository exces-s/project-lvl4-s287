export default async (ctx, next) => {
  const { id } = ctx.params;
  ctx.assert(ctx.state.isAuth(id), 403);
  await next();
};
