const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'app', 'api', 'admin', 'route.js');
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(
  'const { action, payload } = body;',
  'const { action } = body;\n    const payload = body.payload || body.data || body;'
);

fs.writeFileSync(filePath, code, 'utf8');
console.log("Updated admin route to support flexible payload/data!");
