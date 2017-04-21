export default (sequelize, DataTypes) => {
  const match = '(\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])';
  const altMatch = '(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,})';
  const Organisation = sequelize.define('Organisation', {
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
    domain: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: true,
        isDomain: (value) => {
          if (!(new RegExp(`${match}|${altMatch}$`)).test(value)) {
            throw new Error('Validation isDomain failed');
          }
        }
      }
    },
    privateorg: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    privatedocs: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        Organisation.hasMany(models.Department, {
          foreignKey: {
            name: 'organisationId',
            allowNull: false
          },
          as: 'departments',
          onDelete: 'CASCADE',
          hooks: true
        });
        Organisation.hasMany(models.Document, {
          foreignKey: 'organisationId',
          as: 'documents'
        });
        Organisation.hasMany(models.User, {
          foreignKey: 'organisationId',
          as: 'users'
        });
      }
    }
  });
  return Organisation;
};
