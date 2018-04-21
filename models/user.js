const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes){
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

    User.associate = function(models) {
      models.User.hasMany(models.Document);
    };
    
    return User;
};