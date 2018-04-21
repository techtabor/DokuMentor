const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes){
     var File = sequelize.define('File', {
        size: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        extension: {
          type: Sequelize.STRING,
          allowNull: false
        }
    });

    return File;
};