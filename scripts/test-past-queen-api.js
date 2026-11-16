const http = require('http');

const postData = JSON.stringify({
  action: 'SAVE_PAST_QUEEN',
  payload: {
    id: 2,
    year: "2020",
    name: "ທ່ານ ນາງ ປ່າເຢັ່ງຊາ ລໍ່",
    title: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫລວງວຽງຈັນ 2020",
    badge: "Miss Universe Laos 2022 • Top 16 Miss Universe",
    bio: "ເຈົ້າຂອງມົງກຸດ 2020 ແລະ ຜູ້ສ້າງປະຫວັດສາດໃຫ້ປະເທດລາວ ເຂົ້າຮອບ Top 16 Miss Universe 2022",
    image_url: "/api/avatar?code=2020&bg=purple&name=%E0%BA%9B%E0%BA%B8%E0%BB%88%E0%BA%B2%E0%BB%80%E0%BA%8D%E0%BA%B1%E0%BB%88%E0%BA%87%E0%BA%8A%E0%BA%B2",
    order_no: 2
  }
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
    res.on('end', () => console.log('SAVE_PAST_QUEEN:', res.statusCode, body));
  }
);

req.on('error', (e) => console.error('ERROR:', e));
req.write(postData);
req.end();
