const Sequelize = require('sequelize');
var moment = require('moment');
moment.locale('hu');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    key: {
      type: Sequelize.STRING,
      allowNull: false
    },
    add_date: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  });

  User.prototype.getDateFromNow = function () {
    return moment(this.add_date).fromNow();
  };

  User.associate = function(models) {
    models.User.hasMany(models.Document, {as: 'Documents'});
    models.User.hasMany(models.Rating, {as: "Ratings"});
  };

  return User;
};
