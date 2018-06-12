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
    rating_info(req.params.docid, (data) => {
        res.end(String(data));
    });
    
    //res.send(String(rating_info(req.params.docid)));
});

function rating_info(docid, callback){
    var sum = 0, length = 0;
    models.Rating.findAll({where: {DocumentId: docid}}).then( (result) => {
        length = result.length;
        for(var i=0; i<result.length; i++){
            //console.log("******");
            sum += result[i].dataValues.value;
            //console.log(result[i].dataValues.value);
            //console.log(typeof result[i].dataValues.value);
        }
        console.log(sum);
        callback([sum, length]);
    });
    //console.log("--->");
    //console.log([sum, length]);
    
    //return [sum, length]
}



module.exports = router;