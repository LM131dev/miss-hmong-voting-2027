import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import {
  verifyAdminRequest,
  getAdminCredentials,
  verifyPassword,
  updateAdminPassword,
  createSessionToken,
} from "../../../lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const auth = verifyAdminRequest(req);
  if (!auth.valid) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    user: { username: auth.user.username, role: auth.user.role },
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;
    const payload = body.payload || body.data || body;

    // 1. PUBLIC AUTH ACTION: LOGIN
    if (action === "LOGIN") {
      const username = String(payload.username || "").trim();
      const password = String(payload.password || "");

      if (!username || !password) {
        return NextResponse.json(
          { error: "ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານໃຫ້ຄົບຖ້ວນ" },
          { status: 400 }
        );
      }

      const creds = getAdminCredentials();
      const userMatches = username.toLowerCase() === creds.username.toLowerCase();
      const passMatches = verifyPassword(password, creds.hash, creds.salt);

      if (!userMatches || !passMatches) {
        return NextResponse.json(
          { error: "ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ! ກະລຸນາກວດສອບຄືນ" },
          { status: 401 }
        );
      }

      const token = createSessionToken(creds.username);
      const res = NextResponse.json({
        success: true,
        message: "ເຂົ້າສູ່ລະບົບສຳເລັດແລ້ວ!",
        user: { username: creds.username },
        token,
      });

      res.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      return res;
    }

    // 2. PUBLIC AUTH ACTION: LOGOUT
    if (action === "LOGOUT") {
      const res = NextResponse.json({
        success: true,
        message: "ອອກຈາກລະບົບຮຽບຮ້ອຍແລ້ວ!",
      });

      res.cookies.set("admin_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });

      return res;
    }

    // 3. Strict Server-Side Authentication Guard for ALL protected actions
    const auth = verifyAdminRequest(req);
    if (!auth.valid) {
      return NextResponse.json(
        { error: "Unauthorized: ບໍ່ມີສິດເຂົ້າເຖິງ ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ" },
        { status: 401 }
      );
    }

    const db = getDb();

    if (action === "GET_REPORT_DATA") {
      const allTransactions = db
        .prepare(`
          SELECT
            t.*,
            c.code as contestant_code,
            c.name as contestant_name,
            p.name as package_name
          FROM vote_transactions t
          LEFT JOIN contestants c ON t.contestant_id = c.id
          LEFT JOIN vote_packages p ON t.package_id = p.id
          ORDER BY t.id DESC
        `)
        .all();
      return NextResponse.json({
        success: true,
        transactions: allTransactions,
        generated_at: new Date().toISOString(),
      });
    }

    if (action === "APPROVE_TX") {
      const txId = Number(payload.id);
      const tx = db
        .prepare("SELECT * FROM vote_transactions WHERE id = ?")
        .get(txId);

      if (!tx) {
        return NextResponse.json({ error: "ບໍ່ພົບລາຍການບິນນີ້" }, { status: 404 });
      }
      if (tx.status === "APPROVED") {
        return NextResponse.json({ error: "ບິນນີ້ຖືກອະນຸມັດໄປແລ້ວ" }, { status: 400 });
      }

      db.prepare("UPDATE vote_transactions SET status = 'APPROVED' WHERE id = ?").run(txId);
      db.prepare("UPDATE contestants SET total_votes = total_votes + ? WHERE id = ?").run(
        tx.points_added,
        tx.contestant_id
      );

      return NextResponse.json({ success: true, message: "ອະນຸມັດບິນ ແລະ ບວກຄະແນນສຳເລັດ!" });
    }

    if (action === "REJECT_TX") {
      const txId = Number(payload.id);
      const tx = db
        .prepare("SELECT * FROM vote_transactions WHERE id = ?")
        .get(txId);

      if (!tx) {
        return NextResponse.json({ error: "ບໍ່ພົບລາຍການບິນນີ້" }, { status: 404 });
      }

      if (tx.status === "APPROVED") {
        db.prepare(
          "UPDATE contestants SET total_votes = MAX(0, total_votes - ?) WHERE id = ?"
        ).run(tx.points_added, tx.contestant_id);
      }

      db.prepare("UPDATE vote_transactions SET status = 'REJECTED' WHERE id = ?").run(txId);
      return NextResponse.json({ success: true, message: "ປະຕິເສດລາຍການບິນແລ້ວ" });
    }

    if (action === "SAVE_CONTESTANT") {
      const {
        id,
        code,
        name,
        nickname,
        age,
        province,
        ethnic_group,
        height,
        bio,
        image_url,
        traditional_image_url,
        total_votes,
        hearts,
        is_active,
      } = payload;

      const cleanCode = String(code || "").trim().toUpperCase();
      const cleanName = String(name || "").trim();
      if (!cleanCode || !cleanName) {
        return NextResponse.json(
          { error: "ກະລຸນາປ້ອນລະຫັດໝາຍເລກ (ເຊັ່ນ HM 01) ແລະ ຊື່ຜູ້ເຂົ້າປະກວດ" },
          { status: 400 }
        );
      }

      const finalImg = String(image_url || "").trim();
      const finalTradImg = String(traditional_image_url || "").trim() || finalImg;

      if (id) {
        db.prepare(`
          UPDATE contestants
          SET code = ?, name = ?, nickname = ?, age = ?, province = ?, ethnic_group = ?, height = ?, bio = ?, image_url = ?, traditional_image_url = ?, total_votes = ?, hearts = ?, is_active = ?
          WHERE id = ?
        `).run(
          cleanCode,
          cleanName,
          String(nickname || "").trim(),
          Number(age) || 20,
          String(province || "ນະຄອນຫຼວງວຽງຈັນ").trim(),
          String(ethnic_group || "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)").trim(),
          Number(height) || 168,
          String(bio || "").trim(),
          finalImg,
          finalTradImg,
          Number(total_votes) || 0,
          Number.isFinite(Number(hearts)) ? Number(hearts) : 0,
          is_active ? 1 : 0,
          Number(id)
        );
      } else {
        db.prepare(`
          INSERT INTO contestants (code, name, nickname, age, province, ethnic_group, height, bio, image_url, traditional_image_url, total_votes, hearts, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `).run(
          cleanCode,
          cleanName,
          String(nickname || "").trim(),
          Number(age) || 20,
          String(province || "ນະຄອນຫຼວງວຽງຈັນ").trim(),
          String(ethnic_group || "ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2027 (MHVT)").trim(),
          Number(height) || 168,
          String(bio || "").trim(),
          finalImg,
          finalTradImg,
          Number(total_votes) || 0,
          Number.isFinite(Number(hearts)) ? Number(hearts) : 0
        );
      }

      return NextResponse.json({ success: true, message: "ບັນທຶກຂໍ້ມູນຜູ້ເຂົ້າປະກວດສຳເລັດ!" });
    }

    if (action === "ADD_VOTES_CONTESTANT") {
      const cId = Number(payload.id);
      const points = Number(payload.points || payload.votes || 0);
      if (!cId || points <= 0) {
        return NextResponse.json({ error: "ຄະແນນຕ້ອງຫຼາຍກວ່າ 0" }, { status: 400 });
      }

      const contestant = db.prepare("SELECT * FROM contestants WHERE id = ?").get(cId);
      if (!contestant) {
        return NextResponse.json({ error: "ບໍ່ພົບຂໍ້ມູນຜູ້ເຂົ້າປະກວດໝາຍເລກນີ້" }, { status: 404 });
      }

      db.prepare("UPDATE contestants SET total_votes = total_votes + ? WHERE id = ?").run(points, cId);

      const pkg = db.prepare("SELECT id FROM vote_packages LIMIT 1").get();
      db.prepare(`
        INSERT INTO vote_transactions (contestant_id, package_id, voter_name, voter_phone, cheer_message, points_added, amount_lak, payment_ref, status, created_at)
        VALUES (?, ?, 'Admin Special Boost', '020 0000 0000', 'ຄະແນນພິເສດຈາກຄະນະຈັດງານ', ?, 0, 'ADMIN-MANUAL', 'APPROVED', datetime('now', 'localtime'))
      `).run(cId, pkg ? pkg.id : 1, points);

      return NextResponse.json({
        success: true,
        message: `ເພີ່ມຄະແນນ +${points} Votes ໃຫ້ ${contestant.code} (${contestant.name}) ສຳເລັດ!`,
      });
    }

    if (action === "DELETE_CONTESTANT") {
      const cId = Number(payload.id);
      db.prepare("DELETE FROM vote_transactions WHERE contestant_id = ?").run(cId);
      db.prepare("DELETE FROM contestants WHERE id = ?").run(cId);
      return NextResponse.json({ success: true, message: "ລຶບຂໍ້ມູນຜູ້ເຂົ້າປະກວດແລ້ວ" });
    }

    if (action === "SAVE_PACKAGE") {
      const { id, name, points, price_lak, badge } = payload;
      if (id) {
        db.prepare(
          "UPDATE vote_packages SET name = ?, points = ?, price_lak = ?, badge = ? WHERE id = ?"
        ).run(
          String(name).trim(),
          Number(points),
          Number(price_lak),
          String(badge || "").trim(),
          Number(id)
        );
      } else {
        db.prepare(
          "INSERT INTO vote_packages (name, points, price_lak, badge) VALUES (?, ?, ?, ?)"
        ).run(
          String(name).trim(),
          Number(points),
          Number(price_lak),
          String(badge || "").trim()
        );
      }
      return NextResponse.json({ success: true, message: "ບັນທຶກແພັກເກັດໂຫວດສຳເລັດ!" });
    }

    if (action === "DELETE_PACKAGE") {
      const pId = Number(payload.id);
      db.prepare("DELETE FROM vote_packages WHERE id = ?").run(pId);
      return NextResponse.json({ success: true, message: "ລຶບແພັກເກັດໂຫວດແລ້ວ" });
    }

    // Committee Actions
    if (action === "SAVE_COMMITTEE") {
      const { id, order_no, badge, name, role, sub_role, quote, image, featured } = payload;
      if (!name || !role) {
        return NextResponse.json({ error: "ກະລຸນາປ້ອນຊື່ ແລະ ຕຳແໜ່ງ" }, { status: 400 });
      }
      if (id) {
        db.prepare(`
          UPDATE committee
          SET order_no = ?, badge = ?, name = ?, role = ?, sub_role = ?, quote = ?, image = ?, featured = ?
          WHERE id = ?
        `).run(
          Number(order_no) || 1,
          String(badge || "").trim(),
          String(name).trim(),
          String(role).trim(),
          String(sub_role || "").trim(),
          String(quote || "").trim(),
          String(image || "/committee/img1.jpg").trim(),
          featured ? 1 : 0,
          Number(id)
        );
      } else {
        db.prepare(`
          INSERT INTO committee (order_no, badge, name, role, sub_role, quote, image, featured)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          Number(order_no) || 1,
          String(badge || "").trim(),
          String(name).trim(),
          String(role).trim(),
          String(sub_role || "").trim(),
          String(quote || "").trim(),
          String(image || "/committee/img1.jpg").trim(),
          featured ? 1 : 0
        );
      }
      return NextResponse.json({ success: true, message: "ບັນທຶກຂໍ້ມູນຄະນະກຳມະການສຳເລັດ!" });
    }

    if (action === "DELETE_COMMITTEE") {
      const cId = Number(payload.id);
      db.prepare("DELETE FROM committee WHERE id = ?").run(cId);
      return NextResponse.json({ success: true, message: "ລຶບຂໍ້ມູນຄະນະກຳມະການແລ້ວ" });
    }

    // Ticket Tiers Actions
    if (action === "SAVE_TICKET") {
      const { id, tier_id, name, name_lao, price_lak, bonus_votes, zone, perks_json, badge, popular, order_no } = payload;
      if (!tier_id || !name || !name_lao) {
        return NextResponse.json({ error: "ກະລຸນາປ້ອນລະຫັດໂຊນ ແລະ ຊື່ບັດ" }, { status: 400 });
      }
      const perksStr = typeof perks_json === "string" ? perks_json : JSON.stringify(perks_json || []);
      if (id) {
        db.prepare(`
          UPDATE ticket_tiers
          SET tier_id = ?, name = ?, name_lao = ?, price_lak = ?, bonus_votes = ?, zone = ?, perks_json = ?, badge = ?, popular = ?, order_no = ?
          WHERE id = ?
        `).run(
          String(tier_id).trim(),
          String(name).trim(),
          String(name_lao).trim(),
          Number(price_lak) || 0,
          Number(bonus_votes) || 0,
          String(zone || "").trim(),
          perksStr,
          String(badge || "").trim(),
          popular ? 1 : 0,
          Number(order_no) || 1,
          Number(id)
        );
      } else {
        db.prepare(`
          INSERT INTO ticket_tiers (tier_id, name, name_lao, price_lak, bonus_votes, zone, perks_json, badge, popular, order_no)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          String(tier_id).trim(),
          String(name).trim(),
          String(name_lao).trim(),
          Number(price_lak) || 0,
          Number(bonus_votes) || 0,
          String(zone || "").trim(),
          perksStr,
          String(badge || "").trim(),
          popular ? 1 : 0,
          Number(order_no) || 1
        );
      }
      return NextResponse.json({ success: true, message: "ບັນທຶກຂໍ້ມູນປີ້ເຂົ້າຊົມສຳເລັດ!" });
    }

    if (action === "DELETE_TICKET") {
      const tId = Number(payload.id);
      db.prepare("DELETE FROM ticket_tiers WHERE id = ?").run(tId);
      db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('frontend_seeded', '1')").run();
      return NextResponse.json({ success: true, message: "ລຶບປະເພດປີ້ເຂົ້າຊົມແລ້ວ" });
    }

    // Schedule Items Actions
    if (action === "SAVE_SCHEDULE") {
      const { id, order_no, date, time, title, location, status, is_live, is_done, is_finale } = payload;
      if (!title || !date) {
        return NextResponse.json({ error: "ກະລຸນາປ້ອນວັນທີ ແລະ ຊື່ກິດຈະກຳ" }, { status: 400 });
      }
      if (id) {
        db.prepare(`
          UPDATE schedule_items
          SET order_no = ?, date = ?, time = ?, title = ?, location = ?, status = ?, is_live = ?, is_done = ?, is_finale = ?
          WHERE id = ?
        `).run(
          Number(order_no) || 1,
          String(date).trim(),
          String(time || "").trim(),
          String(title).trim(),
          String(location || "").trim(),
          String(status || "").trim(),
          is_live ? 1 : 0,
          is_done ? 1 : 0,
          is_finale ? 1 : 0,
          Number(id)
        );
      } else {
        db.prepare(`
          INSERT INTO schedule_items (order_no, date, time, title, location, status, is_live, is_done, is_finale)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          Number(order_no) || 1,
          String(date).trim(),
          String(time || "").trim(),
          String(title).trim(),
          String(location || "").trim(),
          String(status || "").trim(),
          is_live ? 1 : 0,
          is_done ? 1 : 0,
          is_finale ? 1 : 0
        );
      }
      return NextResponse.json({ success: true, message: "ບັນທຶກຕາຕະລາງກິດຈະກຳສຳເລັດ!" });
    }

    if (action === "DELETE_SCHEDULE") {
      const sId = Number(payload.id);
      db.prepare("DELETE FROM schedule_items WHERE id = ?").run(sId);
      return NextResponse.json({ success: true, message: "ລຶບຕາຕະລາງກິດຈະກຳແລ້ວ" });
    }

    // News Items Actions
    if (action === "SAVE_NEWS") {
      const { id, order_no, title, date, category, summary, content, images_json, type } = payload;
      if (!title) {
        return NextResponse.json({ error: "ກະລຸນາປ້ອນຫົວຂໍ້ຂ່າວ" }, { status: 400 });
      }
      const imgsStr = typeof images_json === "string" ? images_json : JSON.stringify(images_json || []);
      if (id) {
        db.prepare(`
          UPDATE news_items
          SET order_no = ?, title = ?, date = ?, category = ?, summary = ?, content = ?, images_json = ?, type = ?
          WHERE id = ?
        `).run(
          Number(order_no) || 1,
          String(title).trim(),
          String(date || "").trim(),
          String(category || "ຂ່າວກອງປະກວດ").trim(),
          String(summary || "").trim(),
          String(content || "").trim(),
          imgsStr,
          String(type || "news").trim(),
          Number(id)
        );
      } else {
        db.prepare(`
          INSERT INTO news_items (order_no, title, date, category, summary, content, images_json, type)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          Number(order_no) || 1,
          String(title).trim(),
          String(date || "").trim(),
          String(category || "ຂ່າວກອງປະກວດ").trim(),
          String(summary || "").trim(),
          String(content || "").trim(),
          imgsStr,
          String(type || "news").trim()
        );
      }
      return NextResponse.json({ success: true, message: "ບັນທຶກຂ່າວສານກອງປະກວດສຳເລັດ!" });
    }

    if (action === "DELETE_NEWS") {
      const nId = Number(payload.id);
      db.prepare("DELETE FROM news_items WHERE id = ?").run(nId);
      return NextResponse.json({ success: true, message: "ລຶບຂ່າວສານແລ້ວ" });
    }

    // Sponsors Actions
    if (action === "SAVE_PAST_QUEEN") {
      const { id, year, name, title, image_url, bio, badge, order_no } = payload;
      if (id) {
        db.prepare(`
          UPDATE past_queens 
          SET year = ?, name = ?, title = ?, image_url = ?, bio = ?, badge = ?, order_no = ?
          WHERE id = ?
        `).run(
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
        db.prepare(`
          INSERT INTO past_queens (year, name, title, image_url, bio, badge, order_no)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
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

    if (action === "SAVE_SPONSOR") {
      const { id, tier, name, role, order_no } = payload;
      if (!name) {
        return NextResponse.json({ error: "ກະລຸນາປ້ອນຊື່ຜູ້ສະໜັບສະໜູນ" }, { status: 400 });
      }
      if (id) {
        db.prepare(`
          UPDATE sponsors
          SET tier = ?, name = ?, role = ?, order_no = ?
          WHERE id = ?
        `).run(
          String(tier || "DIAMOND").trim().toUpperCase(),
          String(name).trim(),
          String(role || "").trim(),
          Number(order_no) || 1,
          Number(id)
        );
      } else {
        db.prepare(`
          INSERT INTO sponsors (tier, name, role, order_no)
          VALUES (?, ?, ?, ?)
        `).run(
          String(tier || "DIAMOND").trim().toUpperCase(),
          String(name).trim(),
          String(role || "").trim(),
          Number(order_no) || 1
        );
      }
      return NextResponse.json({ success: true, message: "ບັນທຶກຜູ້ສະໜັບສະໜູນສຳເລັດ!" });
    }

    if (action === "DELETE_SPONSOR") {
      const spId = Number(payload.id);
      db.prepare("DELETE FROM sponsors WHERE id = ?").run(spId);
      return NextResponse.json({ success: true, message: "ລຶບຜູ້ສະໜັບສະໜູນແລ້ວ" });
    }

    if (action === "CHANGE_PASSWORD") {
      const { currentPassword, newPassword, newUsername } = payload;
      const creds = getAdminCredentials();
      const passMatches = verifyPassword(String(currentPassword || ""), creds.hash, creds.salt);
      if (!passMatches) {
        return NextResponse.json(
          { error: "ລະຫັດຜ່ານປັດຈຸບັນບໍ່ຖືກຕ້ອງ! ກະລຸນາກວດສອບຄືນ" },
          { status: 400 }
        );
      }
      if (!newPassword || String(newPassword).length < 6) {
        return NextResponse.json(
          { error: "ລະຫັດຜ່ານໃໝ່ຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ" },
          { status: 400 }
        );
      }
      updateAdminPassword(String(newPassword), newUsername || creds.username);
      return NextResponse.json({
        success: true,
        message: "ປ່ຽນລະຫັດຜ່ານແອັດມິນສຳເລັດຮຽບຮ້ອຍແລ້ວ!",
      });
    }

    if (action === "UPDATE_SETTINGS") {
      const upsert = db.prepare(
        "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
      );
      for (const [k, v] of Object.entries(payload)) {
        upsert.run(k, String(v));
      }
      return NextResponse.json({ success: true, message: "ອັບເດດການຕັ້ງຄ່າລະບົບແລ້ວ" });
    }

    return NextResponse.json({ error: "ບໍ່ຮູ້ຈັກຄຳສັ່ງ Action ນີ້" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/admin error:", error);
    return NextResponse.json(
      { error: "ເກີດຂໍ້ຜິດພາດໃນການຈັດການຂໍ້ມູນຫຼັງບ້ານ" },
      { status: 500 }
    );
  }
}
