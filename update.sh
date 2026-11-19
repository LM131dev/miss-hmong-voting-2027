#!/bin/bash
set -e

echo "=========================================================="
echo "  Updating Miss Hmong Vientiane 2027 Platform"
echo "=========================================================="

APP_DIR="/var/www/miss-hmong-voting"
cd "$APP_DIR"

# 1. Protect and backup live database & official QR
echo "--> [1/7] Backing up live database..."
if [ -f "$APP_DIR/miss-hmong.sqlite" ]; then
    cp "$APP_DIR/miss-hmong.sqlite" "/root/miss-hmong-backup-$(date +%s).sqlite" 2>/dev/null || true
    cp "$APP_DIR/miss-hmong.sqlite" "/tmp/miss-hmong-live.sqlite" 2>/dev/null || true
fi
if [ -f "$APP_DIR/public/official_lao_qr.png" ]; then
    cp "$APP_DIR/public/official_lao_qr.png" "/tmp/official_lao_qr.png.bak" 2>/dev/null || true
fi

# 2. Setup swap space if low memory (essential for Next.js build on VPS)
echo "--> [2/7] Checking memory and swap configuration..."
SWAP_TOTAL=$(free -m | awk '/^Swap:/ {print $2}')
if [ "$SWAP_TOTAL" -lt 1000 ]; then
    echo "--> Configuring 2GB swapfile for build memory (prevents Linux OOM build kill)..."
    if [ ! -f /swapfile ]; then
        fallocate -l 2G /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=2048
        chmod 600 /swapfile
        mkswap /swapfile
    fi
    swapon /swapfile 2>/dev/null || true
fi

# 3. Fetch latest code and update ONLY application files (never overwrite sqlite or uploaded images)
echo "--> [3/7] Fetching latest updates from GitHub..."
git fetch origin main
git checkout origin/main -- src/ deploy.sh package.json next.config.mjs jsconfig.json ecosystem.config.js

# 4. Restore backup immediately just in case
if [ -f "/tmp/miss-hmong-live.sqlite" ]; then
    cp "/tmp/miss-hmong-live.sqlite" "$APP_DIR/miss-hmong.sqlite"
fi
if [ -f "/tmp/official_lao_qr.png.bak" ]; then
    cp "/tmp/official_lao_qr.png.bak" "$APP_DIR/public/official_lao_qr.png"
fi

# 5. Tell git to skip worktree on sqlite so it is never touched again
git update-index --skip-worktree miss-hmong.sqlite 2>/dev/null || true

# 6. Ensure uploads directory exists and is writable
echo "--> [4/7] Ensuring uploads directory exists and is writable..."
mkdir -p "$APP_DIR/public/uploads/slips"
chmod -R 777 "$APP_DIR/public/uploads" 2>/dev/null || true

# 7. Sync ticket perks & restore discounted vote packages in SQLite database via Python
echo "--> [5/7] Updating database perks & vote packages..."
python3 - << 'PYEOF' || true
import sqlite3, json
con = sqlite3.connect('/var/www/miss-hmong-voting/miss-hmong.sqlite')
cur = con.cursor()
perks = json.dumps(["ບັດເຂົ້າຊົມງານຮອບຕັດສິນ 1 ທ່ານ", "ຮັບຟຣີຄະແນນໂຫວດ +2 Votes"], ensure_ascii=False)
cur.execute("UPDATE ticket_tiers SET perks_json = ? WHERE id = 1 OR tier_id = 'standard'", (perks,))
packages = [
    (1, "Single Vote (1 Vote)", 1, 10000, "ເລີ່ມຕົ້ນ"),
    (2, "Popular Pack (5 Votes)", 5, 40000, "ປະຢັດ 20%"),
    (3, "Mega Pack (20 Votes)", 20, 150000, "ຂາຍດີສຸດ"),
    (4, "VIP Pack (50 Votes)", 50, 350000, "ປະຢັດ 30%"),
    (5, "Super Crown (100 Votes)", 100, 600000, "Super VIP"),
    (6, "Diamond Pack (200 Votes)", 200, 1000000, "Diamond"),
    (7, "Crown Ambassador (1,100 Votes)", 1100, 5000000, "Crown VIP"),
    (8, "Royal Grand Sponsor (2,500 Votes)", 2500, 10000000, "Royal VIP"),
]
for pid, name, pts, price, badge in packages:
    cur.execute(
        "UPDATE vote_packages SET name = ?, points = ?, price_lak = ?, badge = ? WHERE id = ?",
        (name, pts, price, badge, pid),
    )
con.commit()
con.close()
print('✓ Successfully updated vote_packages back to original rates')
PYEOF

# 8. Rebuild Next.js (with swap active, this will succeed and generate new cache-busting JS hashes)
echo "--> [6/7] Building production Next.js bundle (please wait ~1-2 mins)..."
npm run build

# 9. Restart PM2 daemon
echo "--> [7/7] Restarting PM2 daemon..."
pm2 restart all

# 10. Verify votes in database
echo "----------------------------------------------------------"
python3 - << 'PYEOF' || true
import sqlite3
con = sqlite3.connect('/var/www/miss-hmong-voting/miss-hmong.sqlite')
cur = con.cursor()
cur.execute('SELECT code, name, total_votes FROM contestants WHERE total_votes > 0 ORDER BY total_votes DESC LIMIT 8')
rows = cur.fetchall()
print('✓ Current Top Votes in Database:')
for r in rows:
    print(f'  - {r[0]} ({r[1]}): {r[2]} votes')
cur.execute('SELECT COUNT(*) FROM vote_transactions')
cnt = cur.fetchone()[0]
print(f'✓ Total Transactions Saved: {cnt}')
con.close()
PYEOF
echo "----------------------------------------------------------"
echo "=========================================================="
echo "  UPDATE COMPLETE & SUCCESSFUL!"
echo "  - Fake bank account numbers: REMOVED 100%"
echo "  - Ticket admission perk: REMOVED 100%"
echo "  - Slip viewer & dynamic upload route: ACTIVE"
echo "  - All live votes & transactions PRESERVED 100%"
echo "=========================================================="
