const fs = require('fs');
const path = require('path');

const pagePath = path.join(process.cwd(), 'src', 'app', 'page.jsx');
let content = fs.readFileSync(pagePath, 'utf8');

const startMarker = '{/* CLEAN, MINIMAL VOTING MODAL */}';
const startIdx = content.indexOf(startMarker);
const endMarker = 'function PodiumCard';
const endIdx = content.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find start or end marker. startIdx:", startIdx, "endIdx:", endIdx);
  process.exit(1);
}

// Find the last occurrence of "      )}" before endMarker
const sub = content.slice(startIdx, endIdx);
const modalCloseIdx = sub.lastIndexOf('      )}');
if (modalCloseIdx === -1) {
  console.error("Could not find modal closing tag");
  process.exit(1);
}

const replaceEnd = startIdx + modalCloseIdx + '      )}'.length;

const newModalJsx = `{/* ==================== MISS KHMU STYLE OFFICIAL PAGEANT VOTING MODAL ==================== */}
      {votingContestant && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-amber-300/40 my-6">
            {/* Pageant Luxury Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 logo-exact-bg text-white border-b border-amber-400/30">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={
                      costumeMode === "JEWELRY" && hasJewelryPhoto(votingContestant)
                        ? votingContestant.image_url
                        : (votingContestant.traditional_image_url || votingContestant.image_url)
                    }
                    alt={votingContestant.name}
                    onError={(e) => {
                      e.currentTarget.src = \`/api/avatar?code=\${votingContestant.code}&bg=garden&name=\${encodeURIComponent(votingContestant.nickname)}\`;
                    }}
                    className="w-12 h-12 rounded-xl object-cover object-top border-2 border-amber-300 shadow"
                  />
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-amber-400 text-[#240638] font-black text-[9px]">
                    {votingContestant.code}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-200 font-bold">
                      Miss Hmong Vientiane 2027
                    </span>
                    <span className="text-[11px] text-white/80 font-medium hidden sm:inline">
                      • {votingContestant.province}
                    </span>
                  </div>
                  <h3 className="font-black text-white text-base sm:text-lg">
                    {votingContestant.name} ({votingContestant.nickname})
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!voteReceipt && (
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs text-amber-200 font-bold border border-white/15">
                    <span>
                      {voteStep === 1
                        ? "ຂັ້ນຕອນ 1/2: ເລືອກແພັກເກັດ"
                        : "ຂັ້ນຕອນ 2/2: ຊຳລະ & ແນບໃບບິນ"}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => {
                    setVotingContestant(null);
                    setVoteReceipt(null);
                  }}
                  className="p-2 rounded-xl bg-white/15 text-white hover:bg-white/25 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {voteReceipt ? (
              /* ==================== STAGE 3: OFFICIAL DIGITAL PAGEANT RECEIPT ==================== */
              <div className="p-6 sm:p-8 space-y-5 text-[#240638] bg-gradient-to-b from-white to-[#faf5ff]">
                {/* Pageant Official 3 Logos Header */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 pb-4 border-b border-amber-300/40">
                  <img
                    src="/logo_phouvong.png"
                    alt="Phouvong Jewelry"
                    className="h-9 sm:h-11 object-contain drop-shadow-sm"
                  />
                  <div className="h-7 w-px bg-amber-300/60" />
                  <img
                    src="/logo_mhvt.png"
                    alt="MHVT 2027"
                    className="h-10 sm:h-12 object-contain drop-shadow-sm"
                  />
                  <div className="h-7 w-px bg-amber-300/60" />
                  <img
                    src="/logo_lao_ethnic_garden.png"
                    alt="Lao Ethnic Garden"
                    className="h-9 sm:h-11 object-contain drop-shadow-sm"
                  />
                </div>

                {/* Official Status Stamp Banner */}
                <div className="text-center space-y-1.5">
                  <div
                    className={\`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-black shadow-sm border \${
                      voteReceipt.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-amber-100 text-amber-900 border-amber-300"
                    }\`}
                  >
                    {voteReceipt.status === "APPROVED" ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>ອະນຸມັດແລ້ວ • APPROVED & RECORDED</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                        <span>ລໍຖ້າກວດສອບໃບບິນ • PENDING VERIFICATION</span>
                      </>
                    )}
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-[#240638] pt-1">
                    ໃບຢັ້ງຢືນການໂຫວດທາງການ (Official Vote Receipt)
                  </h4>
                  <p className="text-xs text-[#644180]">
                    {voteReceipt.status === "APPROVED"
                      ? "ຄະແນນໂຫວດຖືກເພີ່ມເຂົ້າສູ່ລະບົບຮຽບຮ້ອຍແລ້ວ! ຂອບໃຈທີ່ຮ່ວມເຊຍ ແລະ ສົ່ງແຮງໃຈໃຫ້ນາງສາວ"
                      : "ລະບົບໄດ້ຮັບໃບບິນໂອນເງິນຂອງທ່ານແລ້ວ ຄະນະກຳມະການກຳລັງກວດສອບ ແລະ ຈະອັບເດດຄະແນນໃຫ້ໄວທີ່ສຸດ"}
                  </p>
                </div>

                {/* Official Receipt Card Box */}
                <div className="bg-white border-2 border-[#9333ea]/20 rounded-2xl p-5 shadow-sm space-y-3.5 text-xs text-[#240638]">
                  {/* Contestant Highlight in Receipt */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f6effc] border border-[#9333ea]/20">
                    <img
                      src={
                        costumeMode === "JEWELRY" && hasJewelryPhoto(votingContestant)
                          ? votingContestant.image_url
                          : (votingContestant.traditional_image_url || votingContestant.image_url)
                      }
                      alt={votingContestant.name}
                      className="w-12 h-12 rounded-lg object-cover object-top border border-amber-400"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded logo-exact-bg text-white font-black text-[11px]">
                          {voteReceipt.contestant_code}
                        </span>
                        <span className="font-black text-sm text-[#240638]">
                          {voteReceipt.contestant_name}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#644180] mt-0.5">
                        ຜູ້ເຂົ້າປະກວດ Miss Hmong Vientiane 2027
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#644180] block">ຄະແນນທີ່ໂຫວດ</span>
                      <span className="text-base font-black text-[#520d7a]">
                        +{voteReceipt.points_added.toLocaleString()} Votes
                      </span>
                    </div>
                  </div>

                  {/* Transaction Key Details */}
                  <div className="divide-y divide-gray-100 space-y-2">
                    <div className="flex justify-between pt-2">
                      <span className="text-[#644180]">ເລກອ້າງອີງທຸລະກຳ (Ref No.):</span>
                      <span className="font-mono font-bold text-[#520d7a]">
                        {voteReceipt.payment_ref}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-[#644180]">ຍອດເງິນຊຳລະ (Amount):</span>
                      <span className="font-black text-sm text-[#240638]">
                        {formatPrice(voteReceipt.amount_lak)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-[#644180]">ຊື່ຜູ້ໂຫວດ:</span>
                      <span className="font-bold">
                        {voteReceipt.voter_name || "ຜູ້ສະໜັບສະໜູນ ສວນບັນດາເຜົ່າ"}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-[#644180]">ວັນທີ & ເວລາ:</span>
                      <span className="font-mono text-[11px] text-[#644180]">
                        {voteReceipt.created_at}
                      </span>
                    </div>
                    {voteReceipt.cheer_message && (
                      <div className="pt-2">
                        <span className="text-[#644180] block mb-0.5">ຂໍ້ຄວາມເຊຍ:</span>
                        <p className="italic text-[#520d7a] bg-[#faf5ff] p-2 rounded-lg border border-[#e9d5ff]">
                          &ldquo;{voteReceipt.cheer_message}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Uploaded Slip Confirmation Preview if available */}
                  {voteReceipt.slip_image_url && (
                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-[11px] font-bold text-[#644180] block mb-1.5">
                        ຫຼັກຖານໃບບິນໂອນເງິນທີ່ແນບ (Attached Slip):
                      </span>
                      <div className="w-24 h-24 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img
                          src={voteReceipt.slip_image_url}
                          alt="Attached Slip"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Note & Actions */}
                <p className="text-[11px] text-center text-[#644180]">
                  💡 ທ່ານສາມາດແຄັບໜ້າຈໍໃບຮັບເງິນນີ້ໄວ້ເປັນຫຼັກຖານການໂຫວດໄດ້
                </p>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setVotingContestant(null);
                      setVoteReceipt(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition cursor-pointer"
                  >
                    ປິດໜ້າຕ່າງ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVoteReceipt(null);
                      setVoteStep(1);
                      setSlipPreview(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-black btn-garden-vote shadow-md cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>ໂຫວດເພີ່ມໃຫ້ນາງສາວອີກ</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 sm:p-6 space-y-5 text-[#240638]">
                {voteStep === 1 ? (
                  /* ==================== STEP 1: CHOOSE PACKAGE ==================== */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-extrabold text-[#240638]">
                          1. ເລືອກແພັກເກັດຄະແນນໂຫວດ (Vote Packages)
                        </h4>
                        <p className="text-xs text-[#644180]">
                          ເລືອກແພັກເກັດທີ່ຕ້ອງການເພື່ອສົ່ງແຮງໃຈໃຫ້ {votingContestant.name}
                        </p>
                      </div>
                      <div className="inline-flex rounded-xl bg-gray-100 p-1 text-[11px] border border-gray-200">
                        {["LAK", "THB", "USD"].map((cur) => (
                          <button
                            key={cur}
                            type="button"
                            onClick={() => setCurrency(cur)}
                            className={\`px-3 py-1 rounded-lg font-bold transition cursor-pointer \${
                              currency === cur
                                ? "bg-[#7e1db3] text-white shadow-xs"
                                : "text-gray-600 hover:text-black"
                            }\`}
                          >
                            {cur}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Package Grid 4x2 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                      {packages.map((pkg) => {
                        const isSelected = selectedPkg?.id === pkg.id;
                        const isPopular = pkg.points === 20;
                        const isVip = pkg.points === 2500 || pkg.points === 1000;
                        return (
                          <button
                            key={pkg.id}
                            type="button"
                            onClick={() => setSelectedPkg(pkg)}
                            className={\`relative p-3.5 rounded-2xl border text-center transition cursor-pointer flex flex-col justify-between \${
                              isSelected
                                ? "bg-[#f5edfc] border-2 border-[#7e1db3] shadow-md ring-2 ring-[#7e1db3]/20"
                                : "bg-white border-gray-200 hover:border-[#a855f7] hover:bg-gray-50/50"
                            }\`}
                          >
                            {isPopular && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#7e1db3] text-white text-[9px] font-black uppercase tracking-wider shadow">
                                ຍອດນິຍົມ
                              </span>
                            )}
                            {isVip && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-400 text-[#240638] text-[9px] font-black uppercase tracking-wider shadow">
                                VIP
                              </span>
                            )}
                            <div className="pt-1">
                              <div className="text-xl sm:text-2xl font-black text-[#240638]">
                                +{pkg.points.toLocaleString()}
                              </div>
                              <div className="text-[11px] font-bold text-[#644180]">
                                {pkg.points === 1 ? "Vote" : "Votes"}
                              </div>
                            </div>
                            <div className="text-xs font-black text-[#6b1699] mt-2 pt-2 border-t border-gray-100">
                              {formatPrice(pkg.price_lak)}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected Summary & Next Button */}
                    <div className="p-4 rounded-2xl bg-[#f6effc] border border-[#9333ea]/25 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                      <div>
                        <span className="text-xs text-[#644180] block">ແພັກເກັດທີ່ເລືອກ:</span>
                        <div className="text-sm font-black text-[#240638] flex items-center gap-2">
                          <span className="text-[#6b1699]">
                            +{selectedPkg?.points.toLocaleString()} Votes
                          </span>
                          <span>•</span>
                          <span>{selectedPkg ? formatPrice(selectedPkg.price_lak) : ""}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setVoteStep(2)}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs btn-garden-vote flex items-center justify-center gap-2 shadow-md cursor-pointer"
                      >
                        <span>ຕໍ່ໄປ: ຂັ້ນຕອນຊຳລະເງິນ & ແນບໃບບິນ</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ==================== STEP 2: BANK TRANSFER & SLIP UPLOAD ==================== */
                  <div className="space-y-4">
                    {/* Back to Step 1 Bar */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <button
                        type="button"
                        onClick={() => setVoteStep(1)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b1699] hover:text-[#520d7a] cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>ປ່ຽນແພັກເກັດໂຫວດ</span>
                      </button>
                      <div className="px-3 py-1 rounded-full bg-[#f3ebfa] text-[#520d7a] font-black text-xs border border-[#9333ea]/20">
                        +{selectedPkg?.points.toLocaleString()} Votes •{" "}
                        {selectedPkg ? formatPrice(selectedPkg.price_lak) : ""}
                      </div>
                    </div>

                    {/* 2-Column Grid: Left Bank & QR / Right Slip & Voter Info */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                      {/* Left: Official Bank QR & Account Details */}
                      <div className="md:col-span-5 bg-gradient-to-b from-gray-50 to-[#faf6fd] rounded-2xl p-4 border border-gray-200 text-center space-y-3">
                        {/* Bank Tab Switcher */}
                        <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-xl border border-gray-200">
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentMethod("BCEL");
                              setPaymentRef(
                                \`BCEL-\${Math.floor(100000 + Math.random() * 900000)}\`
                              );
                            }}
                            className={\`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer \${
                              paymentMethod === "BCEL"
                                ? "bg-red-600 text-white shadow-xs"
                                : "text-gray-600 hover:text-black"
                            }\`}
                          >
                            BCEL OnePay
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentMethod("LAPNET");
                              setPaymentRef(
                                \`APB-\${Math.floor(100000 + Math.random() * 900000)}\`
                              );
                            }}
                            className={\`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer \${
                              paymentMethod === "LAPNET"
                                ? "bg-[#520d7a] text-white shadow-xs"
                                : "text-gray-600 hover:text-black"
                            }\`}
                          >
                            APB / LAPNet
                          </button>
                        </div>

                        {/* QR Display Card */}
                        <div className="bg-white border-2 border-[#9333ea]/25 rounded-2xl p-3 shadow-xs flex flex-col items-center">
                          <div className="text-[10px] font-black tracking-wider uppercase text-gray-500 mb-1">
                            {paymentMethod === "BCEL"
                              ? "BCEL OnePay Lao QR"
                              : "APB LAPNet Lao QR"}
                          </div>
                          <div className="w-36 h-36 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center p-2">
                            <QrCode className="w-24 h-24 text-[#240638]" />
                            <span className="text-[10px] font-extrabold text-[#520d7a] mt-0.5">
                              ໂຫວດ {votingContestant.code}
                            </span>
                          </div>
                          <div className="mt-2 text-sm font-black text-[#240638]">
                            ຍອດໂອນ: {selectedPkg ? formatPrice(selectedPkg.price_lak) : ""}
                          </div>
                        </div>

                        {/* Account Name & Number with Copy Button */}
                        <div className="bg-white rounded-xl p-3 border border-gray-200 text-left text-xs space-y-1.5">
                          <div>
                            <span className="text-[10px] text-gray-500 block">
                              ຊື່ບັນຊີ (Account Name):
                            </span>
                            <span className="font-extrabold text-[#240638] text-[11px] leading-tight block">
                              ໂຄງການ ສວນບັນດາເຜົ່າ & ຮ້ານຄຳພູວົງ
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono block">
                              LAO ETHNIC GARDEN / PHOUVONG JEWELRY
                            </span>
                          </div>
                          <div className="pt-1 border-t border-gray-100 flex items-center justify-between gap-1">
                            <div>
                              <span className="text-[10px] text-gray-500 block">
                                ເລກບັນຊີ (Acc No.):
                              </span>
                              <span className="font-mono font-black text-[#520d7a] text-xs">
                                {paymentMethod === "BCEL"
                                  ? "160-12-00-01234567-001"
                                  : "010-11-00-07654321-001"}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyBank(
                                  paymentMethod === "BCEL"
                                    ? "160120001234567001"
                                    : "010110007654321001"
                                )
                              }
                              className={\`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer \${
                                copiedBank
                                  ? "bg-emerald-600 text-white shadow-xs"
                                  : "bg-[#f3ebfa] hover:bg-[#e9d5ff] text-[#520d7a]"
                              }\`}
                              title="ຄັດລອກເລກບັນຊີ"
                            >
                              {copiedBank ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>ຄັດລອກແລ້ວ!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>ຄັດລອກ</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="text-[10px] text-[#644180] pt-1">
                            ໝາຍເຫດໂອນ:{" "}
                            <strong className="text-[#240638]">
                              ໂຫວດ {votingContestant.code}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Right: Slip Upload & Supporter Form */}
                      <div className="md:col-span-7 space-y-3.5">
                        {/* Slip Upload Zone */}
                        <div>
                          <label className="block text-xs text-[#240638] font-extrabold mb-1.5">
                            ແນບຮູບໃບບິນໂອນເງິນ (Bank Slip) <span className="text-red-500">*</span>
                          </label>

                          {slipPreview ? (
                            <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/50 p-3 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={slipPreview}
                                  alt="Slip Preview"
                                  className="w-14 h-14 rounded-xl object-cover border border-emerald-300 shadow-xs"
                                />
                                <div>
                                  <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-800">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    ແນບໃບບິນສຳເລັດແລ້ວ
                                  </span>
                                  <span className="text-[11px] text-gray-500 block">
                                    ຮູບໃບບິນພ້ອມສົ່ງໃຫ້ກວດສອບ
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <label className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs">
                                  ປ່ຽນຮູບ
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleSlipUpload}
                                    className="hidden"
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setSlipPreview(null)}
                                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                                  title="ລຶບຮູບ"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="border-2 border-dashed border-[#a855f7]/40 hover:border-[#7e1db3] bg-[#faf6fe] hover:bg-[#f6effc] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition text-center group">
                              <Upload className="w-6 h-6 text-[#7e1db3] group-hover:-translate-y-0.5 transition" />
                              <span className="text-xs font-bold text-[#240638] mt-1.5">
                                ກົດເພື່ອແນບຮູບໃບບິນໂອນເງິນ (Upload Slip)
                              </span>
                              <span className="text-[10px] text-[#644180] mt-0.5">
                                ຮອງຮັບຮູບໃບບິນ BCEL One / ທະນາຄານ (PNG, JPG, JPEG)
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleSlipUpload}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>

                        {/* Voter Name & Phone in 2 cols */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-700 font-bold mb-1">
                              ຊື່ຜູ້ໂຫວດ / ທີມເຊຍ
                            </label>
                            <div className="relative">
                              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                value={voterName}
                                onChange={(e) => setVoterName(e.target.value)}
                                placeholder="ຊື່ຂອງທ່ານ (ຫຼື ປະຫວ່າງ)..."
                                className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-[#240638] focus:bg-white focus:outline-none focus:border-[#7e1db3]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs text-gray-700 font-bold mb-1">
                              ເບີໂທ / WhatsApp
                            </label>
                            <div className="relative">
                              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="tel"
                                value={voterPhone}
                                onChange={(e) => setVoterPhone(e.target.value)}
                                placeholder="020 xxxx xxxx"
                                className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-[#240638] focus:bg-white focus:outline-none focus:border-[#7e1db3]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Cheer message */}
                        <div>
                          <label className="block text-xs text-gray-700 font-bold mb-1">
                            ຄຳອວຍພອນ / ຂໍ້ຄວາມເຊຍ
                          </label>
                          <input
                            type="text"
                            value={cheerMessage}
                            onChange={(e) => setCheerMessage(e.target.value)}
                            placeholder="ຝາກຂໍ້ຄວາມສົ່ງແຮງໃຈ..."
                            className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-[#240638] focus:bg-white focus:outline-none focus:border-[#7e1db3]"
                          />
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {CHEER_PRESETS.map((msg, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setCheerMessage(msg)}
                                className={\`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition cursor-pointer \${
                                  cheerMessage === msg
                                    ? "bg-[#f3ebfa] border-[#7e1db3] text-[#520d7a] font-bold"
                                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                                }\`}
                              >
                                {msg}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2 space-y-2">
                          <button
                            type="button"
                            disabled={submittingVote}
                            onClick={() => handleVoteSubmit(false)}
                            className="w-full py-3.5 px-5 rounded-xl font-black text-sm flex items-center justify-center gap-2 btn-garden-vote shadow-md cursor-pointer transition"
                          >
                            {submittingVote ? (
                              <span>ກຳລັງສົ່ງໃບບິນໂຫວດ...</span>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>
                                  ຢືນຢັນການໂອນເງິນ & ສົ່ງໃບບິນ (+{selectedPkg?.points.toLocaleString()} Votes)
                                </span>
                              </>
                            )}
                          </button>

                          {/* Secondary instant demo button for convenience */}
                          <div className="text-center pt-1">
                            <button
                              type="button"
                              disabled={submittingVote}
                              onClick={() => handleVoteSubmit(true)}
                              className="text-[11px] text-[#644180] hover:text-[#520d7a] underline cursor-pointer"
                            >
                              ⚡ ທົດສອບໂຫວດອະນຸມັດທັນທີ (Instant Approval Demo)
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}`;

const updatedContent = content.slice(0, startIdx) + newModalJsx + content.slice(replaceEnd);
fs.writeFileSync(pagePath, updatedContent, 'utf8');
console.log("Successfully replaced Voting Modal with Miss Khmu style modal in src/app/page.jsx!");
