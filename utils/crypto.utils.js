const bcrypt = require("bcrypt")


const encryptWithPassword = async (content,password) => {

    bcrypt.genSalt(10, (err, salt) => {
        // use salt to hash password
        bcrypt.hash(password, salt, function(err, hash) {
            // Store hash in the database
            });
    });
};
