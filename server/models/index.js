import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import sequelizeNoUpdateAttributes from 'sequelize-noupdate-attributes';
// import noUpdateHelper from '../helpers/noupdate-helper';
import allConfig from '../config/config';

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = allConfig[env];
const db = {};

const sequelize = new Sequelize(config.url, config);
sequelizeNoUpdateAttributes(sequelize);
// noUpdateHelper(sequelize);

fs.readdirSync(__dirname)
  .filter(file =>
    ((file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js')))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
