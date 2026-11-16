const http = require('http');

const postData = JSON.stringify({
  action: 'APPROVE_TX',
  data: { id: 12 },
});

const req = http.request(
  {
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin',
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
      console.log('APPROVE STATUS:', res.statusCode);
      console.log('APPROVE RESULT:', body);
    });
  }
);

req.on('error', (e) => console.error('ERROR:', e));
req.write(postData);
req.end();
