var express = require('express');
var router = express.Router();

//Külső config fájl betöltése:
var config = require('../config/config.js').get(process.env.NODE_ENV);

const models = require('../models/');

router.get('/alluser', (req, res) => {
    console.log(models.users);
    models.users.findAll().then( (result)=>{
          res.send(result);
      });
});

router.get('/user/:userid', (req, res) => {
      models.users.findById(req.params.userid).then((result) =>{
        res.send(result);
      });
});

module.exports = router;