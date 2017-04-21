const bcrypt = require('bcryptjs');
require('dotenv').load();

module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('Users', [{
      name: process.env.SADMIN_NAME,
      email: process.env.SADMIN_EMAIL,
      password: bcrypt.hashSync(process.env.SADMIN_PASSWORD,
        bcrypt.genSaltSync(10)),
      roleId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {}),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
