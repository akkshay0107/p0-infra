const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'users.db');
const csvPath = path.join(dataDir, 'participant-credentials.csv');

// Parse -n argument
let numToCreate = 0;
const nIndex = process.argv.indexOf('-n');
if (nIndex !== -1 && process.argv[nIndex + 1]) {
  numToCreate = parseInt(process.argv[nIndex + 1], 10);
} else if (nIndex !== -1) {
  console.error("Error: -n argument requires a number.");
  process.exit(1);
}

const db = new sqlite3.Database(dbPath);

function toID(text) {
  if (typeof text !== 'string') return '';
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function generatePassword() {
  return crypto.randomBytes(20).toString('base64url');
}

db.serialize(() => {
  // Create table if not exists
  db.run(`CREATE TABLE IF NOT EXISTS users (
    userid TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL
  )`);

  // Ensure Bot exists
  const botId = toID('Bot');
  db.get("SELECT userid FROM users WHERE userid = ?", [botId], (err, row) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    if (!row) {
      if (!process.env.BOT_PASSWORD) {
        console.warn("Warning: BOT_PASSWORD environment variable not set. Generating a random password for 'Bot'.");
      }
      const password = process.env.BOT_PASSWORD || generatePassword();
      const hash = bcrypt.hashSync(password, 10);
      db.run("INSERT INTO users VALUES (?, ?, ?)", [botId, 'Bot', hash]);
      console.log(`Created Bot user.`);
      if (!process.env.BOT_PASSWORD) {
        console.log(`Generated Bot password: ${password}`);
      }
    }
  });

  if (numToCreate > 0) {
    // Count existing pXXX users to determine next ID
    db.get("SELECT COUNT(*) as count FROM users WHERE userid LIKE 'p%'", (err, row) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      
      const startIdx = (row ? row.count : 0) + 1;
      const endIdx = startIdx + numToCreate - 1;

      console.log(`Generating ${numToCreate} users (p${String(startIdx).padStart(3, '0')} to p${String(endIdx).padStart(3, '0')})...`);

      const stmt = db.prepare("INSERT INTO users VALUES (?, ?, ?)");
      let newCsvContent = "";
      
      const csvExists = fs.existsSync(csvPath);
      if (!csvExists) {
        newCsvContent = "username,password\n";
      }

      for (let i = startIdx; i <= endIdx; i++) {
        const id = String(i).padStart(3, '0');
        const username = `p${id}`;
        const password = generatePassword();
        const hash = bcrypt.hashSync(password, 10);
        
        stmt.run(toID(username), username, hash);
        newCsvContent += `${username},${password}\n`;
      }

      stmt.finalize((err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        
        if (csvExists) {
          fs.appendFileSync(csvPath, newCsvContent);
        } else {
          fs.writeFileSync(csvPath, newCsvContent);
        }
        
        console.log(`Successfully added ${numToCreate} users.`);
        console.log(`Credentials appended to: ${csvPath}`);
        db.close();
      });
    });
  } else {
    console.log("No new participants requested (use -n <number> to add users).");
    db.close();
  }
});
