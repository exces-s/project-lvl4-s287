import encrypt from '../lib/encrypt';


export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'This email is already in use',
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'Enter a valid email',
        },
      },
    },
    passwordDigest: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.VIRTUAL,
      set(value) {
        this.setDataValue('passwordDigest', encrypt(value));
        this.setDataValue('password', value);
        return value;
      },
      // validate: {
      //   len: {
      //     args: [1, +Infinity],
      //     msg: 'Слишком короткий пароль',
      //   },
      // },
    },
  }, {
    classMethods: {
      fullName() {
        return `${this.firstName} ${this.lastName}`;
      },
      associate(models) {                                 // eslint-disable-line
        // associations can be defined here
      },
    },
  });
  return User;
};
