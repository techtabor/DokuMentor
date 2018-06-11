var express = require('express');
var router = express.Router();
var moment = require('moment');
var path = require('path');
var fs = require('fs');

const models = require('../models/');

const authCheck = (req, res, next) => {
    if(!req.isAuthenticated()){
        res.redirect('/auth/login');
    } else {
        next();
    }
};


router.get('/rate/:docid', authCheck, (req, res) => {
    var value = req.query.value;
    if(!value || !(value == parseInt(value, 10)) || value < 1 || 5 < value){
        return res.status(400).send("Helytelen vagy hiányos adatok");
    }
    
    
    models.Document.findById(req.params.docid).then(document => {
        
        var data = {
            value: req.query.value,
            UserId: req.user.id,
            DocumentId: req.params.docid
        };
        models.Rating.findOne({ where: {
            UserId: req.user.id,
            DocumentId: req.params.docid
        }}).then(obj => {
            
            if(obj){
                obj.update(data);
                console.log(obj);
                console.log("hehe");
            }
            else{
                console.log("alma");
                models.Rating.create(data);
            }
        });
        res.send("alma");
        
    });
    
});

router.get("/rating_info/:docid", authCheck, (req, res) => {
    models.Document.findById(req.params.docid).then(document => {
        models.Rating.findAll({where: {DocumentId: document.id}}).then( (result) => {
            console.log(result);
            res.send(String(result));
        });
    });
});



module.exports = router;