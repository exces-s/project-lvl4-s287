import requiredAuth from '../lib/requirredAuth';
import checkPermissions from '../lib/checkPermissions';
import buildFormObj from '../lib/formObjectBuilder';
import setFlashData from '../lib/setFlashData';
// import create500 from '../lib/create500';
import { User } from '../models';


export default (router) => {
  router
    .get('users', '/users', requiredAuth, async (ctx) => {
      const users = await User.findAll();
      ctx.render('users', { users });
    })
    .get('newUser', '/users/new', (ctx) => {
      const user = User.build();
      ctx.render('users/new', { formData: buildFormObj(user) });
    })
    .post('users', '/users', async (ctx) => {
      const { form } = ctx.request.body;
      const user = User.build(form);
      try {
        await user.save();
        const type = 'alert-success';
        const message = `User ${form.email} successfully created`;
        ctx.flash.set(setFlashData(message, type));
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.render('users/new', { formData: buildFormObj(user, e) });
      }
    })
    .get('user', '/users/:id', checkPermissions, async (ctx) => {
      const { id } = ctx.params;
      const user = await User.findOne({ where: { id } });
      ctx.render('users/user', { formData: buildFormObj(user) });
    })
    .del('deleteUser', '/users/:id', checkPermissions, async (ctx) => {
      const { id } = ctx.params;
      const user = await User.findOne({ where: { id } });
      try {
        await user.destroy();
        const type = 'alert-warning';
        const message = 'Account was deleted';
        ctx.flash.set(setFlashData(message, type));
        ctx.session = {};
      } catch (e) {
        ctx.throw(500);
        // create500(ctx);
      }
    })
    .get('editForm', '/users/:id/edit', checkPermissions, async (ctx) => {
      const { id } = ctx.params;
      const user = await User.findOne({ where: { id } });
      ctx.render('users/edit', { formData: buildFormObj(user) });
    })
    .patch('patchUser', '/users/:id', checkPermissions, async (ctx) => {
      const { form } = ctx.request.body;
      const { id } = ctx.params;
      const user = await User.findOne({ where: { id } });
      try {
        await user.update({
          firstName: form.firstName,
          lastName: form.lastName,
          password: form.password,
        },
        {
          where: { id },
        });
        const type = 'alert-success';
        const message = 'Данные были изменены';
        ctx.flash.set(setFlashData(message, type));
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.render('users/edit', { formData: buildFormObj(user, e) });
      }
    });
};
