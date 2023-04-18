const processFile = require("../middleware/upload");
const { format } = require("util");
var fs = require('fs');
const { Storage } = require("@google-cloud/storage");
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: "google-cloud-key.json" });
const bucket = storage.bucket("morcelas-storage");
const { marked } = require('marked');
const {v4: uuidv4 } = require('uuid')
const path = require("path");

const upload = async (req, res) => {
    
    const id_content = uuidv4();
    
    try {
        //await processFile(req, res);
        
        const paste_content = req.body.content;
        
        file_name = id_content+'.md';

        await bucket.file(file_name).save(paste_content);
        
        
      } catch (err) {
        res.status(500).send({
          message: `Could not upload the file: ${file_name}. ${err}`,
        });
      }

      res.redirect('pastes/'+id_content);
  };
  

  
  const download = async (req, res) => {

    const paste_id = req.params.id;
    const file_path = path.join(__dirname,'../pastes/'+paste_id+'.md');
    try {
        
        const options = {
            destination: file_path,
        };

        await bucket.file(paste_id+'.md').download(options);

        const markdownContent = fs.readFileSync(file_path, 'utf8');

        fs.rmSync('pastes/'+paste_id+'.md', {
            force: true,
        });

        res.render('pastes.pug', { pasteContent: marked(markdownContent) });
        
        

        
      } catch (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
  };
  
  module.exports = {
    upload,
    download,
  };