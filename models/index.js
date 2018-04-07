//Ezt a kódrészletet elég használni, mintsem meg is érteni.
'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(__filename);
var env       = process.env.NODE_ENV || 'development';
//var config    = require(__dirname + '/../config/config.js')[env];
var db        = {};

var config = require('../config/config.js').get(process.env.NODE_ENV);

var sequelize = new Sequelize(config.databaseconnection.database,
    config.databaseconnection.user,
    config.databaseconnection.password, {
    host: config.databaseconnection.host,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    define: {
      timestamps: false
    },
    logging: false,
    operatorsAliases: false
  });
/*
if (false/*config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}
*/
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
    //?
  }
});

sequelize.sync();
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;