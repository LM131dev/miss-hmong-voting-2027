import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();

    const contestants = db
      .prepare("SELECT * FROM contestants ORDER BY total_votes DESC, code ASC")
      .all();

    const packages = db
      .prepare("SELECT * FROM vote_packages ORDER BY price_lak ASC")
      .all();

    const transactions = db
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
        LIMIT 1000
      `)
      .all();

    const settingsRows = db.prepare("SELECT key, value FROM settings").all();
    const settings = {};
    for (const row of settingsRows) {
      settings[row.key] = row.value;
    }

    const statsRow = db
      .prepare(`
        SELECT 
          COALESCE(SUM(CASE WHEN status = 'APPROVED' THEN amount_lak ELSE 0 END), 0) as total_revenue_lak,
          COALESCE(SUM(CASE WHEN status = 'APPROVED' THEN points_added ELSE 0 END), 0) as tx_approved_points,
          COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending_count,
          COUNT(*) as total_tx_count
        FROM vote_transactions
      `)
      .get();

    const totalVotesAllContestants = contestants.reduce((sum, c) => sum + c.total_votes, 0);

    const committee = db
      .prepare("SELECT * FROM committee ORDER BY order_no ASC, id ASC")
      .all();

    const tickets = db
      .prepare("SELECT * FROM ticket_tiers ORDER BY order_no ASC, id ASC")
      .all();

    const schedule = db
      .prepare("SELECT * FROM schedule_items ORDER BY order_no ASC, id ASC")
      .all();

    const news = db
      .prepare("SELECT * FROM news_items ORDER BY order_no ASC, id ASC")
      .all();

    const sponsors = db
      .prepare("SELECT * FROM sponsors ORDER BY order_no ASC, id ASC")
      .all();

    const past_queens = db
      .prepare("SELECT * FROM past_queens ORDER BY order_no ASC, year ASC")
      .all();

    return NextResponse.json({
      contestants,
      packages,
      transactions,
      settings,
      stats: {
        ...statsRow,
        total_votes: totalVotesAllContestants,
      },
      committee,
      tickets,
      schedule,
      news,
      sponsors,
      past_queens,
    });
  } catch (error) {
    console.error("GET /api/state error:", error);
    return NextResponse.json(
      { error: "ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ" },
      { status: 500 }
    );
  }
}

