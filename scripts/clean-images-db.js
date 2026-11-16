const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, '../miss-hmong.sqlite');
const dbJsPath = path.join(__dirname, '../src/lib/db.js');

// 1. Update src/lib/db.js
let text = fs.readFileSync(dbJsPath, 'utf8');

// For HM 01 to HM 05, set image_url: "" in OFFICIAL_CONTESTANTS
for (let i = 1; i <= 5; i++) {
  const code = 'HM ' + String(i).padStart(2, '0');
  const startIdx = text.indexOf('code: "' + code + '"');
  if (startIdx === -1) continue;
  const endIdx = text.indexOf('},', startIdx);
  let block = text.slice(startIdx, endIdx);
  block = block.replace(/image_url:\s*"[^"]*"/, 'image_url: ""');
  text = text.slice(0, startIdx) + block + text.slice(endIdx);
}

// For HM 06 to HM 20, ensure image_url: "/contestants/hmXX.jpg"
for (let i = 6; i <= 20; i++) {
  const code = 'HM ' + String(i).padStart(2, '0');
  const num = String(i).padStart(2, '0');
  const startIdx = text.indexOf('code: "' + code + '"');
  if (startIdx === -1) continue;
  const endIdx = text.indexOf('},', startIdx);
  let block = text.slice(startIdx, endIdx);
  block = block.replace(/image_url:\s*"[^"]*"/, 'image_url: "/contestants/hm' + num + '.jpg"');
  text = text.slice(0, startIdx) + block + text.slice(endIdx);
}

fs.writeFileSync(dbJsPath, text, 'utf8');
console.log('src/lib/db.js updated successfully!');

// 2. Update SQLite
const db = new DatabaseSync(dbPath);
const updateEmptyStmt = db.prepare('UPDATE contestants SET image_url = ? WHERE code = ?');
for (let i = 1; i <= 5; i++) {
  const code = 'HM ' + String(i).padStart(2, '0');
  updateEmptyStmt.run('', code);
}

const updateJewStmt = db.prepare('UPDATE contestants SET image_url = ? WHERE code = ?');
for (let i = 6; i <= 20; i++) {
  const code = 'HM ' + String(i).padStart(2, '0');
  const num = String(i).padStart(2, '0');
  updateJewStmt.run('/contestants/hm' + num + '.jpg', code);
}

const updateTradStmt = db.prepare('UPDATE contestants SET traditional_image_url = ? WHERE code = ?');
for (let i = 1; i <= 20; i++) {
  const code = 'HM ' + String(i).padStart(2, '0');
  const num = String(i).padStart(2, '0');
  updateTradStmt.run('/contestants/traditional_hm' + num + '.jpg', code);
}
console.log('SQLite database updated successfully!');

const rows = db.prepare('SELECT code, name, image_url, traditional_image_url FROM contestants ORDER BY code ASC').all();
console.table(rows);
