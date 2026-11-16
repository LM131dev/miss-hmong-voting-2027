import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const db = getDb();

    // Support quick free heart cheer reaction
    if (body.action === "HEART") {
      const cId = Number(body.contestant_id);
      db.prepare("UPDATE contestants SET hearts = COALESCE(hearts, 100) + 1 WHERE id = ?").run(cId);
      const row = db.prepare("SELECT hearts FROM contestants WHERE id = ?").get(cId);
      return NextResponse.json({ success: true, hearts: row?.hearts || 1 });
    }

    const {
      contestant_id,
      package_id,
      voter_name,
      voter_phone,
      cheer_message,
      payment_ref,
      slip_image_url,
      instant_demo,
    } = body;

    const votingOpenRow = db
      .prepare("SELECT value FROM settings WHERE key = 'voting_open'")
      .get();

    if (votingOpenRow && votingOpenRow.value !== "true") {
      return NextResponse.json(
        { error: "ຂໍອະໄພ ລະບົບປິດຮັບການໂຫວດຊົ່ວຄາວແລ້ວ" },
        { status: 400 }
      );
    }

    const contestant = db
      .prepare("SELECT * FROM contestants WHERE id = ? AND is_active = 1")
      .get(Number(contestant_id));

    if (!contestant) {
      return NextResponse.json(
        { error: "ບໍ່ພົບຂໍ້ມູນຜູ້ເຂົ້າປະກວດໝາຍເລກນີ້" },
        { status: 404 }
      );
    }

    const pkg = db
      .prepare("SELECT * FROM vote_packages WHERE id = ?")
      .get(Number(package_id));

    if (!pkg) {
      return NextResponse.json(
        { error: "ບໍ່ພົບແພັກເກັດການໂຫວດທີ່ເລືອກ" },
        { status: 404 }
      );
    }

    const autoApproveRow = db
      .prepare("SELECT value FROM settings WHERE key = 'auto_approve'")
      .get();

    const shouldApproveImmediately =
      Boolean(instant_demo) || (autoApproveRow && autoApproveRow.value === "true");

    const status = shouldApproveImmediately ? "APPROVED" : "PENDING";
    const cleanVoterName = (voter_name || "").trim() || "ຜູ້ສະໜັບສະໜູນ ສວນບັນດາເຜົ່າ";
    const cleanPhone = (voter_phone || "").trim() || "-";
    const cleanCheer =
      (cheer_message || "").trim() || "ສົ່ງແຮງໃຈເຊຍສຸດໃຈ! ຂໍໃຫ້ຄອງມົງກຸດເດີ້ 💚👑";
    const cleanRef =
      (payment_ref || "").trim() ||
      `BCEL-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowStr = new Date().toISOString().replace("T", " ").slice(0, 19);

    let finalSlipUrl = String(slip_image_url || "").trim();
    if (finalSlipUrl.startsWith("data:image/")) {
      try {
        const matches = finalSlipUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (matches) {
          const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
          const buffer = Buffer.from(matches[2], "base64");
          const filename = `slip_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`;
          const dirPath = path.join(process.cwd(), "public", "uploads", "slips");
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
          }
          const filePath = path.join(dirPath, filename);
          fs.writeFileSync(filePath, buffer);
          finalSlipUrl = `/uploads/slips/${filename}`;
        }
      } catch (err) {
        console.error("Failed to save slip file:", err);
      }
    }

    const insertResult = db
      .prepare(`
        INSERT INTO vote_transactions
        (contestant_id, package_id, voter_name, voter_phone, cheer_message, points_added, amount_lak, payment_ref, slip_image_url, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        contestant.id,
        pkg.id,
        cleanVoterName,
        cleanPhone,
        cleanCheer,
        pkg.points,
        pkg.price_lak,
        cleanRef,
        finalSlipUrl,
        status,
        nowStr
      );

    if (status === "APPROVED") {
      db.prepare(
        "UPDATE contestants SET total_votes = total_votes + ?, hearts = COALESCE(hearts, 100) + 5 WHERE id = ?"
      ).run(pkg.points, contestant.id);
    }

    return NextResponse.json({
      success: true,
      transaction: {
        id: Number(insertResult.lastInsertRowid),
        contestant_code: contestant.code,
        contestant_name: contestant.name,
        package_name: pkg.name,
        voter_name: cleanVoterName,
        cheer_message: cleanCheer,
        points_added: pkg.points,
        amount_lak: pkg.price_lak,
        payment_ref: cleanRef,
        slip_image_url: finalSlipUrl,
        status,
        created_at: nowStr,
      },
    });
  } catch (error) {
    console.error("POST /api/vote error:", error);
    return NextResponse.json(
      { error: "ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກຄະແນນໂຫວດ" },
      { status: 500 }
    );
  }
}
