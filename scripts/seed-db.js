import db from '../server/models/';
import { defaultRoles, superAdmin } from '../server/test/helpers/data-helper';

console.log('Creating tables...');
db.sequelize.sync({ force: true })
.then(() => {
  console.log('Adding default roles...');
  db.Role.bulkCreate(defaultRoles)
  .then(() => {
    console.log('Adding superadministrator...');
    db.User.bulkCreate([superAdmin], { individualHooks: true })
    .then(() => {
      console.log('Done setting up database.');
    });
  });
});
