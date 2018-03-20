// var config = require('./config.js').get(process.env.NODE_ENV);
//https://medium.com/node-and-beyond/environment-dependent-node-js-configuration-b51149286e7e
var config = {
    default: {
      port: 3000,
      database: {
        host: "localhost",
        user: "localuser",
        password: "localpass"
      }
    }
  }
  
  exports.get = function get(env) {
    return config[env] || config.default;
  }