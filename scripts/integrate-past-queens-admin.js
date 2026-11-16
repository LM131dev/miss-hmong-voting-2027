const fs = require('fs');
const path = require('path');

const adminPath = path.join(process.cwd(), 'src', 'app', 'admin', 'page.jsx');
let content = fs.readFileSync(adminPath, 'utf8');

// 1. Add state variable
if (!content.includes('const [pastQueens, setPastQueens] = useState([]);')) {
  content = content.replace(
    '  const [committee, setCommittee] = useState([]);',
    '  const [pastQueens, setPastQueens] = useState([]);\n  const [committee, setCommittee] = useState([]);'
  );
}

// 2. Add editingPastQueen state
if (!content.includes('const [editingPastQueen, setEditingPastQueen] = useState(null);')) {
  content = content.replace(
    '  const [editingCommittee, setEditingCommittee] = useState(null);',
    '  const [editingPastQueen, setEditingPastQueen] = useState(null);\n  const [editingCommittee, setEditingCommittee] = useState(null);'
  );
}

// 3. Add to loadData
if (!content.includes('setPastQueens(data.past_queens || []);')) {
  content = content.replace(
    '      if (data.contestants) {',
    '      if (data.contestants) {\n        setPastQueens(data.past_queens || []);'
  );
}

// 4. Add to menuSections
const oldMenuCandidate = `        {
          id: "packages",
          label: "3. ແພັກເກັດຄະແນນໂຫວດ",
          badge: \`\${packages.length}\`,
          badgeColor: "bg-white/20 text-white",
          icon: Gem,
        },`;

const newMenuWithQueens = `        {
          id: "packages",
          label: "3. ແພັກເກັດຄະແນນໂຫວດ",
          badge: \`\${packages.length}\`,
          badgeColor: "bg-white/20 text-white",
          icon: Gem,
        },
        {
          id: "past_queens",
          label: "4. ອະດີດນາງສາວ (Hall of Fame)",
          badge: \`\${pastQueens.length}\`,
          badgeColor: "bg-amber-400 text-[#240638]",
          icon: Crown,
        },`;

if (content.includes(oldMenuCandidate) && !content.includes('id: "past_queens"')) {
  content = content.replace(oldMenuCandidate, newMenuWithQueens);
}

// 5. Add to top header title
const oldHeaderTitle = `{activeTab === "packages" && "3. ຈັດການແພັກເກັດຄະແນນໂຫວດ"}`;
const newHeaderTitle = `{activeTab === "packages" && "3. ຈັດການແພັກເກັດຄະແນນໂຫວດ"}
                    {activeTab === "past_queens" && "4. ຈັດການອະດີດນາງສາວ (Hall of Fame 2019 - 2026)"}`;

if (content.includes(oldHeaderTitle) && !content.includes('activeTab === "past_queens" && "4.')) {
  content = content.replace(oldHeaderTitle, newHeaderTitle);
}

// 6. Add activeTab === "past_queens" content before committee tab
const committeeTabMarker = `{/* ==================== TAB 4: COMMITTEE ==================== */}`;
const pastQueensTabJsx = `{/* ==================== TAB: PAST QUEENS (HALL OF FAME) ==================== */}
          {activeTab === "past_queens" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-[#240638]">
                    ອະດີດນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ (Hall of Fame)
                  </h2>
                  <p className="text-xs text-[#644180]">
                    ຈັດການລາຍຊື່, ປີ, ຮູບພາບ, ຕຳແໜ່ງ ແລະ ຜົນງານຂອງອະດີດນາງສາວແຕ່ລະປີ (2019 - 2026)
                  </p>
                </div>

                <button
                  onClick={() =>
                    setEditingPastQueen({
                      year: "2027",
                      name: "",
                      title: "ນາງສາວເຜົ່າມົ້ງນະຄອນຫລວງວຽງຈັນ",
                      badge: "",
                      image_url: "/api/avatar?code=2027&bg=gold&name=Queen",
                      bio: "",
                      order_no: pastQueens.length + 1,
                    })
                  }
                  className="px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 btn-garden-vote cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>ເພີ່ມອະດີດນາງສາວ</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pastQueens.map((q) => (
                  <div
                    key={q.id}
                    className="rounded-3xl bg-white border border-[#9333ea]/25 overflow-hidden shadow-sm p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-[#240638] font-black text-xs shadow-xs">
                          👑 ປີ {q.year}
                        </span>
                        <span className="text-[11px] font-mono text-[#644180]">
                          ລຳດັບ: #{q.order_no}
                        </span>
                      </div>

                      <div className="w-24 h-24 mx-auto mb-3 relative">
                        <img
                          src={q.image_url}
                          alt={q.name}
                          onError={(e) => {
                            e.currentTarget.src = \`/api/avatar?code=\${q.year}&bg=gold&name=\${encodeURIComponent(q.name)}\`;
                          }}
                          className="w-full h-full object-cover rounded-full border-2 border-amber-400 shadow-xs"
                        />
                      </div>

                      <h3 className="font-black text-sm text-[#240638] text-center">
                        {q.name}
                      </h3>
                      <p className="text-[11px] text-[#6b1699] font-bold text-center mt-0.5">
                        {q.title}
                      </p>

                      {q.badge && (
                        <div className="text-center mt-2">
                          <span className="inline-block px-2 py-0.5 rounded bg-purple-100 text-[#520d7a] font-bold text-[10px]">
                            ✨ {q.badge}
                          </span>
                        </div>
                      )}

                      <p className="text-xs text-[#644180] mt-3 line-clamp-2 leading-relaxed bg-[#fbf8fd] p-2 rounded-xl">
                        {q.bio || "—"}
                      </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-gray-100">
                      <button
                        onClick={() => setEditingPastQueen({ ...q })}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#f3ebfa] text-[#520d7a] font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>ແກ້ໄຂ</span>
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(\`ຕ້ອງການລຶບຂໍ້ມູນອະດີດນາງສາວປີ \${q.year} ແທ້ບໍ່?\`)) {
                            await callAdminApi("DELETE_PAST_QUEEN", { id: q.id });
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="ລຶບ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          `;

if (content.includes(committeeTabMarker) && !content.includes('TAB: PAST QUEENS')) {
  content = content.replace(committeeTabMarker, pastQueensTabJsx + committeeTabMarker);
}

// 7. Add Modal for editingPastQueen before committee modal
const committeeModalMarker = `{/* ==================== MODAL: EDIT COMMITTEE ==================== */}`;
const editPastQueenModalJsx = `{/* ==================== MODAL: EDIT PAST QUEEN ==================== */}
      {editingPastQueen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 text-xs shadow-2xl border border-gray-200 my-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-black text-sm text-[#240638]">
                {editingPastQueen.id ? "ແກ້ໄຂຂໍ້ມູນອະດີດນາງສາວ" : "ເພີ່ມຂໍ້ມູນອະດີດນາງສາວ"}
              </h3>
              <button
                onClick={() => setEditingPastQueen(null)}
                className="text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#644180] font-semibold mb-1">
                  ປີທີ່ໄດ້ມົງກຸດ (Year)
                </label>
                <input
                  type="text"
                  value={editingPastQueen.year || ""}
                  onChange={(e) =>
                    setEditingPastQueen({ ...editingPastQueen, year: e.target.value })
                  }
                  placeholder="ເຊັ່ນ: 2020"
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638] font-bold"
                />
              </div>

              <div>
                <label className="block text-[#644180] font-semibold mb-1">
                  ລຳດັບສະແດງ (Order No)
                </label>
                <input
                  type="number"
                  value={editingPastQueen.order_no || 0}
                  onChange={(e) =>
                    setEditingPastQueen({
                      ...editingPastQueen,
                      order_no: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#644180] font-semibold mb-1">
                ຊື່ ແລະ ນາມສະກຸນ
              </label>
              <input
                type="text"
                value={editingPastQueen.name || ""}
                onChange={(e) =>
                  setEditingPastQueen({ ...editingPastQueen, name: e.target.value })
                }
                placeholder="ເຊັ່ນ: ທ່ານ ນາງ ປ່າເຢັ່ງຊາ ລໍ່"
                className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638] font-bold"
              />
            </div>

            <div>
              <label className="block text-[#644180] font-semibold mb-1">
                ຕຳແໜ່ງທາງການ
              </label>
              <input
                type="text"
                value={editingPastQueen.title || ""}
                onChange={(e) =>
                  setEditingPastQueen({ ...editingPastQueen, title: e.target.value })
                }
                placeholder="ເຊັ່ນ: ນາງສາວເຜົ່າມົ້ງນະຄອນຫລວງວຽງຈັນ 2020"
                className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638]"
              />
            </div>

            <div>
              <label className="block text-[#644180] font-semibold mb-1">
                Badge ຜົນງານໂດດເດັ່ນ (Highlight)
              </label>
              <input
                type="text"
                value={editingPastQueen.badge || ""}
                onChange={(e) =>
                  setEditingPastQueen({ ...editingPastQueen, badge: e.target.value })
                }
                placeholder="ເຊັ່ນ: Miss Universe Laos 2022 • Top 16 MU"
                className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638]"
              />
            </div>

            <div>
              <label className="block text-[#644180] font-semibold mb-1">
                ລິ້ງຮູບພາບ (Image URL)
              </label>
              <input
                type="text"
                value={editingPastQueen.image_url || ""}
                onChange={(e) =>
                  setEditingPastQueen({ ...editingPastQueen, image_url: e.target.value })
                }
                placeholder="/api/avatar?code=2020&bg=purple..."
                className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638]"
              />
            </div>

            <div>
              <label className="block text-[#644180] font-semibold mb-1">
                ປະຫວັດຫຍໍ້ & ຜົນງານ (Bio)
              </label>
              <textarea
                rows={3}
                value={editingPastQueen.bio || ""}
                onChange={(e) =>
                  setEditingPastQueen({ ...editingPastQueen, bio: e.target.value })
                }
                placeholder="ລາຍລະອຽດຜົນງານ..."
                className="w-full px-3 py-2 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-[#240638]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => setEditingPastQueen(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold cursor-pointer"
              >
                ຍົກເລີກ
              </button>
              <button
                onClick={async () => {
                  const ok = await callAdminApi("SAVE_PAST_QUEEN", editingPastQueen);
                  if (ok) setEditingPastQueen(null);
                }}
                className="px-5 py-2 rounded-xl font-black btn-garden-vote cursor-pointer"
              >
                ບັນທຶກຂໍ້ມູນ
              </button>
            </div>
          </div>
        </div>
      )}

      `;

if (content.includes(committeeModalMarker) && !content.includes('MODAL: EDIT PAST QUEEN')) {
  content = content.replace(committeeModalMarker, editPastQueenModalJsx + committeeModalMarker);
}

fs.writeFileSync(adminPath, content, 'utf8');
console.log("Successfully integrated Past Queens into admin/page.jsx!");
