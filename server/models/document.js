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
    type: {
      defaultValue: 'text',
      type: DataTypes.ENUM('text', 'image')
    },
    access: {
      defaultValue: 'private',
      type: DataTypes.ENUM('public', 'role', 'private')
    },
    accesslevel: {
      defaultValue: 'view',
      type: DataTypes.ENUM('view', 'comment', 'edit')
    }
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
      }
    }
  });
  return Document;
};
