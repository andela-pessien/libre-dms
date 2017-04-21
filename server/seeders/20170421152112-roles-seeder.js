module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('Roles', [{
      label: 'superadministrator',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      label: 'administrator',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      label: 'department head',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      label: 'department member',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      label: 'member',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      label: 'regular',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {}),

  down: queryInterface => queryInterface.bulkDelete('Roles', null, {})
};
