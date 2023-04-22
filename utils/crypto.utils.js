const crypto = require('crypto');



const encryptWithPassword = async (content,password) => {

    // Generate a random salt
    const salt = crypto.randomBytes(16);

    // Derive a key from the password and salt using PBKDF2
    const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');

    // Create a new AES cipher object with the key and a random IV
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    // Encrypt the data using AES-CBC mode
    let encrypted_data = cipher.update(content, 'utf8', 'hex');
    encrypted_data += cipher.final('hex');

    return [salt,encrypted_data];
};


const decryptWithPassword = async (encrypted_data,salt,password) => {
  

    // Derive a key from the password and salt using PBKDF2
    const key = crypto.pbkdf2Sync(password, Buffer.from(salt, 'hex'), 100000, 32, 'sha256');

    // Extract the IV from the encrypted data
    const iv = Buffer.from(encrypted_data.slice(0, 32), 'hex');

    // Create a new AES decipher object with the key and IV
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    // Decrypt the data using AES-CBC mode
    let decrypted_data = decipher.update(encrypted_data.slice(32), 'hex', 'utf8');
    decrypted_data += decipher.final('utf8');
};

module.exports = {
    encryptWithPassword,
    decryptWithPassword,
  };