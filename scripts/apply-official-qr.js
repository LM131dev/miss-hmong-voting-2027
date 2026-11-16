const fs = require('fs');
const path = require('path');

// 1. Update src/app/page.jsx to display the official Lao QR image
const pagePath = path.join(process.cwd(), 'src', 'app', 'page.jsx');
let pageContent = fs.readFileSync(pagePath, 'utf8');

const oldQrBlock = `<div className="w-36 h-36 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center p-2">
                            <QrCode className="w-24 h-24 text-[#240638]" />
                            <span className="text-[10px] font-extrabold text-[#520d7a] mt-0.5">
                              ໂຫວດ {votingContestant.code}
                            </span>
                          </div>
                          <div className="mt-2 text-sm font-black text-[#240638]">
                            ຍອດໂອນ: {selectedPkg ? formatPrice(selectedPkg.price_lak) : ""}
                          </div>`;

const newQrBlock = `<div className="w-44 h-44 bg-white border-2 border-[#9333ea]/30 rounded-2xl p-2 shadow-xs flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-white to-[#faf5ff]">
                            <img
                              src="/official_lao_qr.png"
                              alt="Official Lao QR Code"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="mt-2 text-center">
                            <div className="text-sm font-black text-[#240638]">
                              ຍອດໂອນ: {selectedPkg ? formatPrice(selectedPkg.price_lak) : ""}
                            </div>
                            <span className="text-[10px] text-[#644180] font-bold block mt-0.5">
                              ສະແກນໄດ້ທຸກແອັບທະນາຄານໃນລາວ (Lao QR)
                            </span>
                          </div>`;

if (pageContent.includes(oldQrBlock)) {
  pageContent = pageContent.replace(oldQrBlock, newQrBlock);
  fs.writeFileSync(pagePath, pageContent, 'utf8');
  console.log("Updated page.jsx with official Lao QR code!");
} else {
  console.log("Could not find exact old QR block in page.jsx, searching for alternative...");
  const altOld = `<QrCode className="w-24 h-24 text-[#240638]" />`;
  if (pageContent.includes(altOld)) {
    pageContent = pageContent.replace(
      altOld,
      `<img src="/official_lao_qr.png" alt="Official Lao QR Code" className="w-28 h-28 object-contain" />`
    );
    fs.writeFileSync(pagePath, pageContent, 'utf8');
    console.log("Replaced QrCode icon with official Lao QR image in page.jsx!");
  }
}

// 2. Update admin/page.jsx to show Official Lao QR card in Settings
const adminPath = path.join(process.cwd(), 'src', 'app', 'admin', 'page.jsx');
let adminContent = fs.readFileSync(adminPath, 'utf8');

const oldSettingsBankBlock = `<div>
                    <label className="block font-bold text-[#644180] mb-1">
                      ຂໍ້ມູນບັນຊີທະນາຄານ (ສະແດງກ້ອງ QR Code)
                    </label>
                    <input
                      type="text"
                      value={settings.bank_info || ""}
                      onChange={(e) => setSettings({ ...settings, bank_info: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-sm text-[#240638]"
                    />
                  </div>`;

const newSettingsBankBlock = `<div>
                    <label className="block font-bold text-[#644180] mb-1">
                      ຂໍ້ມູນບັນຊີທະນາຄານ (ສະແດງກ້ອງ QR Code)
                    </label>
                    <input
                      type="text"
                      value={settings.bank_info || ""}
                      onChange={(e) => setSettings({ ...settings, bank_info: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#f6effc] border border-[#9333ea]/30 text-sm text-[#240638]"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-[#f6effc] border border-[#9333ea]/25 flex items-center gap-4">
                    <div className="w-20 h-20 bg-white border border-[#9333ea]/30 rounded-xl p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                      <img
                        src="/official_lao_qr.png"
                        alt="Official Lao QR"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-black">
                        ✓ ໃຊ້ງານ Lao QR ທາງການຂອງກອງປະກວດ
                      </div>
                      <h4 className="font-black text-sm text-[#240638] mt-1">
                        Official Lao QR Code (BCEL One / APB / ທຸກທະນາຄານ)
                      </h4>
                      <p className="text-xs text-[#644180] mt-0.5">
                        ໄຟລ໌: public/official_lao_qr.png ຖືກເຊື່ອມຕໍ່ເຂົ້າສູ່ໜ້າຕ່າງໂຫວດຂອງເວັບໄຊທຸກຈຸດຮຽບຮ້ອຍແລ້ວ
                      </p>
                    </div>
                  </div>`;

if (adminContent.includes(oldSettingsBankBlock)) {
  adminContent = adminContent.replace(oldSettingsBankBlock, newSettingsBankBlock);
  fs.writeFileSync(adminPath, adminContent, 'utf8');
  console.log("Updated admin settings tab with Official Lao QR preview!");
}
