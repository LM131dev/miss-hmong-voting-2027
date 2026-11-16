const fs = require('fs');
const path = require('path');

const adminPath = path.join(process.cwd(), 'src', 'app', 'admin', 'page.jsx');
let content = fs.readFileSync(adminPath, 'utf8');

// 1. Add ImageIcon import if missing
if (!content.includes('Image as ImageIcon,')) {
  content = content.replace(
    '  ExternalLink,\n',
    '  ExternalLink,\n  Image as ImageIcon,\n'
  );
}

// 2. Add viewingSlip state
if (!content.includes('const [viewingSlip, setViewingSlip] = useState(null);')) {
  content = content.replace(
    '  const [editingSponsor, setEditingSponsor] = useState(null);',
    '  const [editingSponsor, setEditingSponsor] = useState(null);\n  const [viewingSlip, setViewingSlip] = useState(null);'
  );
}

// 3. Update table headers to include Slip column
const oldHeader = `<th className="py-3.5 px-4 whitespace-nowrap min-w-[130px] text-right">ຈຳນວນເງິນ</th>
                        <th className="py-3.5 px-4 whitespace-nowrap min-w-[220px]">ຂໍ້ຄວາມເຊຍ</th>`;

const newHeader = `<th className="py-3.5 px-4 whitespace-nowrap min-w-[130px] text-right">ຈຳນວນເງິນ</th>
                        <th className="py-3.5 px-4 whitespace-nowrap min-w-[110px] text-center">ໃບບິນ (Slip)</th>
                        <th className="py-3.5 px-4 whitespace-nowrap min-w-[220px]">ຂໍ້ຄວາມເຊຍ</th>`;

if (content.includes(oldHeader)) {
  content = content.replace(oldHeader, newHeader);
}

// 4. Update table row to include Slip cell
const oldRow = `{/* 6. Amount LAK */}
                          <td className="py-3.5 px-4 font-black text-[#240638] whitespace-nowrap text-right text-sm">
                            {tx.amount_lak.toLocaleString()} <span className="text-xs font-normal">₭</span>
                          </td>

                          {/* 7. Cheer Message */}`;

const newRow = `{/* 6. Amount LAK */}
                          <td className="py-3.5 px-4 font-black text-[#240638] whitespace-nowrap text-right text-sm">
                            {tx.amount_lak.toLocaleString()} <span className="text-xs font-normal">₭</span>
                          </td>

                          {/* 6.5 Slip Column */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            {tx.slip_image_url ? (
                              <button
                                onClick={() => setViewingSlip(tx)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#f3ebfa] hover:bg-[#e9d5ff] text-[#6b1699] font-bold text-xs cursor-pointer border border-[#c084fc]/50 transition shadow-xs"
                                title="ກວດສອບຮູບໃບບິນໂອນເງິນ"
                              >
                                <ImageIcon className="w-3.5 h-3.5" />
                                <span>ເບິ່ງໃບບິນ</span>
                              </button>
                            ) : (
                              <span className="text-[#9ca3af] text-[11px] font-mono">ບໍ່ມີໃບບິນ</span>
                            )}
                          </td>

                          {/* 7. Cheer Message */}`;

if (content.includes(oldRow)) {
  content = content.replace(oldRow, newRow);
}

// 5. Add viewingSlip Modal before quickVoteTarget modal
const modalMarker = '{/* ==================== MODAL: QUICK VOTE BOOST ==================== */}';
const slipModalCode = `{/* ==================== MODAL: VIEW BANK SLIP ==================== */}
      {viewingSlip && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 my-6">
            <div className="flex items-center justify-between px-6 py-4 bg-[#240638] text-white">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-300" />
                <h3 className="font-black text-base">ກວດສອບໃບບິນໂອນເງິນ (Bank Slip)</h3>
              </div>
              <button
                onClick={() => setViewingSlip(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Full Image Preview */}
              <div className="rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center max-h-[420px]">
                <img
                  src={viewingSlip.slip_image_url}
                  alt="Bank Slip"
                  className="w-full h-full object-contain max-h-[400px]"
                />
              </div>

              {/* Transaction Summary Card */}
              <div className="bg-[#fcfaff] border border-[#9333ea]/20 rounded-2xl p-4 text-xs space-y-2 text-[#240638]">
                <div className="flex justify-between">
                  <span className="text-[#644180]">ເລກອ້າງອີງທຸລະກຳ:</span>
                  <span className="font-mono font-bold text-[#520d7a]">{viewingSlip.payment_ref}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#644180]">ຜູ້ໂອນ:</span>
                  <span className="font-bold">{viewingSlip.voter_name} ({viewingSlip.voter_phone || "-"})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#644180]">ໂຫວດໃຫ້ນາງສາວ:</span>
                  <span className="font-bold logo-exact-bg text-white px-2 py-0.5 rounded text-[11px]">
                    {viewingSlip.contestant_code} • {viewingSlip.contestant_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#644180]">ຄະແນນທີ່ຈະເພີ່ມ:</span>
                  <span className="font-black text-[#520d7a] text-sm">+{viewingSlip.points_added.toLocaleString()} Votes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#644180]">ຍອດເງິນທີ່ໂອນ:</span>
                  <span className="font-black text-[#240638] text-sm">{viewingSlip.amount_lak.toLocaleString()} ກີບ</span>
                </div>
                {viewingSlip.cheer_message && (
                  <div className="pt-1 border-t border-gray-100 text-[#644180] italic">
                    &ldquo;{viewingSlip.cheer_message}&rdquo;
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                {viewingSlip.status !== "APPROVED" && (
                  <button
                    onClick={async () => {
                      await callAdminApi("APPROVE_TX", { id: viewingSlip.id });
                      setViewingSlip(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ອະນຸມັດ ແລະ ເພີ່ມຄະແນນ</span>
                  </button>
                )}
                {viewingSlip.status !== "REJECTED" && (
                  <button
                    onClick={async () => {
                      await callAdminApi("REJECT_TX", { id: viewingSlip.id });
                      setViewingSlip(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs cursor-pointer"
                  >
                    ປະຕິເສດ
                  </button>
                )}
                <button
                  onClick={() => setViewingSlip(null)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer"
                >
                  ປິດ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      `;

if (content.includes(modalMarker) && !content.includes('MODAL: VIEW BANK SLIP')) {
  content = content.replace(modalMarker, slipModalCode + modalMarker);
}

fs.writeFileSync(adminPath, content, 'utf8');
console.log("Successfully updated admin page with slip column and slip inspection modal!");
