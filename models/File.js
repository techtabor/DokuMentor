const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes){
  var File = sequelize.define('File', {
      originalname: {
        type: Sequelize.STRING,
        allowNull: true
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      extension: {
        type: Sequelize.STRING,
        allowNull: false
      }
  });

  return File;
};