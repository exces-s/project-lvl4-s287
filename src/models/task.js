export default (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Поле не должно быть пустым',
        },
      },
    },
    description: DataTypes.STRING,
    status: DataTypes.STRING,
    creator: DataTypes.STRING,
    assignedTo: DataTypes.STRING,
    tags: DataTypes.STRING,
  });

  return Task;
};


    // name: обязательно
    // description: не обязательно
    // status: обязательно, по умолчанию 'новый'. Список берется из справочника TaskStatus
    // creator: обязательно, автор задачи
    // assignedTo: тот на кого поставлена задача
    // tags: связь m2m с тегами
