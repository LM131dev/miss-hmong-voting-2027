# 👑 ເວັບໄຊ້ໂຫວດການປະກວດນາງສາວຊົນເຜົ່າມົ້ງ (Miss Hmong Voting System)

ໂປຣເຈັກເວັບໄຊ້ໂຫວດກອງປະກວດແບບຊື້ຄະແນນໂຫວດ (Paid Package & QR Code Slip Verification) ພັດທະນາດ້ວຍ **Next.js (App Router) + Tailwind CSS + SQLite (Node Native SQLite)**.

---

## 🚀 ວິທີເປີດໃຊ້ງານໂປຣເຈັກ (How to Run)

1. ເປີດ Terminal ໃນໂຟນເດີໂປຣເຈັກ:
   ```bash
   cd C:\Users\latsa\.gemini\antigravity\scratch\miss-hmong-voting
   ```
2. ລັນເຊີບເວີສຳລັບພັດທະນາ (Development Server):
   ```bash
   npm run dev
   ```
3. ເປີດເວັບບຣາວເຊີ (Chrome / Edge) ໄປທີ່:
   - **ໜ້າເວັບໄຊ້ໂຫວດ (Frontend):** `http://localhost:3000`
   - **ໜ້າຫຼັງບ້ານແອັດມິນ (Admin Backoffice):** `http://localhost:3000/admin` (ລະຫັດລັອກອິນທົດສອບ: `admin123`)

---

## 📂 ໂຄງສ້າງໄຟລ໌ສຳຄັນ (Project Structure)

- `src/lib/db.js`: ໄຟລ໌ຈັດການຖານຂໍ້ມູນ SQLite (`miss-hmong.sqlite`), ສ້າງຕາຕະລາງ `contestants`, `vote_packages`, `vote_transactions`, `settings` ພ້ອມຂໍ້ມູນຕົວຢ່າງ 8 ໝາຍເລກ (`MH01` - `MH08`).
- `src/app/page.jsx`: ໜ້າເວັບໄຊ້ຫຼັກສຳລັບຜູ້ຊົມ ປະກອບມີ Podium 3 ອັນດັບສູງສຸດ, ຄົ້ນຫາຕາມແຂວງ/ໝາຍເລກ, ໜ້າຕ່າງເລືອກແພັກເກັດຄະແນນ + QR Code ທະນາຄານ ແລະ ໃບຮັບເງິນດິຈິຕອນ.
- `src/app/admin/page.jsx`: ໜ້າຫຼັງບ້ານສຳລັບກອງປະກວດ ໃຊ້ກວດສອບເລກອ້າງອີງໃບບິນໂອນເງິນ (ກົດ **ອະນຸມັດ** ຫຼື **ປະຕິເສດ**), ເພີ່ມ/ແກ້ໄຂ/ລຶບຜູ້ເຂົ້າປະກວດ ແລະ ປັບລາຄາແພັກເກັດໂຫວດ.
- `src/app/api/state/route.js`: API ດຶງຂໍ້ມູນຄະແນນໂຫວດ ແລະ ສະຖິຕິແບບ Real-time.
- `src/app/api/vote/route.js`: API ຮັບຂໍ້ມູນການໂຫວດຈາກຜູ້ຊົມ.
- `src/app/api/admin/route.js`: API ສຳລັບຄຳສັ່ງຈັດການຫຼັງບ້ານທັງໝົດ.

