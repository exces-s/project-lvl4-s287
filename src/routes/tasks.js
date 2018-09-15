import requiredAuth from '../lib/requirredAuth';
// import checkPermissions from '../lib/checkPermissions';


export default (router) => {
  router
    .get('tasks', '/tasks', requiredAuth, async (ctx) => {
      ctx.render('tasks/index');
    });
};
