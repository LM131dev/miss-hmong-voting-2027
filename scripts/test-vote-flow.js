const http = require('http');

// 1x1 transparent png in base64
const sampleBase64Slip = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

const postData = JSON.stringify({
  contestant_id: 9, // HM 01
  package_id: 3, // 10 votes
  voter_name: "ລູກຄ້າ VIP ວຽງຈັນ",
  voter_phone: "020 9988 7766",
  cheer_message: "ເຊຍ HM 01 ນາງ ປ່າຢິງ ວີ່ ສຸດໃຈເດີ!",
  payment_ref: "BCEL-999888",
  slip_image_url: sampleBase64Slip,
  instant_demo: false, // Pending verification
});

const req = http.request(
  {
    hostname: 'localhost',
    port: 3000,
    path: '/api/vote',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  },
  (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log('STATUS:', res.statusCode);
      const parsed = JSON.parse(body);
      console.log('RESULT:', JSON.stringify(parsed, null, 2));
    });
  }
);

req.on('error', (e) => console.error('ERROR:', e));
req.write(postData);
req.end();
