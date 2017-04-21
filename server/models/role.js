export default (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    label: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    classMethods: {
      associate: (models) => {
        Role.hasMany(models.User, {
          foreignKey: {
            name: 'roleId',
            defaultValue: 6
          },
          as: 'users'
        });
      }
    }
  });
  return Role;
};
