const fs = require('fs');
const path = require('path');

// 1. UPDATE src/lib/db.js
const dbFilePath = path.join(process.cwd(), 'src', 'lib', 'db.js');
let dbCode = fs.readFileSync(dbFilePath, 'utf8');

// Add table definition if not present
const tableDef = `    CREATE TABLE IF NOT EXISTS past_queens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year TEXT NOT NULL,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      image_url TEXT NOT NULL DEFAULT '',
      bio TEXT NOT NULL DEFAULT '',
      badge TEXT NOT NULL DEFAULT '',
      order_no INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`;

if (!dbCode.includes('CREATE TABLE IF NOT EXISTS past_queens')) {
  dbCode = dbCode.replace(
    'CREATE TABLE IF NOT EXISTS sponsors (',
    `${tableDef}\n\n    CREATE TABLE IF NOT EXISTS sponsors (`
  );
}

// Add seed data if not present
const seedDef = `  // Past Queens (Hall of Fame)
  const queenCount = db.prepare("SELECT COUNT(*) as count FROM past_queens").get();
  if (!queenCount || queenCount.count === 0) {
    const insertQueen = db.prepare(\`
      INSERT INTO past_queens (year, name, title, image_url, bio, badge, order_no)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    \`);
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
  }`;

if (!dbCode.includes('// Past Queens (Hall of Fame)')) {
  dbCode = dbCode.replace(
    '  // Sponsors',
    `${seedDef}\n\n  // Sponsors`
  );
}

fs.writeFileSync(dbFilePath, dbCode, 'utf8');
console.log("Updated db.js with past_queens schema and seed data!");

// 2. UPDATE src/app/api/state/route.js
const statePath = path.join(process.cwd(), 'src', 'app', 'api', 'state', 'route.js');
let stateCode = fs.readFileSync(statePath, 'utf8');

if (!stateCode.includes('const past_queens =')) {
  stateCode = stateCode.replace(
    '    const sponsors = db\n      .prepare("SELECT * FROM sponsors ORDER BY order_no ASC, id ASC")\n      .all();',
    `    const sponsors = db\n      .prepare("SELECT * FROM sponsors ORDER BY order_no ASC, id ASC")\n      .all();\n\n    const past_queens = db\n      .prepare("SELECT * FROM past_queens ORDER BY order_no ASC, year ASC")\n      .all();`
  );

  stateCode = stateCode.replace(
    '      sponsors,\n    });',
    '      sponsors,\n      past_queens,\n    });'
  );

  fs.writeFileSync(statePath, stateCode, 'utf8');
  console.log("Updated src/app/api/state/route.js to return past_queens!");
}

// 3. UPDATE src/app/api/admin/route.js
const adminRoutePath = path.join(process.cwd(), 'src', 'app', 'api', 'admin', 'route.js');
let adminRouteCode = fs.readFileSync(adminRoutePath, 'utf8');

const pastQueenAdminActions = `    if (action === "SAVE_PAST_QUEEN") {
      const { id, year, name, title, image_url, bio, badge, order_no } = payload;
      if (id) {
        db.prepare(\`
          UPDATE past_queens 
          SET year = ?, name = ?, title = ?, image_url = ?, bio = ?, badge = ?, order_no = ?
          WHERE id = ?
        \`).run(
          year || "",
          name || "",
          title || "",
          image_url || "",
          bio || "",
          badge || "",
          Number(order_no || 0),
          Number(id)
        );
      } else {
        db.prepare(\`
          INSERT INTO past_queens (year, name, title, image_url, bio, badge, order_no)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        \`).run(
          year || "",
          name || "",
          title || "",
          image_url || "",
          bio || "",
          badge || "",
          Number(order_no || 0)
        );
      }
      return NextResponse.json({ success: true, message: "ບັນທຶກຂໍ້ມູນອະດີດນາງສາວສຳເລັດ!" });
    }

    if (action === "DELETE_PAST_QUEEN") {
      const qId = Number(payload.id);
      db.prepare("DELETE FROM past_queens WHERE id = ?").run(qId);
      return NextResponse.json({ success: true, message: "ລຶບຂໍ້ມູນອະດີດນາງສາວສຳເລັດ!" });
    }
`;

if (!adminRouteCode.includes('action === "SAVE_PAST_QUEEN"')) {
  adminRouteCode = adminRouteCode.replace(
    '    if (action === "SAVE_SPONSOR") {',
    `${pastQueenAdminActions}\n    if (action === "SAVE_SPONSOR") {`
  );
  fs.writeFileSync(adminRoutePath, adminRouteCode, 'utf8');
  console.log("Updated src/app/api/admin/route.js with SAVE_PAST_QUEEN and DELETE_PAST_QUEEN!");
}
