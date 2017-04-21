module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Departments', {
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
      organisationId: {
        type: Sequelize.UUID,
        references: {
          model: 'Organisations',
          key: 'id',
          as: 'organisationId',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
  down: queryInterface => queryInterface.dropTable('Departments')
};
