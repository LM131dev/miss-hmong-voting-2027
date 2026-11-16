const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");

const DB_PATH = path.join(process.cwd(), "miss-hmong.sqlite");
const db = new DatabaseSync(DB_PATH);

console.log("Migrating database for all frontend sections...");

// 1. Committee Table
db.exec(`
  CREATE TABLE IF NOT EXISTS committee (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_no INTEGER NOT NULL DEFAULT 1,
    badge TEXT NOT NULL DEFAULT '',
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    sub_role TEXT NOT NULL DEFAULT '',
    quote TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL,
    featured INTEGER NOT NULL DEFAULT 0
  );
`);

// 2. Ticket Tiers Table
db.exec(`
  CREATE TABLE IF NOT EXISTS ticket_tiers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tier_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    name_lao TEXT NOT NULL,
    price_lak INTEGER NOT NULL DEFAULT 50000,
    bonus_votes INTEGER NOT NULL DEFAULT 0,
    zone TEXT NOT NULL DEFAULT '',
    perks_json TEXT NOT NULL DEFAULT '[]',
    badge TEXT NOT NULL DEFAULT '',
    popular INTEGER NOT NULL DEFAULT 0,
    order_no INTEGER NOT NULL DEFAULT 1
  );
`);

// 3. Schedule Items Table
db.exec(`
  CREATE TABLE IF NOT EXISTS schedule_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_no INTEGER NOT NULL DEFAULT 1,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT '',
    is_live INTEGER NOT NULL DEFAULT 0,
    is_done INTEGER NOT NULL DEFAULT 0,
    is_finale INTEGER NOT NULL DEFAULT 0
  );
`);

// 4. News Items Table
db.exec(`
  CREATE TABLE IF NOT EXISTS news_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_no INTEGER NOT NULL DEFAULT 1,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    summary TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    images_json TEXT NOT NULL DEFAULT '[]',
    type TEXT NOT NULL DEFAULT 'news'
  );
`);

// 5. Sponsors Table
db.exec(`
  CREATE TABLE IF NOT EXISTS sponsors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tier TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT '',
    order_no INTEGER NOT NULL DEFAULT 1
  );
`);

// Seed Committee if empty
const comCount = db.prepare("SELECT COUNT(*) as count FROM committee").get();
if (!comCount || comCount.count === 0) {
  console.log("Seeding committee table...");
  const insertCom = db.prepare(`
    INSERT INTO committee (order_no, badge, name, role, sub_role, quote, image, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCom.run(
    1,
    "ປະທານສູງສຸດ • CHAIRMAN",
    "ປະທານ ພູວົງ ພະມີສິດ",
    "ປະທານກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027",
    "ປະທານໂຄງການ ສວນບັນດາເຜົ່າ (Lao Ethnic Garden) & ປະທານ ຮ້ານຄຳພູວົງ (Phouvong Jewelry)",
    "ສົ່ງເສີມ ແລະ ອະນຸລັກວັດທະນະທຳຮີດຄອງປະເພນີອັນດີງາມຂອງແມ່ຍິງຊົນເຜົ່າມົ້ງ ພ້ອມຊິງຕຳແໜ່ງ ແລະ ເງິນລາງວັນລວມມູນຄ່າ 500 ກວ່າລ້ານກີບ",
    "/committee/img3.jpg",
    1
  );
  insertCom.run(
    2,
    "ຜູ້ອຳນວຍການ • DIRECTOR",
    "ທ່ານ ນາງ ຄຳຫລ້າ ລໍ່ເບຼຍຢາວ",
    "ຜູ້ອຳນວຍການກອງປະກວດ",
    "ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027",
    "ສ້າງເວທີມາດຕະຖານສາກົນ ເປີດໂອກາດໃຫ້ແມ່ຍິງເຜົ່າມົ້ງສະແດງຄວາມສາມາດ ແລະ ສັກກະຍະພາບສູງສຸດ",
    "/committee/img5.jpg",
    0
  );
  insertCom.run(
    3,
    "ຜູ້ຈັດການທົ່ວໄປ • GM",
    "ທ່ານ ນາງ ລັດສະໝີ ໄຊຍະວົງ",
    "ຜູ້ຈັດການທົ່ວໄປ",
    "ໂຄງການ ສວນບັນດາເຜົ່າ (Lao Ethnic Garden)",
    "ຍິນດີຕ້ອນຮັບທຸກທ່ານສູ່ ສວນບັນດາເຜົ່າ ສວນທ່ອງທ່ຽວວັດທະນະທຳ ແລະ ສະຖານທີ່ຈັດງານກອງປະກວດ",
    "/committee/img1.jpg",
    0
  );
  insertCom.run(
    4,
    "ຜູ້ບໍລິຫານ • EXECUTIVE",
    "ທ່ານ ບຸນມີ ບົວແກ້ວ",
    "ຜູ້ບໍລິຫານກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ",
    "ຄະນະບໍລິຫານກອງປະກວດ Miss Hmong Vientiane 2027",
    "ຄວາມໂປ່ງໃສ ຍຸຕິທຳ ແລະ ມາດຕະຖານການຕັດສິນຄືຫົວໃຈຫຼັກຂອງກອງປະກວດ MHVT 2027",
    "/committee/img2.jpg",
    0
  );
  insertCom.run(
    5,
    "ຜູ້ຈັດການກອງປະກວດ • MANAGER",
    "ທ່ານ ນາງ ຈິນດາ ວົງຄຳສິດ",
    "ຜູ້ຈັດການກອງປະກວດ",
    "ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027",
    "ເບິ່ງແຍງ ແລະ ພັດທະນາບຸກຄະລິກກະພາບສາວງາມທັງ 20 ໝາຍເລກ ໃຫ້ພ້ອມສຳລັບຄ່ຳຄືນຮອບຕັດສິນ",
    "/committee/img4.jpg",
    0
  );
}

// Seed Ticket Tiers if empty
const tickCount = db.prepare("SELECT COUNT(*) as count FROM ticket_tiers").get();
if (!tickCount || tickCount.count === 0) {
  console.log("Seeding ticket_tiers table...");
  const insertTick = db.prepare(`
    INSERT INTO ticket_tiers (tier_id, name, name_lao, price_lak, bonus_votes, zone, perks_json, badge, popular, order_no)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertTick.run(
    "standard",
    "Standard Garden Pass",
    "ບັດເຂົ້າຊົມທົ່ວໄປ (Standard Zone)",
    50000,
    2,
    "Zone C • ບ່ອນນັ່ງອັດສະຈັນ",
    JSON.stringify([
      "ບັດເຂົ້າຊົມງານຮອບຕັດສິນ 1 ທ່ານ",
      "ເຂົ້າຊົມນິທັດສະການສວນບັນດາເຜົ່າຟຣີ",
      "ຮັບຟຣີຄະແນນໂຫວດ +2 Votes",
    ]),
    "ລາຄາປະຢັດ",
    0,
    1
  );

  insertTick.run(
    "gold",
    "Gold Cultural Zone",
    "ບັດ Gold Zone (ກາງຮໍໃກ້ເວທີ)",
    150000,
    15,
    "Zone B • ກາງຮໍ",
    JSON.stringify([
      "ບ່ອນນັ່ງໂຊນ Gold ມຸມມອງຊັດເຈນ",
      "ຮັບຟຣີຄະແນນໂຫວດ +15 Votes ທັນທີ",
      "ຮັບເຄື່ອງດື່ມ Welcome Drink 1 ຊຸດ",
    ]),
    "ຍອດນິຍົມ",
    1,
    2
  );

  insertTick.run(
    "vip",
    "VIP Front Row",
    "ບັດ VIP ແຖວໜ້າຕິດຂອບເວທີ",
    350000,
    40,
    "Zone A • VIP Front Row",
    JSON.stringify([
      "ບ່ອນນັ່ງ VIP ແຖວໜ້າສຸດໃກ້ຊິດສາວງາມ",
      "ຮັບຟຣີຄະແນນໂຫວດ +40 Votes",
      "ສິດຖ່າຍຮູບຮ່ວມກັບຜູ້ຊະນະຫຼັງຈົບງານ",
      "ຊຸດຂອງທີ່ລະລຶກ ສວນບັນດາເຜົ່າ Limited",
    ]),
    "VIP Pass",
    0,
    3
  );

  insertTick.run(
    "vvip",
    "VVIP Royal Table (10 Seats)",
    "ໂຕະ VVIP ກຽດຕິຍົດ (ສຳລັບ 10 ທ່ານ)",
    5000000,
    600,
    "Royal Zone • ໜ້າເວທີກາງ",
    JSON.stringify([
      "ໂຕະ VVIP ພິເສດໜ້າເວທີ ສຳລັບ 10 ທ່ານ",
      "ຮັບຟຣີຄະແນນໂຫວດສູງເຖິງ +600 Votes",
      "ອາຫານຄ່ຳ ແລະ ເຄື່ອງດື່ມລະດັບພຣີມຽມຄົບຊຸດ",
      "ຂຶ້ນຊື່ຜູ້ສະໜັບສະໜູນເທິງຈໍ LED ຫຼັກຂອງງານ",
    ]),
    "Royal VVIP",
    0,
    4
  );
}

// Seed Schedule if empty
const schedCount = db.prepare("SELECT COUNT(*) as count FROM schedule_items").get();
if (!schedCount || schedCount.count === 0) {
  console.log("Seeding schedule_items table...");
  const insertSched = db.prepare(`
    INSERT INTO schedule_items (order_no, date, time, title, location, status, is_live, is_done, is_finale)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertSched.run(
    1,
    "17 ຕຸລາ 2026",
    "09:00 - 18:00",
    "ເປີດຮັບສະໝັກຢ່າງເປັນທາງການ ນາງສາວເຜົ່າມົ້ງ ນະຄອນຫຼວງວຽງຈັນ 2027 (ຊິງລາງວັນລວມ 500 ກວ່າລ້ານກີບ)",
    "ສວນບັນດາເຜົ່າ / Lao Ethnic Garden • ບ້ານໃໝ່ດ່ານຊີ ເມືອງນາຊາຍທອງ",
    "ສຳເລັດແລ້ວ",
    0,
    1,
    0
  );
  insertSched.run(
    2,
    "24 ຕຸລາ 2026",
    "13:30 - 17:00",
    "ຮອບຄັດເລືອກ 20 ສາວງາມສຸດທ້າຍ (Official 20 Finalists Announcement) HM 01 - HM 20",
    "ຫໍປະຊຸມໃຫຍ່ ສວນບັນດາເຜົ່າ (ສວນພຶກສາ PHEUKSA)",
    "ສຳເລັດແລ້ວ",
    0,
    1,
    0
  );
  insertSched.run(
    3,
    "01 - 24 ພະຈິກ 2026",
    "24 ຊົ່ວໂມງ",
    "ເປີດລະບົບໂຫວດອອນລາຍ ຂວັນໃຈມະຫາຊົນ (Popular Vote Fast Track to Final)",
    "ລະບົບໂຫວດອອນລາຍ • ຮອງຮັບ BCEL OnePay & APB Lao QR (LAPNet)",
    "ກຳລັງດຳເນີນການ",
    1,
    0,
    0
  );
  insertSched.run(
    4,
    "25 ພະຈິກ 2026",
    "18:00 ເປັນຕົ້ນໄປ",
    "ຄ່ຳຄືນຮອບຕັດສິນ GRAND FINALE CROWNING NIGHT • ປະກາດຜົນ Miss Hmong Vientiane 2027",
    "ເວທີກາງແຈ້ງ ສວນບັນດາເຜົ່າ (Lao Ethnic Garden)",
    "ຮອບຕັດສິນ",
    0,
    0,
    1
  );
}

// Seed News if empty
const newsCount = db.prepare("SELECT COUNT(*) as count FROM news_items").get();
if (!newsCount || newsCount.count === 0) {
  console.log("Seeding news_items table...");
  const insertNews = db.prepare(`
    INSERT INTO news_items (order_no, title, date, category, summary, content, images_json, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertNews.run(
    1,
    "ປະທານ ພູວົງ ພະມີສິດ ນຳພາທີມງານກວດກາຄວາມພ້ອມສະຖານທີ່ຈັດງານ ນາງສາວເຜົ່າມົ້ງ 2027",
    "10 ພະຈິກ 2026",
    "ຂ່າວກອງປະກວດ",
    "ປະທານ ຮ້ານຄຳພູວົງ ແລະ ປະທານ ສວນບັນດາເຜົ່າ ພ້ອມຄະນະກຳມະການ ກຽມພ້ອມເວທີແສງສີສຽງລະດັບມາດຕະຖານສາກົນ ແລະ ລາງວັນມູນຄ່າ 500+ ລ້ານກີບ.",
    "ປະທານ ພູວົງ ພະມີສິດ ປະທານກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 ແລະ ປະທານກຸ່ມບໍລິສັດ ຄຳພູວົງ KPV Group ພ້ອມດ້ວຍຄະນະບໍລິຫານ ໄດ້ລົງກວດກາຄວາມຄືບໜ້າການກຽມພ້ອມເວທີຫຼັກ ແລະ ໂຊນຕ້ອນຮັບແຂກ VIP ທີ່ ສວນບັນດາເຜົ່າ.",
    JSON.stringify(["/committee/img3.jpg"]),
    "chairman"
  );

  insertNews.run(
    2,
    "ຄະນະຜູ້ບໍລິຫານກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 ຖ່າຍຮູບຮ່ວມກັນຢ່າງພ້ອມພຽງ",
    "08 ພະຈິກ 2026",
    "ຄະນະບໍລິຫານ",
    "ທ່ານ ນາງ ຄຳຫລ້າ ລໍ່ເບຼຍຢາວ, ທ່ານ ນາງ ລັດສະໝີ ໄຊຍະວົງ, ທ່ານ ບຸນມີ ບົວແກ້ວ ແລະ ທ່ານ ນາງ ຈິນດາ ວົງຄຳສິດ ຮ່ວມປະຊຸມກຳນົດເກນຕັດສິນ.",
    "ຄະນະຜູ້ບໍລິຫານທັງ 4 ທ່ານ ໄດ້ຮ່ວມປະຊຸມໃຫຍ່ເພື່ອວາງແຜນການຝຶກຊ້ອມບຸກຄະລິກກະພາບ ແລະ ກຳນົດເກນການໃຫ້ຄະແນນຂອງຄະນະກຳມະການ.",
    JSON.stringify([
      "/committee/img5.jpg",
      "/committee/img1.jpg",
      "/committee/img2.jpg",
      "/committee/img4.jpg",
    ]),
    "committee"
  );

  insertNews.run(
    3,
    "ເປີດຕົວຮູບຊຸດມົ້ງດັ້ງເດີມ ແລະ ຊຸດປະດັບຄຳ ຮ້ານຄຳພູວົງ ສາວງາມທັງ 20 ໝາຍເລກ",
    "05 ພະຈິກ 2026",
    "ໂປຣໄຟລ໌ສາວງາມ",
    "ຊົມຄວາມງົດງາມຂອງສາວງາມທັງ 20 ໝາຍເລກ ໃນຊຸດມົ້ງດັ້ງເດີມ Royal Purple ແລະ ຊຸດປະດັບຄຳພູວົງ Phouvong Gold Jewelry.",
    "ກອງປະກວດໄດ້ເຜີຍແຜ່ຊຸດຮູບຖ່າຍທາງການຂອງຜູ້ເຂົ້າປະກວດທັງ 20 ໝາຍເລກ ເພື່ອໃຫ້ແຟນໆໄດ້ເລີ່ມສົ່ງແຮງໃຈ ແລະ ໂຫວດຄະແນນຂວັນໃຈມະຫາຊົນ.",
    JSON.stringify(["/contestants/traditional_hm01.jpg"]),
    "photoshoot"
  );
}

// Seed Sponsors if empty
const sponCount = db.prepare("SELECT COUNT(*) as count FROM sponsors").get();
if (!sponCount || sponCount.count === 0) {
  console.log("Seeding sponsors table...");
  const insertSpon = db.prepare(`
    INSERT INTO sponsors (tier, name, role, order_no)
    VALUES (?, ?, ?, ?)
  `);

  insertSpon.run("DIAMOND", "ຮ້ານຄຳພູວົງ (Phouvong Jewelry)", "ສະໜັບສະໜູນມົງກຸດ & ລາງວັນຫຼັກ 500+ ລ້ານກີບ", 1);
  insertSpon.run("DIAMOND", "ໂຄງການ ສວນບັນດາເຜົ່າ (Lao Ethnic Garden)", "ສະຖານທີ່ຈັດງານ & ເຈົ້າພາບຫຼັກ", 2);
  insertSpon.run("DIAMOND", "ກຸ່ມບໍລິສັດ ຄຳພູວົງ (KPV Group)", "ຜູ້ສະໜັບສະໜູນຫຼັກຢ່າງເປັນທາງການ", 3);
  insertSpon.run("DIAMOND", "PHEUKSA GARDEN (ສວນພຶກສາ)", "ສື່ປະຊາສຳພັນຫຼັກ (ຜູ້ຕິດຕາມ 63,000+)", 4);

  insertSpon.run("PLATINUM", "StarYang CU Photography", "ຊ່າງພາບທາງການກອງປະກວດ", 5);
  insertSpon.run("PLATINUM", "Lao Ethnic Garden Resort", "ທີ່ພັກ & ສະຖານທີ່ເກັບໂຕສາວງາມ", 6);
  insertSpon.run("PLATINUM", "BCEL OnePay / APB Lao QR", "ລະບົບຊຳລະເງິນໂຫວດອອນລາຍ", 7);
  insertSpon.run("PLATINUM", "Miss Hmong Organization", "ທີ່ປຶກສາວັດທະນະທຳຊົນເຜົ່າມົ້ງ", 8);

  insertSpon.run("GOLD", "ສະມາຄົມຊາວໜຸ່ມບັນດາເຜົ່າ", "ເຄືອຂ່າຍເຍົາວະຊົນ", 9);
  insertSpon.run("GOLD", "ສື່ໂທລະພາບ & ອອນລາຍ ນະຄອນຫຼວງ", "ຖ່າຍທອດສົດຮອບຕັດສິນ", 10);
  insertSpon.run("GOLD", "ທີມຊ່າງແຕ່ງໜ້າ-ເຮັດຜົມ ມືອາຊີບ", "Stylist & Beauty Team", 11);
  insertSpon.run("GOLD", "ຮ້ານອາຫານ ສວນບັນດາເຜົ່າ", "ອາຫານ & ເຄື່ອງດື່ມຕ້ອນຮັບ", 12);
}

// Seed additional settings
const insertSetting = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
insertSetting.run("venue_name", "ສວນບັນດາເຜົ່າ / Lao Ethnic Garden (ສວນພຶກສາ • PHEUKSA)");
insertSetting.run("venue_address", "ບ້ານໃໝ່ດ່ານຊີ, ເມືອງນາຊາຍທອງ, ນະຄອນຫຼວງວຽງຈັນ (ເສັ້ນທາງເລກທີ 13 ເໜືອ)");
insertSetting.run("venue_phones", "020 9689 9684, +856 20 96 899 684");
insertSetting.run("venue_email", "info@pheuksagarden.com");
insertSetting.run("venue_facebook", "https://www.facebook.com/PHEUKSA");
insertSetting.run("venue_facebook_photos", "https://www.facebook.com/PHEUKSA/photos");
insertSetting.run("venue_website", "http://www.pheuksagarden.com");
insertSetting.run("countdown_date", "2026-11-25T18:00:00");
insertSetting.run("hero_subtitle", "ຊິງຕຳແໜ່ງ ແລະ ເງິນລາງວັນລວມມູນຄ່າ 500 ກວ່າລ້ານກີບ • ຮ່ວມໂຫວດຂວັນໃຈມະຫາຊົນໃຫ້ສາວງາມທັງ 20 ໝາຍເລກ (HM 01 - HM 20)");
insertSetting.run("liveticker_text", "ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • ຊິງລາງວັນລວມ 500+ ລ້ານກີບ");

console.log("Migration completed successfully!");
