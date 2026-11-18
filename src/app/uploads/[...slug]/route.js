import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug || [];
    if (!slug || slug.length === 0) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Prevent directory traversal
    const safeSlug = slug.map((s) => s.replace(/(\.\.[\/\\])+/g, ""));
    const filePath = path.join(process.cwd(), "public", "uploads", ...safeSlug);

    if (!fs.existsSync(filePath)) {
      return new NextResponse("File Not Found", { status: 404 });
    }

    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      return new NextResponse("Not a file", { status: 400 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();

    let contentType = "application/octet-stream";
    if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".png") contentType = "image/png";
    else if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".gif") contentType = "image/gif";
    else if (ext === ".svg") contentType = "image/svg+xml";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(stat.size),
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err) {
    console.error("Error serving uploaded file:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
