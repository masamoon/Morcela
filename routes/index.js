var express = require('express');
var router = express.Router();
var fs = require('fs');
const {v4: uuidv4 } = require('uuid')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/save', function(req,res,next){
  const paste_content = req.body.content;
  const id_content = uuidv4();
  file_name = id_content+'.txt';
  fs.writeFile('pastes/'+file_name,paste_content,(err)=> {
    if (err){
      console.errot(err);
      res.sendStatus(500);
    } else {
      res.render('index',{id_content:id_content});
    }
  });
});

router.get('/pastes/:id', (req,res) => {
  const paste_id = req.params.id;
  fs.readFile('pastes/'+paste_id+'.txt', 'utf-8', (err,data) => {
    if (err) {
      return res.status(404).send('File not found');
    }
    res.render('pastes', { pasteContent: data});

  });

});

module.exports = router;

