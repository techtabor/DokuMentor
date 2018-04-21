var express = require('express');
var router = express.Router();

var config = require('../config/config.js').get(process.env.NODE_ENV);

const models = require('../models/');

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