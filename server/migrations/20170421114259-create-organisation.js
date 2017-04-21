module.exports = {
  up: (queryInterface, Sequelize) => {
    const match = '(\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])';
    const altMatch = '(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,})';
    return queryInterface.createTable('Organisations', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      domain: {
        type: Sequelize.STRING,
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
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      privatedocs: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: queryInterface => queryInterface.dropTable('Organisations')
};
