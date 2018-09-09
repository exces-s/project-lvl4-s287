import setFlashData from './setFlashData';


export default (ctx) => {
  const type = 'alert-warning';
  const message = 'Извините, произошла ошибка';
  ctx.flash.set(setFlashData(message, type));
  ctx.redirect('/');
};
