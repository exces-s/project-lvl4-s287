import setFlashData from './setFlashData';


export default (ctx) => {
  const type = 'alert-danger';
  const message = 'Для доступа необходимо войти';
  ctx.flash.set(setFlashData(message, type));
  ctx.status = 403;
  ctx.redirect('/');
};
