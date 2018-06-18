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


router.get('/rate/:docid/:value', authCheck, (req, res) => {
    var value = req.params.value;
    if(!value || !(value == parseInt(value, 10)) || value < 1 || 5 < value){
        return res.status(400).send("Helytelen vagy hiányos adatok.");
    }
    
    
    models.Document.findById(req.params.docid).then(document => {
        
        var data = {
            value: value,
            UserId: req.user.id,
            DocumentId: req.params.docid
        };
        models.Rating.findOne({ where: {
            UserId: req.user.id,
            DocumentId: req.params.docid
        }}).then(obj => {
            
            if(obj){
                //console.log("ide");
                obj.update(data);
                //console.log(obj);
                //console.log("hehe");
            }
            else{
                //console.log("alma");
                models.Rating.create(data);
            }
        });
        var backURL=req.header('Referer') || '/';
        res.redirect(backURL);
        
    });
    
});

router.get("/rating_info/:docid", authCheck, (req, res) => {
    rating_info(req.params.docid, (data) => {
        res.end(String(data));
    });
});

function rating_info(docid, callback){
    var sum = 0, length = 0;
    models.Rating.findAll({where: {DocumentId: docid}}).then( (result) => {
        length = result.length;
        for(var i=0; i<result.length; i++){
            sum += result[i].dataValues.value;
        }
        //console.log(sum);
        callback([sum, length]);
    });
}



module.exports = router;