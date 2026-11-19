import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

function getDbPath() {
  const isServerless = Boolean(
    process.env.NETLIFY ||
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT
  );
  if (isServerless) {
    const tmpPath = path.join("/tmp", "miss-hmong.sqlite");
    const localSeed = path.join(process.cwd(), "miss-hmong.sqlite");
    if (!fs.existsSync(tmpPath) && fs.existsSync(localSeed)) {
      try {
        fs.copyFileSync(localSeed, tmpPath);
      } catch (err) {
        console.warn("Could not copy seed DB to /tmp:", err);
      }
    }
    return fs.existsSync(tmpPath) ? tmpPath : ":memory:";
  }
  return path.join(process.cwd(), "miss-hmong.sqlite");
}

let dbInstance = null;

export function getDb() {
  if (!dbInstance) {
    try {
      const dbPath = getDbPath();
      dbInstance = new DatabaseSync(dbPath);
      initSchema(dbInstance);
    } catch (err) {
      console.warn("Falling back to in-memory SQLite:", err);
      try {
        dbInstance = new DatabaseSync(":memory:");
        initSchema(dbInstance);
      } catch (memErr) {
        console.error("Critical: Failed to initialize in-memory SQLite:", memErr);
      }
    }
  }
  return dbInstance;
}

export const EIGHT_PACKAGES = [
  { name: "Single Vote (1 Vote)", points: 1, price_lak: 10000, badge: "ເລີ່ມຕົ້ນ" },
  { name: "Popular Pack (5 Votes)", points: 5, price_lak: 50000, badge: "ນິຍົມ" },
  { name: "Mega Pack (20 Votes)", points: 20, price_lak: 200000, badge: "ຂາຍດີສຸດ" },
  { name: "VIP Pack (50 Votes)", points: 50, price_lak: 500000, badge: "VIP" },
  { name: "Super Crown (100 Votes)", points: 100, price_lak: 1000000, badge: "Super VIP" },
  { name: "Diamond Pack (200 Votes)", points: 200, price_lak: 2000000, badge: "Diamond" },
  { name: "Crown Ambassador (500 Votes)", points: 500, price_lak: 5000000, badge: "Crown VIP" },
  { name: "Royal Grand Sponsor (1,000 Votes)", points: 1000, price_lak: 10000000, badge: "Royal VIP" },
];

export const OFFICIAL_CONTESTANTS = [
  {
    code: "HM 01",
    name: "ນາງ ປ່າຍົງ ວື່",
    nickname: "ປ່າຍົງ",
    age: 20,
    province: "ນະຄອນຫຼວງວຽງຈັນ",
    ethnic_group: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)",
    height: 168,
    bio: "ຜູ້ເຂົ້າປະກວດໝາຍເລກ HM 01 ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • ສວນບັນດາເຜົ່າ",
    image_url: "",
    traditional_image_url: "/contestants/traditional_hm01.jpg",
    total_votes: 0,
    hearts: 0,
  },
  {
    code: "HM 02",
    name: "ນາງ ໄມ່ເຈ່ຍຊົ່ງ ດົງນານະວົງ",
    nickname: "ໄມ່ເຈ່ຍຊົ່ງ",
    age: 20,
    province: "ນະຄອນຫຼວງວຽງຈັນ",
    ethnic_group: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)",
    height: 169,
    bio: "ຜູ້ເຂົ້າປະກວດໝາຍເລກ HM 02 ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • ສວນບັນດາເຜົ່າ",
    image_url: "",
    traditional_image_url: "/contestants/traditional_hm02.jpg",
    total_votes: 0,
    hearts: 0,
  },
  {
    code: "HM 03",
    name: "ນາງ ຮົວຊຽນ ຕົ່ງຢ່າງ",
    nickname: "ຮົວຊຽນ",
    age: 19,
    province: "ນະຄອນຫຼວງວຽງຈັນ",
    ethnic_group: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)",
    height: 167,
    bio: "ຜູ້ເຂົ້າປະກວດໝາຍເລກ HM 03 ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • ສວນບັນດາເຜົ່າ",
    image_url: "",
    traditional_image_url: "/contestants/traditional_hm03.jpg",
    total_votes: 0,
    hearts: 0,
  },
  {
    code: "HM 04",
    name: "ນາງ ຈີ່ ລີ",
    nickname: "ຈີ່",
    age: 20,
    province: "ນະຄອນຫຼວງວຽງຈັນ",
    ethnic_group: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)",
    height: 168,
    bio: "ຜູ້ເຂົ້າປະກວດໝາຍເລກ HM 04 ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • ສວນບັນດາເຜົ່າ",
    image_url: "",
    traditional_image_url: "/contestants/traditional_hm04.jpg",
    total_votes: 0,
    hearts: 0,
  },
  {
    code: "HM 05",
    name: "ນາງ ປ່າເຊັຍ ທໍ",
    nickname: "ປ່າເຊັຍ",
    age: 20,
    province: "ນະຄອນຫຼວງວຽງຈັນ",
    ethnic_group: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)",
    height: 169,
    bio: "ຜູ້ເຂົ້າປະກວດໝາຍເລກ HM 05 ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • ສວນບັນດາເຜົ່າ",
    image_url: "",
    traditional_image_url: "/contestants/traditional_hm05.jpg",
    total_votes: 0,
    hearts: 0,
  },
  {
    code: "HM 06",
    name: "ນາງ ກ່າເລ່ຍ ຊົງ",
    nickname: "ກ່າເລ່ຍ",
    age: 20,
    province: "ນະຄອນຫຼວງວຽງຈັນ",
    ethnic_group: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)",
    height: 168,
    bio: "ຜູ້ເຂົ້າປະກວດໝາຍເລກ HM 06 ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • ສວນບັນດາເຜົ່າ",
    image_url: "/contestants/hm06.jpg",
    traditional_image_url: "/contestants/traditional_hm06.jpg",
    total_votes: 0,
    hearts: 0,
  },
  {
    code: "HM 07",
    name: "ນາງ ສະຫວັດດີຢ່າງ ຍົງກາຍ",
    nickname: "ສະຫວັດດີຢ່າງ",
    age: 20,
    province: "ນະຄອນຫຼວງວຽງຈັນ",
    ethnic_group: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)",
    height: 167,
    bio: "ຜູ້ເຂົ້າປະກວດໝາຍເລກ HM 07 ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • ສວນບັນດາເຜົ່າ",
    image_url: "/contestants/hm07.jpg",
    traditional_image_url: "/contestants/traditional_hm07.jpg",
    total_votes: 0,
    hearts: 0,
  },
  {
    code: "HM 08",
    name: "ນາງ ຍົງເລົ່າ ໜໍເຢຍ",
    nickname: "ຍົງເລົ່າ",
    age: 19,
    province: "ນະຄອນຫຼວງວຽງຈັນ",
    ethnic_group: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)",
    height: 168,
    bio: "ຜູ້ເຂົ້າປະກວດໝາຍເລກ HM 08 ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • ສວນບັນດາເຜົ່າ",
    image_url: "/contestants/hm08.jpg",
    traditional_image_url: "/contestants/traditional_hm08.jpg",
    total_votes: 0,
    hearts: 0,
  },
  {
    code: "HM 09",
    name: "ນາງ ໄມຕາ ເລົ່າ",
    nickname: "ໄມຕາ",
    age: 20,
    province: "ນະຄອນຫຼວງວຽງຈັນ",
    ethnic_group: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)",
    height: 169,
    bio: "ຜູ້ເຂົ້າປະກວດໝາຍເລກ HM 09 ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • ສວນບັນດາເຜົ່າ",
    image_url: "/contestants/hm09.jpg",
    traditional_image_url: "/contestants/traditional_hm09.jpg",
    total_votes: 0,
    hearts: 0,
  },
  {
    code: "HM 10",
    name: "ນາງ ອາລີ ຢ່າງ",
    nickname: "ອາລີ",
    age: 19,
    province: "ນະຄອນຫຼວງວຽງຈັນ",
    ethnic_group: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)",
    height: 167,
    bio: "ຜູ້ເຂົ້າປະກວດໝາຍເລກ HM 10 ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • ສວນບັນດາເຜົ່າ",
    image_url: "/contestants/hm10.jpg",
    traditional_image_url: "/contestants/traditional_hm10.jpg",
    total_votes: 0,
    hearts: 0,
  },
  {
    code: "HM 11",
    name: "ນາງ ປ່າເຢ່ຍນໍວ ໄຊເຕັງ",
    nickname: "ປ່າເຢ່ຍນໍວ",
    age: 21,
    province: "ນະຄອນຫຼວງວຽງຈັນ",
    ethnic_group: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)",
    height: 170,
    bio: "ຜູ້ເຂົ້າປະກວດໝາຍເລກ HM 11 ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • ສວນບັນດາເຜົ່າ",
    image_url: "/contestants/hm11.jpg",
    traditional_image_url: "/contestants/traditional_hm11.jpg",
    total_votes: 0,
    hearts: 0,
  },
  {
    code: "HM 12",
    name: "ນາງ ວັນນີ ຈ່າຊົວດາ",
    nickname: "ວັນນີ",
    age: 20,
    province: "ນະຄອນຫຼວງວຽງຈັນ",
    ethnic_group: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)",
    height: 169,
    bio: "ຜູ້ເຂົ້າປະກວດໝາຍເລກ HM 12 ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • ສວນບັນດາເຜົ່າ",
    image_url: "/contestants/hm12.jpg",
    traditional_image_url: "/contestants/traditional_hm12.jpg",
    total_votes: 0,
    hearts: 0,
  },
  {
    code: "HM 13",
    name: "ນາງ ຫຼ້າ ຊົ່ງ",
    nickname: "ຫຼ້າ",
    age: 20,
    province: "ນະຄອນຫຼວງວຽງຈັນ",
    ethnic_group: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)",
    height: 168,
    bio: "ຜູ້ເຂົ້າປະກວດໝາຍເລກ HM 13 ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • ສວນບັນດາເຜົ່າ",
    image_url: "/contestants/hm13.jpg",
    traditional_image_url: "/contestants/traditional_hm13.jpg",
    total_votes: 0,
    hearts: 0,
  },
  {
    code: "HM 14",
    name: "ນາງ ມານຸນາ ຢ່າງ",
    nickname: "ມານຸນາ",
    age: 21,
    province: "ນະຄອນຫຼວງວຽງຈັນ",
    ethnic_group: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)",
    height: 170,
    bio: "ຜູ້ເຂົ້າປະກວດໝາຍເລກ HM 14 ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • ສວນບັນດາເຜົ່າ",
    image_url: "/contestants/hm14.jpg",
    traditional_image_url: "/contestants/traditional_hm14.jpg",
    total_votes: 0,
    hearts: 0,
  },
  {
    code: "HM 15",
    name: "ນາງ ຢົວປ່າ ເຮີ່",
    nickname: "ຢົວປ່າ",
    age: 20,
    province: "ນະຄອນຫຼວງວຽງຈັນ",
    ethnic_group: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)",
    height: 168,
    bio: "ຜູ້ເຂົ້າປະກວດໝາຍເລກ HM 15 ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • ສວນບັນດາເຜົ່າ",
    image_url: "/contestants/hm15.jpg",
    traditional_image_url: "/contestants/traditional_hm15.jpg",
    total_votes: 0,
    hearts: 0,
  },
  {
    code: "HM 16",
    name: "ນາງ ລູຈີນິຈ່າ ດວງມະນີ",
    nickname: "ລູຈີນິຈ່າ",
    age: 20,
    province: "ນະຄອນຫຼວງວຽງຈັນ",
    ethnic_group: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)",
    height: 169,
    bio: "ຜູ້ເຂົ້າປະກວດໝາຍເລກ HM 16 ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • ສວນບັນດາເຜົ່າ",
    image_url: "/contestants/hm16.jpg",
    traditional_image_url: "/contestants/traditional_hm16.jpg",
    total_votes: 0,
    hearts: 0,
  },
  {
    code: "HM 17",
    name: "ນາງ ປ່າຈົ່ວ ຊົ່ງ",
    nickname: "ປ່າຈົ່ວ",
    age: 19,
    province: "ນະຄອນຫຼວງວຽງຈັນ",
    ethnic_group: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)",
    height: 167,
    bio: "ຜູ້ເຂົ້າປະກວດໝາຍເລກ HM 17 ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • ສວນບັນດາເຜົ່າ",
    image_url: "/contestants/hm17.jpg",
    traditional_image_url: "/contestants/traditional_hm17.jpg",
    total_votes: 0,
    hearts: 0,
  },
  {
    code: "HM 18",
    name: "ນາງ ເອ້ຍຊົ່ງ ໄຊກໍ",
    nickname: "ເອ້ຍຊົ່ງ",
    age: 20,
    province: "ນະຄອນຫຼວງວຽງຈັນ",
    ethnic_group: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)",
    height: 169,
    bio: "ຜູ້ເຂົ້າປະກວດໝາຍເລກ HM 18 ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • ສວນບັນດາເຜົ່າ",
    image_url: "/contestants/hm18.jpg",
    traditional_image_url: "/contestants/traditional_hm18.jpg",
    total_votes: 0,
    hearts: 0,
  },
  {
    code: "HM 19",
    name: "ນາງ ຢ່າຢົວ ຢ່າງ",
    nickname: "ຢ່າຢົວ",
    age: 20,
    province: "ນະຄອນຫຼວງວຽງຈັນ",
    ethnic_group: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)",
    height: 168,
    bio: "ຜູ້ເຂົ້າປະກວດໝາຍເລກ HM 19 ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • ສວນບັນດາເຜົ່າ",
    image_url: "/contestants/hm19.jpg",
    traditional_image_url: "/contestants/traditional_hm19.jpg",
    total_votes: 0,
    hearts: 0,
  },
  {
    code: "HM 20",
    name: "ນາງ ວັນ ຄ້າ",
    nickname: "ວັນ",
    age: 20,
    province: "ນະຄອນຫຼວງວຽງຈັນ",
    ethnic_group: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)",
    height: 170,
    bio: "ຜູ້ເຂົ້າປະກວດໝາຍເລກ HM 20 ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 • ສວນບັນດາເຜົ່າ",
    image_url: "/contestants/hm20.jpg",
    traditional_image_url: "/contestants/traditional_hm20.jpg",
    total_votes: 0,
    hearts: 0,
  },
];

function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS contestants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      nickname TEXT NOT NULL,
      age INTEGER NOT NULL DEFAULT 19,
      province TEXT NOT NULL,
      ethnic_group TEXT NOT NULL DEFAULT 'ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ (MHVT)',
      height INTEGER NOT NULL DEFAULT 165,
      bio TEXT NOT NULL,
      image_url TEXT NOT NULL,
      traditional_image_url TEXT NOT NULL DEFAULT '',
      total_votes INTEGER NOT NULL DEFAULT 0,
      hearts INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS vote_packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      points INTEGER NOT NULL,
      price_lak INTEGER NOT NULL,
      badge TEXT NOT NULL DEFAULT ''
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS vote_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contestant_id INTEGER NOT NULL,
      package_id INTEGER NOT NULL,
      voter_name TEXT NOT NULL,
      voter_phone TEXT NOT NULL DEFAULT '',
      cheer_message TEXT NOT NULL DEFAULT '',
      points_added INTEGER NOT NULL,
      amount_lak INTEGER NOT NULL,
      payment_ref TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'APPROVED',
      created_at TEXT NOT NULL,
      FOREIGN KEY (contestant_id) REFERENCES contestants(id),
      FOREIGN KEY (package_id) REFERENCES vote_packages(id)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

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

  db.exec(`
        CREATE TABLE IF NOT EXISTS past_queens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year TEXT NOT NULL,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      image_url TEXT NOT NULL DEFAULT '',
      bio TEXT NOT NULL DEFAULT '',
      badge TEXT NOT NULL DEFAULT '',
      order_no INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sponsors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tier TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT '',
      order_no INTEGER NOT NULL DEFAULT 1
    );
  `);

  try {
    db.exec("ALTER TABLE contestants ADD COLUMN ethnic_group TEXT NOT NULL DEFAULT 'ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)'");
  } catch {}
  try {
    db.exec("ALTER TABLE contestants ADD COLUMN traditional_image_url TEXT NOT NULL DEFAULT ''");
  } catch {}
  try {
    db.exec("ALTER TABLE contestants ADD COLUMN hearts INTEGER NOT NULL DEFAULT 0");
  } catch {}
  try {
    db.exec("ALTER TABLE vote_transactions ADD COLUMN cheer_message TEXT NOT NULL DEFAULT ''");
  } catch {}
  try {
    db.exec("ALTER TABLE vote_transactions ADD COLUMN slip_image_url TEXT NOT NULL DEFAULT ''");
  } catch {}

  const countRow = db.prepare("SELECT COUNT(*) as count FROM contestants").get();
  if (!countRow || countRow.count === 0) {
    seedInitialData(db);
  } else {
    upgradeExistingBranding(db);
  }
  seedFrontendSections(db);
}

function upgradeExistingBranding(db) {
  const pkgCount = db.prepare("SELECT COUNT(*) as count FROM vote_packages").get();
  if (!pkgCount || pkgCount.count < 8) {
    db.exec("DELETE FROM vote_packages;");
    const insertPkg = db.prepare(
      "INSERT INTO vote_packages (name, points, price_lak, badge) VALUES (?, ?, ?, ?)"
    );
    for (const p of EIGHT_PACKAGES) {
      insertPkg.run(p.name, p.points, p.price_lak, p.badge);
    }
  } else {
    const updateBadge = db.prepare("UPDATE vote_packages SET badge = ? WHERE points = ?");
    for (const p of EIGHT_PACKAGES) {
      updateBadge.run(p.badge, p.points);
    }
  }

  const hasOfficial = db
    .prepare("SELECT COUNT(*) as count FROM contestants WHERE code = 'HM 06'")
    .get();
  if (!hasOfficial || hasOfficial.count === 0) {
    db.exec("DELETE FROM vote_transactions;");
    db.exec("DELETE FROM contestants;");
    seedContestantsAndTransactions(db);
  } else {
    const insertOrIgnore = db.prepare(`
      INSERT OR IGNORE INTO contestants (code, name, nickname, age, province, ethnic_group, height, bio, image_url, traditional_image_url, total_votes, hearts, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);
    const updateMeta = db.prepare(`
      UPDATE contestants
      SET name = ?, nickname = ?, ethnic_group = ?, bio = ?, image_url = ?, traditional_image_url = ?
      WHERE code = ?
    `);
    for (const c of OFFICIAL_CONTESTANTS) {
      insertOrIgnore.run(
        c.code,
        c.name,
        c.nickname,
        c.age,
        c.province,
        c.ethnic_group,
        c.height,
        c.bio,
        c.image_url,
        c.traditional_image_url || c.image_url,
        c.total_votes,
        c.hearts
      );
      updateMeta.run(
        c.name,
        c.nickname,
        c.ethnic_group,
        c.bio,
        c.image_url,
        c.traditional_image_url || c.image_url,
        c.code
      );
    }
  }
}

function seedContestantsAndTransactions(db) {
  const insertContestant = db.prepare(`
    INSERT INTO contestants (code, name, nickname, age, province, ethnic_group, height, bio, image_url, traditional_image_url, total_votes, hearts, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  for (const c of OFFICIAL_CONTESTANTS) {
    insertContestant.run(
      c.code,
      c.name,
      c.nickname,
      c.age,
      c.province,
      c.ethnic_group,
      c.height,
      c.bio,
      c.image_url,
      c.traditional_image_url || c.image_url,
      c.total_votes,
      c.hearts
    );
  }

  const rows = db.prepare("SELECT id, code FROM contestants").all();
  const idByCode = {};
  for (const r of rows) {
    idByCode[r.code] = r.id;
  }

  const insertTx = db.prepare(`
    INSERT INTO vote_transactions
    (contestant_id, package_id, voter_name, voter_phone, cheer_message, points_added, amount_lak, payment_ref, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertTx.run(
    idByCode["HM 12"] || 1,
    6,
    "ທ້າວ ຕູ່ ວ່າງ",
    "020 5512 3456",
    "ສົ່ງແຮງໃຈເຊຍ HM 12 ນາງ ວັນນີ ຈ່າຊົວດາ ສຸດໃຈ!",
    200,
    1000000,
    "BCEL-982341",
    "APPROVED",
    "2026-11-15 17:40:00"
  );
  insertTx.run(
    idByCode["HM 16"] || 1,
    5,
    "ນາງ ໄໝ ຊົ່ງ",
    "020 9988 1122",
    "ງາມຫຼາຍ HM 16 ນາງ ລູຈີນິຈ່າ ດວງມະນີ ສົມກັບເວທີສວນບັນດາເຜົ່າ",
    100,
    600000,
    "BCEL-982399",
    "APPROVED",
    "2026-11-15 17:55:00"
  );
  insertTx.run(
    idByCode["HM 09"] || 1,
    4,
    "ທີມເຊຍ ນະຄອນຫຼວງ",
    "020 2233 4455",
    "ໂຫວດເຊຍ HM 09 ນາງ ໄມຕາ ເລົ່າ ເຕັມທີ່ເລີຍ!",
    50,
    350000,
    "BCEL-982410",
    "APPROVED",
    "2026-11-15 18:05:00"
  );
  insertTx.run(
    idByCode["HM 20"] || 1,
    4,
    "ສະມາຄົມຊາວໜຸ່ມ",
    "020 5999 8888",
    "ຮ່ວມສົ່ງຄະແນນຂວັນໃຈມະຫາຊົນໃຫ້ HM 20 ນາງ ວັນ ຄ້າ",
    50,
    350000,
    "BCEL-982501",
    "PENDING",
    "2026-11-15 18:15:00"
  );
  insertTx.run(
    idByCode["HM 06"] || 1,
    3,
    "ເອື້ອຍ ນ້ອຍ ວຽງຈັນ",
    "020 7766 5544",
    "ເປັນກຳລັງໃຈໃຫ້ HM 06 ນາງ ກ່າເລ່ຍ ຊົງ ເດີ້",
    20,
    150000,
    "BCEL-982519",
    "PENDING",
    "2026-11-15 18:18:00"
  );
}

function seedInitialData(db) {
  const insertSetting = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
  insertSetting.run("voting_open", "true");
  insertSetting.run("auto_approve", "false");
  insertSetting.run("event_title", "Miss Hmong Vientiane (MHVT) • ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ");
  insertSetting.run("bank_info", "BCEL OnePay & APB Lao QR (LAPNet) • ໂຄງການ ສວນບັນດາເຜົ່າ");

  const insertPkg = db.prepare(
    "INSERT INTO vote_packages (name, points, price_lak, badge) VALUES (?, ?, ?, ?)"
  );
  for (const p of EIGHT_PACKAGES) {
    insertPkg.run(p.name, p.points, p.price_lak, p.badge);
  }

  seedContestantsAndTransactions(db);
}

function seedFrontendSections(db) {
  // Settings defaults
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

  // Committee
  const comCount = db.prepare("SELECT COUNT(*) as count FROM committee").get();
  if (!comCount || comCount.count === 0) {
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

  // Tickets
  const tickCount = db.prepare("SELECT COUNT(*) as count FROM ticket_tiers").get();
  if (!tickCount || tickCount.count === 0) {
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
      JSON.stringify(["ບັດເຂົ້າຊົມງານຮອບຕັດສິນ 1 ທ່ານ", "ຮັບຟຣີຄະແນນໂຫວດ +2 Votes"]),
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
      JSON.stringify(["ບ່ອນນັ່ງໂຊນ Gold ມຸມມອງຊັດເຈນ", "ຮັບຟຣີຄະແນນໂຫວດ +15 Votes ທັນທີ", "ຮັບເຄື່ອງດື່ມ Welcome Drink 1 ຊຸດ"]),
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
      JSON.stringify(["ບ່ອນນັ່ງ VIP ແຖວໜ້າສຸດໃກ້ຊິດສາວງາມ", "ຮັບຟຣີຄະແນນໂຫວດ +40 Votes", "ສິດຖ່າຍຮູບຮ່ວມກັບຜູ້ຊະນະຫຼັງຈົບງານ", "ຊຸດຂອງທີ່ລະລຶກ ສວນບັນດາເຜົ່າ Limited"]),
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
      JSON.stringify(["ໂຕະ VVIP ພິເສດໜ້າເວທີ ສຳລັບ 10 ທ່ານ", "ຮັບຟຣີຄະແນນໂຫວດສູງເຖິງ +600 Votes", "ອາຫານຄ່ຳ ແລະ ເຄື່ອງດື່ມລະດັບພຣີມຽມຄົບຊຸດ", "ຂຶ້ນຊື່ຜູ້ສະໜັບສະໜູນເທິງຈໍ LED ຫຼັກຂອງງານ"]),
      "Royal VVIP",
      0,
      4
    );
  }

  // Schedule
  const schedCount = db.prepare("SELECT COUNT(*) as count FROM schedule_items").get();
  if (!schedCount || schedCount.count === 0) {
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

  // News
  const newsCount = db.prepare("SELECT COUNT(*) as count FROM news_items").get();
  if (!newsCount || newsCount.count === 0) {
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
      JSON.stringify(["/committee/img5.jpg", "/committee/img1.jpg", "/committee/img2.jpg", "/committee/img4.jpg"]),
      "committee"
    );
    insertNews.run(
      3,
      "ພາບບັນຍາກາດກິດຈະກຳເກັບໂຕ ມື້ທີ 1 & ມື້ທີ 2 ທີ່ ສວນບັນດາເຜົ່າ / Lao Ethnic Garden",
      "15 ພະຈິກ 2026",
      "ກິດຈະກຳເກັບໂຕ",
      "ຊ້ອມຍ່າງ, ຮຽນບຸກຄະລິກກະພາບ, ມາລະຍາດ, ການເວົ້າ, ການນົບ, ການໂພສຢູ່ເວທີ ແລະ ຖ່າຍຮູບກຸ່ມ 1–4 • ຊ່າງພາບ: StarYang CU",
      "ນ້ອງໆຜູ້ເຂົ້າປະກວດ ນາງສາວເຜົ່າມົ້ງ ນະຄອນຫຼວງວຽງຈັນ Miss Hmong Vientiane 2027 ທັງ 20 ໝາຍເລກ (HM 01 - HM 20) ໄດ້ເຂົ້າຮ່ວມກິດຈະກຳເກັບໂຕຢ່າງເປັນທາງການ ມື້ທີ 1 ແລະ ມື້ທີ 2 ທີ່ ສວນບັນດາເຜົ່າ (Lao Ethnic Garden), ບ້ານໃໝ່ດ່ານຊີ ເມືອງນາຊາຍທອງ ນະຄອນຫຼວງວຽງຈັນ.",
      JSON.stringify([
        "/activities/act1.jpg",
        "/activities/act2.jpg",
        "/activities/act3.jpg",
        "/activities/act4.jpg",
        "/activities/act5.jpg",
        "/activities/act6.jpg"
      ]),
      "gallery"
    );
    insertNews.run(
      4,
      "ເປີດຕົວຮູບຊຸດມົ້ງດັ້ງເດີມ ແລະ ຊຸດປະດັບຄຳ ຮ້ານຄຳພູວົງ ສາວງາມທັງ 20 ໝາຍເລກ",
      "05 ພະຈິກ 2026",
      "ໂປຣໄຟລ໌ສາວງາມ",
      "ຊົມຄວາມງົດງາມຂອງສາວງາມທັງ 20 ໝາຍເລກ ໃນຊຸດມົ້ງດັ້ງເດີມ Royal Purple ແລະ ຊຸດປະດັບຄຳພູວົງ Phouvong Gold Jewelry.",
      "ກອງປະກວດໄດ້ເຜີຍແຜ່ຊຸດຮູບຖ່າຍທາງການຂອງຜູ້ເຂົ້າປະກວດທັງ 20 ໝາຍເລກ ເພື່ອໃຫ້ແຟນໆໄດ້ເລີ່ມສົ່ງແຮງໃຈ ແລະ ໂຫວດຄະແນນຂວັນໃຈມະຫາຊົນ.",
      JSON.stringify(["/contestants/traditional_hm01.jpg"]),
      "photoshoot"
    );
  }

  // Past Queens (Hall of Fame)
  const queenCount = db.prepare("SELECT COUNT(*) as count FROM past_queens").get();
  if (!queenCount || queenCount.count === 0) {
    const insertQueen = db.prepare(`
      INSERT INTO past_queens (year, name, title, image_url, bio, badge, order_no)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const PAST_QUEENS_SEED = [
      {
        year: "2019",
        name: "ທ່ານ ນາງ ສີສຸດາ ຢູວາເຢັຍປ່າວ",
        title: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫລວງວຽງຈັນ 2019",
        badge: "Miss Hmong 2019",
        image_url: "/api/avatar?code=2019&bg=gold&name=%E0%BA%AA%E0%BA%B5%E0%BA%AA%E0%BA%BB%E0%BA%94%E0%BA%B2",
        bio: "ເຈົ້າຂອງມົງກຸດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ ຄົນທຳອິດແຫ່ງປະຫວັດສາດ (2019)",
        order_no: 1,
      },
      {
        year: "2020",
        name: "ທ່ານ ນາງ ປ່າເຢັ່ງຊາ ລໍ່",
        title: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫລວງວຽງຈັນ 2020",
        badge: "Miss Universe Laos 2022 • Top 16 MU",
        image_url: "/api/avatar?code=2020&bg=purple&name=%E0%BA%9B%E0%BA%B8%E0%BB%88%E0%BA%B2%E0%BB%80%E0%BA%8D%E0%BA%B1%E0%BB%88%E0%BA%87%E0%BA%8A%E0%BA%B2",
        bio: "ເຈົ້າຂອງມົງກຸດ 2020 ແລະ ຜູ້ສ້າງປະຫວັດສາດໃຫ້ປະເທດລາວ ເຂົ້າຮອບ Top 16 Miss Universe 2022",
        order_no: 2,
      },
      {
        year: "2021",
        name: "ທ່ານ ນາງ ໜີເລົ່າ ຈື່ເສັງ",
        title: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫລວງວຽງຈັນ 2021",
        badge: "Miss Hmong 2021",
        image_url: "/api/avatar?code=2021&bg=garden&name=%E0%BA%AB%E0%BA%99%E0%BA%B5%E0%BB%80%E0%BA%A5%E0%BA%BB%E0%BB%88%E0%BA%B2",
        bio: "ເຈົ້າຂອງມົງກຸດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ ປະຈຳປີ 2021",
        order_no: 3,
      },
      {
        year: "2023",
        name: "ທ່ານ ນາງ ກັນນິກາ ໄຊນາລໍ່",
        title: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫລວງວຽງຈັນ 2023",
        badge: "Miss Hmong 2023",
        image_url: "/api/avatar?code=2023&bg=gold&name=%E0%BA%81%E0%BA%B1%E0%BA%99%E0%BA%99%E0%BA%B4%E0%BA%81%E0%BA%B2",
        bio: "ເຈົ້າຂອງມົງກຸດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ ປະຈຳປີ 2023",
        order_no: 4,
      },
      {
        year: "2024",
        name: "ທ່ານ ນາງ ປ່າເຍ່ຍ ຊົ່ງ",
        title: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫລວງວຽງຈັນ 2024",
        badge: "Miss Hmong 2024",
        image_url: "/api/avatar?code=2024&bg=purple&name=%E0%BA%9B%E0%BA%B8%E0%BB%88%E0%BA%B2%E0%BB%80%E0%BA%8D%E0%BA%B7%E0%BB%88%E0%BA%8D",
        bio: "ເຈົ້າຂອງມົງກຸດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ ປະຈຳປີ 2024",
        order_no: 5,
      },
      {
        year: "2025",
        name: "ທ່ານ ນາງ ປີຍະດາ ຊົ່ງຕົງນາມມະວົງ",
        title: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫລວງວຽງຈັນ 2025",
        badge: "Miss Hmong 2025",
        image_url: "/api/avatar?code=2025&bg=garden&name=%E0%BA%9B%E0%BA%B5%E0%BA%A2%E0%BA%B0%E0%BA%94%E0%BA%B2",
        bio: "ເຈົ້າຂອງມົງກຸດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ ປະຈຳປີ 2025",
        order_no: 6,
      },
      {
        year: "2026",
        name: "ທ່ານ ນາງ ເກ້ຍ ເຮີ່",
        title: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫລວງວຽງຈັນ 2026",
        badge: "Reigning Queen • ຜູ້ສົ່ງມອບມົງກຸດ",
        image_url: "/api/avatar?code=2026&bg=gold&name=%E0%BB%80%E0%BA%81%E0%BB%89%E0%BA%A2",
        bio: "Reigning Queen ເຈົ້າຂອງມົງກຸດປີຫຼ້າສຸດ 2026 ຜູ້ກຽມສົ່ງມອບມົງກຸດໃຫ້ແກ່ Miss Hmong Vientiane 2027!",
        order_no: 7,
      },
    ];
    for (const q of PAST_QUEENS_SEED) {
      insertQueen.run(q.year, q.name, q.title, q.image_url, q.bio, q.badge, q.order_no);
    }
  }

  // Sponsors
  const sponCount = db.prepare("SELECT COUNT(*) as count FROM sponsors").get();
  if (!sponCount || sponCount.count === 0) {
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
}
