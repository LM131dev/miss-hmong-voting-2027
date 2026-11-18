import { NextResponse } from "next/server";
import { verifyAdminRequest } from "../../../../lib/auth";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.valid) {
      return NextResponse.json(
        { error: "ທ່ານບໍ່ມີສິດເຂົ້າເຖິງ ກະລຸນາເຂົ້າສູ່ລະບົບແອັດມິນກ່ອນ" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const rawFolder = String(formData.get("folder") || "contestants").trim().toLowerCase();
    const safeFolder = ["contestants", "queens", "committee", "news", "sponsors", "qr", "general"].includes(rawFolder)
      ? rawFolder
      : "contestants";

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "ກະລຸນາເລືອກໄຟລ໌ຮູບພາບ" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length === 0) {
      return NextResponse.json({ error: "ໄຟລ໌ວ່າງເປົ່າ" }, { status: 400 });
    }

    // Limit to 25MB
    if (buffer.length > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "ຂະໜາດໄຟລ໌ໃຫຍ່ເກີນໄປ (ສູງສຸດ 25MB)" }, { status: 400 });
    }

    const originalName = file.name || "image.jpg";
    let ext = path.extname(originalName).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) {
      ext = ".jpg";
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", safeFolder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${safeFolder}_${Date.now()}_${Math.floor(Math.random() * 10000)}${ext}`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    // If uploading official QR code, also update official_lao_qr.png directly
    if (safeFolder === "qr") {
      try {
        const rootQrPath = path.join(process.cwd(), "public", "official_lao_qr.png");
        fs.writeFileSync(rootQrPath, buffer);
      } catch (qrErr) {
        console.error("Failed to sync official_lao_qr.png:", qrErr);
      }
    }

    const publicUrl = `/uploads/${safeFolder}/${filename}`;

    return NextResponse.json({
      success: true,
      message: "ອັບໂຫລດຮູບພາບສຳເລັດ!",
      url: publicUrl,
      size: buffer.length,
      filename,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "ເກີດຂໍ້ຜິດພາດໃນການອັບໂຫລດ: " + (err.message || String(err)) },
      { status: 500 }
    );
  }
}
