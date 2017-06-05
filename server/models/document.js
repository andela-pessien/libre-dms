import { isQuillDocument } from '../helpers';

export default (sequelize, DataTypes) => {
  const User = sequelize.import('./user.js');
  const Document = sequelize.define('Document', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      noUpdate: true,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: DataTypes.TEXT,
    type: DataTypes.ENUM('text', 'quill'),
    access: {
      defaultValue: 'private',
      type: DataTypes.ENUM('public', 'role', 'private')
    },
    accesslevel: {
      defaultValue: 'view',
      type: DataTypes.ENUM('view', 'comment', 'edit')
    },
    userRole: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        Document.hasMany(models.Comment, {
          foreignKey: {
            name: 'documentId',
            allowNull: false,
            noUpdate: true
          },
          as: 'comments'
        });
        Document.hasMany(models.Shared, {
          foreignKey: {
            name: 'documentId',
            allowNull: false,
            noUpdate: true
          },
          as: 'shareds',
          onDelete: 'CASCADE',
          hooks: true
        });
        Document.belongsTo(models.User, {
          foreignKey: {
            name: 'userId',
            allowNull: false,
            noUpdate: true
          },
        });
      }
    },
    hooks: {
      beforeValidate: function beforeValidate(document) {
        if (!document.content) {
          document.type = 'text';
        } else {
          if (typeof document.content === 'object') {
            document.content = JSON.stringify(document.content);
          }
          if (isQuillDocument(document.content)) {
            document.type = 'quill';
          } else {
            document.type = 'text';
          }
        }
      },
      afterValidate: function afterValidate(document, options, next) {
        User.find({ where: { id: document.userId }, paranoid: false })
        .then((user) => {
          if (!user) {
            document.userRole = 6;
            return next(null, options);
          }
          document.userRole = user.roleId;
          return next(null, options);
        })
        .catch(err => next(err));
      }
    }
  });
  return Document;
};
