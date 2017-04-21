module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Documents', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: Sequelize.TEXT,
      type: {
        defaultValue: 'text',
        type: Sequelize.ENUM('text', 'image')
      },
      access: {
        defaultValue: 'private',
        type: Sequelize.ENUM('public', 'role', 'private')
      },
      accesslevel: {
        defaultValue: 'view',
        type: Sequelize.ENUM('view', 'comment', 'edit')
      },
      shared: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      departmentId: {
        type: Sequelize.UUID,
        references: {
          model: 'Departments',
          key: 'id',
          as: 'departmentId',
        },
      },
      organisationId: {
        type: Sequelize.UUID,
        references: {
          model: 'Organisations',
          key: 'id',
          as: 'organisationId',
        },
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId',
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
  down: queryInterface => queryInterface.dropTable('Documents')
};
