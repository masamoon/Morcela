const { format } = require("util");
var fs = require('fs');
const { Storage } = require("@google-cloud/storage");
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: "google-cloud-key.json" });
const bucket = storage.bucket("morcelas-storage");
const { marked } = require('marked');
const {v4: uuidv4 } = require('uuid')
const path = require("path");
const crypto_utils = require("../utils/crypto.utils");

const upload = async (req, res) => {
    
    const id_content = uuidv4();
    file_name = id_content+'.md';
    
    try {
        //await processFile(req, res);
        // add logic to check file size 

        const paste_content = req.body.content;  
        console.log("sent paste: "+paste_content);
        //const paste_password = req.body.password;
        //const paste_protected = req.body.password_protected;

        /*if(paste_protected){
          const [salt,encrypted_paste] = await crypto_utils.encryptWithPassword(paste_content,paste_password);
          //db_utils.saveData(id_content,encrypted_paste,salt);
          await bucket.file(file_name).save(encrypted_paste);
        }
        else{*/
          await bucket.file(file_name).save(paste_content);    
          
        //}

        
        
      } catch (err) {
        res.status(500).send({
          message: `Could not upload the file: ${file_name}. ${err}`,
        });
      }
      
      res.status(200).json(id_content);
      //res.redirect('pastes/'+id_content);
  };
  

  
  const download = async (req, res) => {

    const paste_id = req.query.id;
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
        res.status(200).json(markdownContent);    
               
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