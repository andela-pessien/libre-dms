/* eslint-disable max-len */
/* eslint-disable no-console*/
import fs from 'fs';
import db from '../server/models/';
import {
  defaultRoles,
  superAdmin,
  getValidUser,
  getValidPublicUser,
  getValidDoc
} from '../server/test/helpers/data-helper';

const users = Array(...(new Array(50))).map(() => (Math.random() > 0.5 ? getValidUser() : getValidPublicUser()));
let documents = [];

console.log('Creating tables...');
db.sequelize.sync({ force: true })
.then(() => {
  console.log('Adding default roles...');
  db.Role.bulkCreate(defaultRoles)
  .then(() => {
    console.log('Adding superadministrator...');
    db.User.create(superAdmin)
    .then((createdSuperAdmin) => {
      documents = [
        ...documents,
        ...Array(...(new Array(3))).map(() => getValidDoc(createdSuperAdmin.id)),
        ...Array(...(new Array(3))).map(() => getValidDoc(createdSuperAdmin.id, 'role', 'view')),
        ...Array(...(new Array(3))).map(() => getValidDoc(createdSuperAdmin.id, 'role', 'edit')),
        ...Array(...(new Array(3))).map(() => getValidDoc(createdSuperAdmin.id, 'public', 'view')),
        ...Array(...(new Array(3))).map(() => getValidDoc(createdSuperAdmin.id, 'public', 'edit')),
      ];
      console.log('Adding users...');
      db.User.bulkCreate(users, { individualHooks: true, validate: true })
      .then((createdUsers) => {
        createdUsers.forEach((user) => {
          documents = [
            ...documents,
            ...Array(...(new Array(3))).map(() => getValidDoc(user.id)),
            ...Array(...(new Array(3))).map(() => getValidDoc(user.id, 'role', 'view')),
            ...Array(...(new Array(3))).map(() => getValidDoc(user.id, 'role', 'edit')),
            ...Array(...(new Array(3))).map(() => getValidDoc(user.id, 'public', 'view')),
            ...Array(...(new Array(3))).map(() => getValidDoc(user.id, 'public', 'edit')),
          ];
        });
        console.log('Adding documents...');
        db.Document.bulkCreate(documents, { individualHooks: true, validate: true })
        .then(() => {
          if (process.env.NODE_ENV === 'test') {
            console.log('Done setting up database.');
          } else {
            console.log('Saving user credentials...');
            const file = fs.openSync('./data/users.json', 'w');
            fs.writeSync(file, JSON.stringify({ users }, null, 2));
            fs.close(file, (err) => {
              if (err) throw err;
              console.log('Saved data to data/users.json');
              console.log('Done setting up database.');
            });
          }
        });
      });
    });
  });
});
