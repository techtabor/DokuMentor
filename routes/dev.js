var express = require('express');
var router = express.Router();

var moment = require('moment');
var path = require('path');
const fs = require("fs");

var config = require('../config/config.js').get(process.env.NODE_ENV);

const models = require('../models/');

const authCheck = (req, res, next) => {
      if(!req.isAuthenticated()){
            res.redirect('../auth/login');
      } else {
            next();
      }
};

router.get('/alluser', (req, res) => {
    models.User.findAll().then( (result)=>{
          res.send(result);
      });
});

router.get('/user/:userid', (req, res) => {
      models.User.findById(req.params.userid).then((result) =>{
            res.send(result);
      });
});

module.exports = router;