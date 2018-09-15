import requiredAuth from '../lib/requirredAuth';
// import checkPermissions from '../lib/checkPermissions';
import buildFormObj from '../lib/formObjectBuilder';
import encrypt from '../lib/encrypt';
import { User } from '../models';

export default (router) => {
  router
    .get('newSession', '/session/new', async (ctx) => {
      const data = {};
      ctx.render('sessions/new', { formData: buildFormObj(data) });
    })
    .post('session', '/session', async (ctx) => {
      const { email, password } = ctx.request.body.form;
      const user = await User.findOne({ where: { email } });
      if (user && user.passwordDigest === encrypt(password)) {
        ctx.session.userId = user.id;
        ctx.redirect(router.url('tasks'));
        return;
      }
      ctx.render('sessions/new', { formData: buildFormObj({ email }) });
    })
    .delete('session', '/session', requiredAuth, (ctx) => {
      ctx.session = {};
      ctx.redirect(router.url('root'));
    });
};
