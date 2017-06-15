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
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Please provide a title'
        }
      }
    },
    content: DataTypes.TEXT,
    type: DataTypes.ENUM('text', 'quill'),
    access: {
      defaultValue: 'private',
      type: DataTypes.STRING,
      validate: {
        is: {
          args: /(private)|(role)|(public)/,
          msg: 'Access can only be private, public or role'
        }
      }
    },
    accesslevel: {
      defaultValue: 'view',
      type: DataTypes.STRING,
      validate: {
        is: {
          args: /(view)|(comment)/,
          msg: 'Access level can only be view or comment'
        }
      }
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
            document.userRole = 1;
            document.access = 'role';
            return next(null, options);
          }
          document.userRole = user.roleId;
          return next(null, options);
        })
        .catch(err => next(err));
      }
    },
    paranoid: true
  });
  return Document;
};
