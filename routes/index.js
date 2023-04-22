var express = require('express');
var router = express.Router();
const controller = require("../controller/file.controller");
var fs = require('fs');
const { marked } = require('marked');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/save', function(req,res,next){
   
  controller.upload(req,res);

});

router.get('/viewer/', (req,res) => {

  res.render('pastes');
  
});

router.get('/pastes/', (req,res) => {

  controller.download(req,res);
  
});



module.exports = router;

