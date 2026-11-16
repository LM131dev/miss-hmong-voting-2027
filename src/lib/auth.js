// src/lib/auth.js - Secure Authentication & Session Management for Admin
import crypto from "node:crypto";
import { getDb } from "./db";

const JWT_SECRET =
  process.env.ADMIN_JWT_SECRET ||
  "miss-hmong-vientiane-2027-royal-secret-key-purple-gold-998877";

const DEFAULT_ADMIN_USER = process.env.ADMIN_USER || "admin";
const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASSWORD || "mhvt2027";

/**
 * Hash a password using standard crypto scrypt with a unique salt
 */
export function hashPassword(password, salt) {
  const effectiveSalt = salt || crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, effectiveSalt, 64);
  return {
    hash: derivedKey.toString("hex"),
    salt: effectiveSalt,
  };
}

/**
 * Verify a password against stored hash & salt using timingSafeEqual
 */
export function verifyPassword(password, storedHash, salt) {
  try {
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(derivedKey.toString("hex"), "hex");
    const storedBuffer = Buffer.from(storedHash, "hex");
    if (keyBuffer.length !== storedBuffer.length) return false;
    return crypto.timingSafeEqual(keyBuffer, storedBuffer);
  } catch (err) {
    console.error("Password verification error:", err);
    return false;
  }
}

/**
 * Retrieve admin credentials from SQLite settings or initialize with secure default
 */
export function getAdminCredentials() {
  const db = getDb();
  let userRow = null;
  let hashRow = null;
  let saltRow = null;

  try {
    userRow = db.prepare("SELECT value FROM settings WHERE key = 'admin_username'").get();
    hashRow = db.prepare("SELECT value FROM settings WHERE key = 'admin_password_hash'").get();
    saltRow = db.prepare("SELECT value FROM settings WHERE key = 'admin_password_salt'").get();
  } catch (e) {
    console.warn("Could not query admin credentials from settings:", e);
  }

  // If credentials already exist in DB
  if (userRow?.value && hashRow?.value && saltRow?.value) {
    return {
      username: userRow.value,
      hash: hashRow.value,
      salt: saltRow.value,
    };
  }

  // Otherwise, initialize defaults into settings table
  const { hash, salt } = hashPassword(DEFAULT_ADMIN_PASS);
  try {
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('admin_username', ?)").run(
      DEFAULT_ADMIN_USER
    );
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('admin_password_hash', ?)").run(
      hash
    );
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('admin_password_salt', ?)").run(
      salt
    );
  } catch (e) {
    console.warn("Could not save initial admin credentials to settings:", e);
  }

  return {
    username: DEFAULT_ADMIN_USER,
    hash,
    salt,
  };
}

/**
 * Update Admin Password in SQLite settings
 */
export function updateAdminPassword(newPassword, newUsername) {
  const db = getDb();
  const { hash, salt } = hashPassword(newPassword);
  const username = (newUsername || DEFAULT_ADMIN_USER).trim();

  db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('admin_username', ?)").run(
    username
  );
  db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('admin_password_hash', ?)").run(
    hash
  );
  db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('admin_password_salt', ?)").run(
    salt
  );

  return { success: true, username };
}

/**
 * Generate a signed session token (HMAC-SHA256)
 */
export function createSessionToken(username) {
  const payload = {
    username,
    role: "admin",
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days valid
    nonce: crypto.randomBytes(8).toString("hex"),
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(data)
    .digest("base64url");

  return `${data}.${signature}`;
}

/**
 * Verify a signed session token
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [data, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(data)
    .digest("base64url");

  // Constant-time comparison
  const sigBuffer = Buffer.from(signature);
  const expBuffer = Buffer.from(expectedSignature);
  if (sigBuffer.length !== expBuffer.length) return null;
  if (!crypto.timingSafeEqual(sigBuffer, expBuffer)) return null;

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    if (Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Verify incoming admin request (via HTTP cookie or Authorization header)
 */
export function verifyAdminRequest(req) {
  let token = null;

  // 1. Try cookie first
  if (req.cookies && typeof req.cookies.get === "function") {
    token = req.cookies.get("admin_token")?.value;
  } else if (req.headers) {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/admin_token=([^;]+)/);
    if (match) token = match[1];
  }

  // 2. Try Authorization: Bearer <token>
  if (!token && req.headers) {
    const authHeader = req.headers.get("authorization") || "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7).trim();
    }
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    return { valid: false, error: "Unauthorized" };
  }

  return { valid: true, user: payload };
}
