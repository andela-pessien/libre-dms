import db from '../server/models/index';

const args = process.argv;
if (args.length > 2) {
  if (args[2] === '--force' || args[2] === '-f') {
    db.sequelize.sync({ force: true });
  } else {
    console.log('Unrecognized argument', args[2]);
    process.exitCode = 1;
  }
} else {
  db.sequelize.sync();
}

