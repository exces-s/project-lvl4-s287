import buildFormObj from '../lib/formObjectBuilder';
import setFlashData from '../lib/setFlashData';
import create403 from '../lib/create403';
import create500 from '../lib/create500';
import { User } from '../models';


export default (router) => {
  router
    .get('users', '/users', async (ctx) => {
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
        const message = `Пользователь ${form.email} успешно создан`;
        ctx.flash.set(setFlashData(message, type));
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.render('users/new', { formData: buildFormObj(user, e) });
      }
    })
    .get('user', '/users/:id', async (ctx) => {
      const { id } = ctx.params;
      if (ctx.state.isAuth(id)) {
        const user = await User.findOne({ where: { id } });
        ctx.render('users/user', { formData: buildFormObj(user) });
      } else {
        create403(ctx);
      }
    })
    .del('deleteUser', '/users/:id', async (ctx) => {
      const { id } = ctx.params;
      if (ctx.state.isAuth(id)) {
        const user = await User.findOne({ where: { id } });
        try {
          await user.destroy();
          const type = 'alert-warning';
          const message = 'Пользователь был удален';
          ctx.flash.set(setFlashData(message, type));
          ctx.session = {};
        } catch (e) {
          create500(ctx);
          console.log(e);
        }
      } else {
        create403(ctx);
      }
      ctx.redirect(router.url('root'));
    })
    .get('editForm', '/users/:id/edit', async (ctx) => {
      const { id } = ctx.params;
      if (ctx.state.isAuth(id)) {
        const user = await User.findOne({ where: { id } });
        ctx.render('users/edit', { formData: buildFormObj(user) });
      } else {
        create403(ctx);
      }
    })
    .patch('patchUser', '/users/:id', async (ctx) => {
      const { form } = ctx.request.body;
      const { id } = ctx.params;
      if (ctx.state.isAuth(id)) {
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
          console.log(e);
        }
      } else {
        create403(ctx);
      }
    });
};
