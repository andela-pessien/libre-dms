export default (sequelize, DataTypes) => {
  const Organisation = sequelize.import('./organisation.js');
  const Department = sequelize.define('Department', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      noUpdate: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isUniqueWithinOrg: function isUniqueWithinOrg(value, next) {
          if (!this.organisationId) next();
          Organisation.find({ where: { id: this.organisationId } })
          .then((organisation) => {
            if (organisation) {
              organisation.getDepartments()
              .then((departments) => {
                departments.forEach((department) => {
                  if (department.name === value && department.id !== this.id) {
                    next('Validation isUniqueWithinOrg failed');
                  }
                });
                next();
              });
            } else {
              next();
            }
          })
          .catch((err) => {
            next(err.message);
          });
        }
      }
    }
  }, {
    classMethods: {
      associate: (models) => {
        Department.hasMany(models.Document, {
          foreignKey: 'departmentId',
          as: 'documents'
        });
        Department.hasMany(models.User, {
          foreignKey: 'departmentId',
          as: 'users'
        });
      }
    }
  });
  return Department;
};
