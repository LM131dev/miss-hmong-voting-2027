const { getDb } = require('../src/lib/db.js');
const db = getDb();

const insertNews = db.prepare(`
  INSERT INTO news_items (order_no, title, date, category, summary, content, images_json, type)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

// Delete any existing camp activities news first to avoid duplicates
db.prepare("DELETE FROM news_items WHERE title LIKE '%ກິດຈະກຳເກັບໂຕ%'").run();

insertNews.run(
  2,
  'ພາບບັນຍາກາດກິດຈະກຳເກັບໂຕ ມື້ທີ 1 & ມື້ທີ 2 ທີ່ ສວນບັນດາເຜົ່າ / Lao Ethnic Garden',
  '15 ພະຈິກ 2026',
  'ກິດຈະກຳເກັບໂຕ',
  'ຊ້ອມຍ່າງ, ຮຽນບຸກຄະລິກກະພາບ, ມາລະຍາດ, ການເວົ້າ, ການນົບ, ການໂພສຢູ່ເວທີ ແລະ ຖ່າຍຮູບກຸ່ມ 1–4 • ຊ່າງພາບ: StarYang CU',
  'ນ້ອງໆຜູ້ເຂົ້າປະກວດ ນາງສາວເຜົ່າມົ້ງ ນະຄອນຫຼວງວຽງຈັນ Miss Hmong Vientiane 2027 ທັງ 20 ໝາຍເລກ (HM 01 - HM 20) ໄດ້ເຂົ້າຮ່ວມກິດຈະກຳເກັບໂຕຢ່າງເປັນທາງການ ມື້ທີ 1 ແລະ ມື້ທີ 2 ທີ່ ສວນບັນດາເຜົ່າ (Lao Ethnic Garden), ບ້ານໃໝ່ດ່ານຊີ ເມືອງນາຊາຍທອງ ນະຄອນຫຼວງວຽງຈັນ.\n\nກິດຈະກຳສຳຄັນຕະຫຼອດ 2 ມື້:\n• ພາກເຊົ້າ: ຝຶກຊ້ອມທັກສະການແນະນຳຕົນເອງເປັນພາສາມົ້ງ ແລະ ພາສາລາວ, ການກ່າວທັກທາຍຕໍ່ໜ້າກ້ອງ ແລະ ເທິງເວທີຫໍປະຊຸມໃຫຍ່.\n• ພາກບ່າຍ: ທັດສະນະສຶກສາເຮືອນຊົນເຜົ່າດັ້ງເດີມ, ວັງພະຍານາກ, ແລະ ຍ່າງຊົມສວນໄຜ່ອັນຮົ່ມເຢັນ.\n• ການຝຶກອົບຮົມບຸກຄະລິກກະພາບ: ການຍ່າງ Catwalk, ມາລະຍາດການນົບ, ທ່າທາງການໂພສເທິງເວທີ.\n• ການສະແດງສິລະປະ-ວັດທະນະທຳ: ການຟ້ອນມົ້ງດັ້ງເດີມ ແລະ ຖ່າຍຮູບໝູ່ກຸ່ມ 1-4 ໂດຍຊ່າງພາບ StarYang CU.\n\nແຟນໆສາມາດຮ່ວມສົ່ງແຮງໃຈ ແລະ ໂຫວດຄະແນນຂວັນໃຈມະຫາຊົນໃຫ້ແກ່ນ້ອງໆສາວງາມທີ່ທ່ານຊື່ນຊອບໄດ້ທຸກວັນຕະຫຼອດ 24 ຊົ່ວໂມງ!',
  JSON.stringify([
    '/activities/act1.jpg',
    '/activities/act2.jpg',
    '/activities/act3.jpg',
    '/activities/act4.jpg',
    '/activities/act5.jpg',
    '/activities/act6.jpg'
  ]),
  'gallery'
);

insertNews.run(
  3,
  'ກິດຈະກຳເທິງເວທີຫໍປະຊຸມ • ຝຶກຊ້ອມການເວົ້າ, ບຸກຄະລິກກະພາບ ແລະ ການສະແດງສິລະປະ',
  '14 ພະຈິກ 2026',
  'ຝຶກຊ້ອມເທິງເວທີ',
  'ຜູ້ເຂົ້າປະກວດ Miss Hmong Vientiane 2027 ຝຶກຊ້ອມບຸກຄະລິກກະພາບ, ການນົບ ແລະ ການກ່າວທັກທາຍເທິງເວທີຫໍປະຊຸມ',
  'ບັນຍາກາດການຝຶກຊ້ອມເທິງເວທີຫໍປະຊຸມໃຫຍ່ ສວນບັນດາເຜົ່າ ນ້ອງໆສາວງາມທັງ 20 ທ່ານ ໄດ້ສະແດງໄຫວພິບ ແລະ ຄວາມສາມາດຢ່າງໂດດເດັ່ນ ທັງການເວົ້າພາສາມົ້ງ ແລະ ພາສາລາວ ພ້ອມທັງຝຶກຊ້ອມທ່າຟ້ອນສິລະປະມົ້ງອັນອ່ອນຊ້ອຍ.',
  JSON.stringify([
    '/activities/act4.jpg',
    '/activities/act5.jpg',
    '/activities/act6.jpg'
  ]),
  'gallery'
);

console.log('Successfully updated camp activities news items in DB!');
