(() => {

    let salt;
    let ciphertext;
    let iv;
  
    /*
    Fetch the contents of the "content" textbox, and encode it
    in a form we can use for the encrypt operation.
    */
    function getMessageEncoding() {
      let message = document.querySelector("#content").value;
      let enc = new TextEncoder();
      return enc.encode(message);
    }
  
    /*
    Get some key material to use as input to the deriveKey method.
    The key material is a password supplied by the user.
    */
    function getKeyMaterial() {
      //let password = window.prompt("Enter your password");
      let password = document.querySelector("#password").value;
      let enc = new TextEncoder();
      return window.crypto.subtle.importKey(
        "raw", 
        enc.encode(password), 
        {name: "PBKDF2"}, 
        false, 
        ["deriveBits", "deriveKey"]
      );
    }

    function getKeyMaterialDecrypt(password){

        let enc = new TextEncoder();
        return window.crypto.subtle.importKey(
            "raw", 
            enc.encode(password), 
            {name: "PBKDF2"}, 
            false, 
            ["deriveBits", "deriveKey"]
          );
    }
  
    /*
    Given some key material and some random salt
    derive an AES-GCM key using PBKDF2.
    */
    function getKey(keyMaterial, salt) {
      let enc = new TextEncoder();
      salt = enc.encode(salt);
      return window.crypto.subtle.deriveKey(
        {
          "name": "PBKDF2",
          salt: salt, 
          "iterations": 100000,
          "hash": "SHA-256"
        },
        keyMaterial,
        { "name": "AES-GCM", "length": 256},
        true,
        [ "encrypt", "decrypt" ]
      );
    }
  
    /*
    Derive a key from a password supplied by the user, and use the key
    to encrypt the message.
    Update the "ciphertextValue" box with a representation of part of
    the ciphertext.
    */
    async function encrypt() {
     
  
      let keyMaterial = await getKeyMaterial();
      salt = window.crypto.getRandomValues(new Uint8Array(16));
      
      let key = await getKey(keyMaterial, salt);
      iv = window.crypto.getRandomValues(new Uint8Array(12));
      let encoded = getMessageEncoding();
  
      ciphertext = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        key,
        encoded
      );
  
      
      const ciphertext_result = Array.from(new Uint8Array(ciphertext));
      var b64_cipher = btoa( ciphertext_result);
      
      const paste_id = await sendPaste(b64_cipher,salt,iv);

      

    }
  
    /*
    Derive a key from a password supplied by the user, and use the key
    to decrypt the ciphertext.
    If the ciphertext was decrypted successfully,
    update the "decryptedValue" box with the decrypted value.
    If there was an error decrypting,
    update the "decryptedValue" box with an error message.
    */
    async function decrypt() {
      
      const urlParams = new URLSearchParams(window.location.search);
      const password = urlParams.get('pwd');
      const pasteId = urlParams.get('id');
      const cipherMaterial = urlParams.get('key');
      
      const decoded_cipherMaterial = atob(cipherMaterial);
      
      salt = atob(JSON.parse(decoded_cipherMaterial).salt);
      iv = atob(JSON.parse(decoded_cipherMaterial).iv);

      salt = new Uint8Array( salt.split(','))
      iv = new Uint8Array( iv.split(','))
      
      let keyMaterial = await getKeyMaterialDecrypt(password);
      let key = await getKey(keyMaterial, salt);
      ciphertext = await getPaste(pasteId);   
      
      
      ciphertext = atob(ciphertext);
     
      ciphertext = new Uint8Array( ciphertext.split(','));
      
      try {
        let decrypted = await window.crypto.subtle.decrypt(
          {
            name: "AES-GCM",
            iv: iv
          },
          key,
          ciphertext
        );
          
        
        const decryptedText = new TextDecoder('utf-8').decode(new Uint8Array(decrypted));
        
        let htmlBox = document.querySelector(".htmloutput");
        htmlBox.innerHTML = decryptedText;
        
      } catch (e) {
        console.log(e);
      }
    }

    const getPaste = async(id) => {


        const pasteEncoded = await fetch('/pastes?id='+id);
        const pasteEncodedData = await pasteEncoded.json();
        
        return pasteEncodedData;
    }

    const sendPaste = async(encrypted_paste,salt,iv) => {

        const paste_id = await fetch('/save', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ "content": encrypted_paste })
                        });
                            //.then(response => response.json().then(json => {console.log(json);}))      
        
        
        const paste_id_text = await paste_id.json();
        
        const pwd_object = { 
             
            salt: btoa(salt), 
            iv: btoa(iv)  
        };

        const ciphertextValue = document.querySelector(".ciphertext-value");
        ciphertextValue.textContent = `http://localhost:3000/viewer?id=${paste_id_text}&key=${btoa(JSON.stringify(pwd_object))}&pwd=password`;
        document.querySelector(".ciphertext-label").innerHTML = `Here's your shareable Morcela, don't forget to replace the 'pwd' parameter with your password:`;
      }
  
    
    if(document.querySelector(".encrypt-button") !== null){
        const encryptButton = document.querySelector(".encrypt-button") ;
        encryptButton.addEventListener("click", encrypt);
    }

    if(document.querySelector(".paste-content") !== null){
        
        decrypt();
    }

    
    
  
    //const decryptButton = document.querySelector(".pbkdf2 .decrypt-button");
    

    

  })();
  