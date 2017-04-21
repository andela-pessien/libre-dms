export default (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
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
    },
    shared: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        Document.hasMany(models.Comment, {
          foreignKey: {
            name: 'documentId',
            allowNull: false
          },
          as: 'comments'
        });
        Document.hasMany(models.Shared, {
          foreignKey: {
            name: 'documentId',
            allowNull: false
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
