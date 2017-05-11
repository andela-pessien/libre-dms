import fs from 'fs';
import db from '../server/models/';
import {
  defaultRoles,
  superAdmin,
  getValidUser,
  getValidDoc
} from '../server/test/helpers/data-helper';

const users = Array(...(new Array(30))).map(() => getValidUser());
let documents = [];

console.log('Creating tables...');
db.sequelize.sync({ force: true })
.then(() => {
  console.log('Adding default roles...');
  db.Role.bulkCreate(defaultRoles)
  .then(() => {
    console.log('Adding superadministrator...');
    db.User.bulkCreate([superAdmin], { individualHooks: true })
    .then(() => {
      console.log('Adding users...');
      db.User.bulkCreate(users, { individualHooks: true })
      .then((createdUsers) => {
        createdUsers.forEach((user) => {
          documents = [
            ...documents,
            ...Array(...(new Array(10))).map(() => getValidDoc(user.id))
          ];
        });
        console.log('Adding documents...');
        db.Document.bulkCreate(documents, { individualHooks: true, validate: true })
        .then(() => {
          console.log('Saving user credentials...');
          const file = fs.openSync('data/users.json', 'w');
          fs.writeSync(file, JSON.stringify({ users }, null, 2));
          fs.close(file, (err) => {
            if (err) throw err;
            console.log('Saved data to data/users.json');
          });
          console.log('Done setting up database.');
        });
      });
    });
  });
});
