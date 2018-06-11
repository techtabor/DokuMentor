const Sequelize = require('sequelize');
var moment = require('moment');
moment.locale('hu');

module.exports = function(sequelize, DataTypes){
  var Document = sequelize.define('Document', {
    add_date: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
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
  
  Document.prototype.getDateFromNow = function () {
    return moment(this.add_date).fromNow();
  };

  Document.associate = function(models) {
    models.Document.hasMany(models.File, {as: 'Files'});
    models.Document.hasMany(models.Rating, {as: 'Ratings'});
  };

  Document.getUniversities = function(models, callback) {
    models.Document.findAll({
      attributes: ['university']
    }).then(result => {
      var unis = [];
      result.forEach(elem => {
            if (!unis.includes(elem.university)) unis.push(elem.university);
      });
      return callback(unis);
    });
  };  
  
  return Document;
};