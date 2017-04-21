module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Shareds', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
          notEmpty: true,
        }
      },
      accesslevel: {
        defaultValue: 'view',
        type: Sequelize.ENUM('view', 'comment', 'edit')
      },
      documentId: {
        type: Sequelize.UUID,
        references: {
          model: 'Documents',
          key: 'id',
          as: 'documentId',
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
  down: queryInterface => queryInterface.dropTable('Shareds')
};
