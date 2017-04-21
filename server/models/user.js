import bcrypt from 'bcryptjs';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
  }, {
    classMethods: {
      associate: (models) => {
        User.hasMany(models.Comment, {
          foreignKey: {
            name: 'userId',
            allowNull: false
          },
          as: 'comments'
        });
        User.hasMany(models.Document, {
          foreignKey: {
            name: 'userId',
            allowNull: false
          },
          as: 'documents',
        });
      }
    },
    instanceMethods: {
      verifyPassword(password) {
        return bcrypt.compareSync(password, this.password);
      }
    },
    hooks: {
      beforeCreate: (user) => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
      },
      beforeUpdate: (user) => {
        if (user.password) {
          user.password = bcrypt.hashSync(user.password,
            bcrypt.genSaltSync(10));
        }
      }
    }
  });
  return User;
};
