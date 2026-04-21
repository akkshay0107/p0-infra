const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dbPath = path.join(__dirname, '..', 'data', 'users.db');
const privateKeyPath = path.join(__dirname, '..', 'data', 'keys', 'private.pem');

let db;
let privateKey;

try {
  privateKey = fs.readFileSync(privateKeyPath, 'utf8');
} catch (err) {
  console.error("Could not read private key. Did you run generate-keys.js?");
}

if (fs.existsSync(dbPath)) {
  db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
} else {
  console.error("Users database not found. Did you run generate-users.js?");
}

function toID(text) {
  if (typeof text !== 'string') return '';
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

app.all('/api/action.php', (req, res) => {
  const params = req.method === 'POST' ? req.body : req.query;
  const { act, name, pass, challengekeyid, challenge } = params;

  if (act === 'login') {
    const userid = toID(name);

    if (!db) {
      return res.send(']' + JSON.stringify({ actionsuccess: false, assertion: '' }));
    }

    db.get('SELECT * FROM users WHERE userid = ?', [userid], (err, row) => {
      if (err || !row) {
        console.log(`Failed login: ${userid} (user not found)`);
        return res.send(']' + JSON.stringify({ actionsuccess: false, assertion: '' }));
      }

      const match = bcrypt.compareSync(pass, row.password_hash);
      if (!match) {
        console.log(`Failed login: ${userid} (invalid password)`);
        return res.send(']' + JSON.stringify({ actionsuccess: false, assertion: '' }));
      }

      const timestamp = Math.floor(Date.now() / 1000);
      const hostname = 'localhost'; // Or process.env.HOST
      const tokenData = `${challenge},${userid},2,${timestamp},${hostname}`;

      const signer = crypto.createSign('RSA-SHA1');
      signer.update(tokenData);
      const sig = signer.sign(privateKey, 'hex');

      console.log(`Successful login: ${userid}`);
      return res.send(']' + JSON.stringify({
        actionsuccess: true,
        assertion: `${tokenData};${sig}`
      }));
    });
  } else {
    res.send(']');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Login server listening on port ${PORT}`);
});
