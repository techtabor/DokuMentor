const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes){
  var Rating = sequelize.define('Rating', {
      value: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
  });
  
  return Rating;
};