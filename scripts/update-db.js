const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");

const dbPath = path.join(__dirname, "../miss-hmong.sqlite");
const dbJsPath = path.join(__dirname, "../src/lib/db.js");

// 1. Update src/lib/db.js
let text = fs.readFileSync(dbJsPath, "utf8");

for (let i = 1; i <= 20; i++) {
  const code = "HM " + String(i).padStart(2, "0");
  const num = String(i).padStart(2, "0");
  const tradPath = `/contestants/traditional_hm${num}.jpg`;

  const startIdx = text.indexOf(`code: "${code}"`);
  if (startIdx === -1) {
    console.log("Contestant not found:", code);
    continue;
  }
  const endIdx = text.indexOf("},", startIdx);
  let block = text.slice(startIdx, endIdx);

  // Replace traditional_image_url
  block = block.replace(
    /traditional_image_url:\s*"[^"]+"/,
    `traditional_image_url: "${tradPath}"`
  );

  // Replace image_url if it contains https:// (FB URLs)
  block = block.replace(
    /image_url:\s*"https:\/\/[^"]+"/,
    `image_url: "/contestants/traditional_hm${num}.jpg"`
  );

  text = text.slice(0, startIdx) + block + text.slice(endIdx);
}

fs.writeFileSync(dbJsPath, text, "utf8");
console.log("Updated src/lib/db.js successfully!");

// 2. Update miss-hmong.sqlite
const db = new DatabaseSync(dbPath);
const updateStmt = db.prepare(
  "UPDATE contestants SET traditional_image_url = ?, image_url = CASE WHEN image_url LIKE 'http%' THEN ? ELSE image_url END WHERE code = ?"
);

for (let i = 1; i <= 20; i++) {
  const code = "HM " + String(i).padStart(2, "0");
  const num = String(i).padStart(2, "0");
  const tradPath = `/contestants/traditional_hm${num}.jpg`;
  updateStmt.run(tradPath, tradPath, code);
}

console.log("Updated miss-hmong.sqlite successfully!");

const rows = db.prepare("SELECT code, name, image_url, traditional_image_url FROM contestants ORDER BY code ASC").all();
console.table(rows);
