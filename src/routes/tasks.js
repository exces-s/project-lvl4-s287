export default (router) => {
  router
    .get('tasks', '/tasks', async (ctx) => {
      ctx.render('tasks/index');
    });
};
