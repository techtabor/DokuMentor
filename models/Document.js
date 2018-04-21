const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes){
    var Document = sequelize.define('Document', {
        add_date: {
          type: 'TIMESTAMP',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false
        },
        university: {
          type: Sequelize.STRING,
          allowNull: false
        },
        course: {
          type: Sequelize.STRING,
          allowNull: false
        },
        semester: {
          type: Sequelize.INTEGER,
        },
        teacher: {
          type: Sequelize.STRING,
        },
        lecture_date: {
          type: Sequelize.DATE,
        },
        tags: {
          type: Sequelize.STRING,
        },
        description: {
          type: Sequelize.STRING,
        },
    });

    Document.associate = function(models) {
      models.Document.hasMany(models.File);
    };

    return Document;
};