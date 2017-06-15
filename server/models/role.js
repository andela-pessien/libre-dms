export default (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      noUpdate: true,
      type: DataTypes.INTEGER
    },
    label: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'Roles must be unique'
      },
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Please provide a label for this role'
        }
      }
    }
  }, {
    classMethods: {
      associate: (models) => {
        Role.hasMany(models.User, {
          foreignKey: {
            name: 'roleId',
            defaultValue: 4
          },
          as: 'users'
        });
      }
    }
  });
  return Role;
};
