export default (router) => {
  router
    .get('root', '/', async (ctx) => {
      ctx.render(ctx.state.isSignedIn() ? 'tasks/index' : 'welcome/index');
    });
};
