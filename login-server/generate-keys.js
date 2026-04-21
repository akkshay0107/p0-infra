const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const keysDir = path.join(__dirname, '..', 'data', 'keys');
if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir, { recursive: true });
}

crypto.generateKeyPair('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
}, (err, publicKey, privateKey) => {
  if (err) {
    console.error("Error generating keys:", err);
    return;
  }
  
  fs.writeFileSync(path.join(keysDir, 'public.pem'), publicKey);
  fs.writeFileSync(path.join(keysDir, 'private.pem'), privateKey);
  
  console.log('RSA Keys generated in data/keys/');
});
