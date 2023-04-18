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
  /*const paste_content = req.body.content;
  const id_content = uuidv4();
  file_name = id_content+'.md';*/

  /*fs.writeFile('pastes/'+file_name,paste_content,(err)=> {
    if (err){
      console.error(err);
      res.sendStatus(500);
    } else {
      res.redirect('pastes/'+id_content);
    }
  });*/

  controller.upload(req,res);


});

router.get('/pastes/:id', (req,res) => {

  controller.download(req,res);
  //const paste_id = req.params.id;
  //const markdownContent = fs.readFileSync('pastes/'+paste_id+'.md', 'utf8');
  //res.render('pastes.pug', { pasteContent: marked(markdownContent) });


});



module.exports = router;

