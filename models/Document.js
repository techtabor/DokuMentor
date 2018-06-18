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
      validate: {
        min: {
          args: 1,
          msg: "A félév pozitív csak egész szám lehet."
        }
      }
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

  Document.prototype.getLectureDateFromNow = function () {
    return moment(this.lecture_date).fromNow();
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


    var fs = require('fs'),
        readline = require('readline');
        path = require('path');

    var rd = readline.createInterface({
      input: fs.createReadStream(path.resolve(__dirname , '../data/universities.txt')),
      output: null,
      console: false
    });

    rd.on('line', function(line) {
      if (line.includes(' - ')) {
        unis.push(line);
      }
    });
    rd.on('close',()=>{
      unis.sort();
      return callback(unis);
      //console.log(data);
    });
      //unis = ['BCE', 'BGE', 'BME', 'DE', 'DRHE', 'DUE', 'EGHF', 'EJF', 'ELTE', 'GYHF', 'KEE', 'KRE', 'LFZE', 'ME', 'METU', 'MOME', 'NJE', 'NKE', 'NYE', 'OE', 'PE', 'PTE', 'SE', 'SOE', 'SZE', 'SZIE', 'SZTE', 'TE', 'VHF'];
      /*result.forEach(elem => {
            if (!unis.includes(elem.university)) unis.push(elem.university);
      });*/
    });
  };  
  
  return Document;
};