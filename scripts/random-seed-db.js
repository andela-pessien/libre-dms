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
const userDocuments = userId => ([
  ...Array(...(new Array(3))).map(() => getValidDoc(userId)),
  ...Array(...(new Array(3))).map(() => getValidDoc(userId, 'role', 'view')),
  ...Array(...(new Array(3))).map(() => getValidDoc(userId, 'role', 'comment')),
  ...Array(...(new Array(3))).map(() => getValidDoc(userId, 'public', 'view')),
  ...Array(...(new Array(3))).map(() => getValidDoc(userId, 'public', 'comment'))
]);

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
        ...userDocuments(createdSuperAdmin.id)
      ];
      console.log('Adding users...');
      db.User.bulkCreate(users, { individualHooks: true, validate: true })
      .then((createdUsers) => {
        createdUsers.forEach((user) => {
          documents = [
            ...documents,
            ...userDocuments(user.id)
          ];
        });
        console.log('Adding documents...');
        db.Document.bulkCreate(documents, { individualHooks: true, validate: true })
        .then(() => {
          console.log('Done setting up database.');
        });
      });
    });
  });
});
