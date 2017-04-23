export default (sequelize, DataTypes) => {
  const Shared = sequelize.define('Shared', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      noUpdate: true,
      defaultValue: DataTypes.UUIDV4
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
      }
    },
    accesslevel: {
      defaultValue: 'view',
      type: DataTypes.ENUM('view', 'comment', 'edit')
    }
  });
  return Shared;
};
