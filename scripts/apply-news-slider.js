const fs = require('fs');
const path = require('path');

const pagePath = path.join(process.cwd(), 'src', 'app', 'page.jsx');
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Add state variables if not present
if (!content.includes('const [selectedNewsDetail, setSelectedNewsDetail] = useState(null);')) {
  content = content.replace(
    '  const [newsList, setNewsList] = useState(NEWS_ITEMS);',
    `  const [newsList, setNewsList] = useState(NEWS_ITEMS);
  const [selectedNewsDetail, setSelectedNewsDetail] = useState(null);
  const newsSliderRef = React.useRef(null);
  const [canScrollNewsLeft, setCanScrollNewsLeft] = useState(false);
  const [canScrollNewsRight, setCanScrollNewsRight] = useState(true);

  const scrollNews = (direction) => {
    if (newsSliderRef.current) {
      const container = newsSliderRef.current;
      const cardWidth = container.offsetWidth > 1024 ? container.offsetWidth / 3 : container.offsetWidth > 640 ? container.offsetWidth / 2 : container.offsetWidth * 0.85;
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleNewsScroll = () => {
    if (newsSliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = newsSliderRef.current;
      setCanScrollNewsLeft(scrollLeft > 15);
      setCanScrollNewsRight(scrollLeft < scrollWidth - clientWidth - 15);
    }
  };`
  );
}

// 2. Locate the news section header and cards block
const oldNewsStartMarker = `<div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl logo-exact-bg flex items-center justify-center text-white shadow-md">
                <Newspaper className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#6b1699]">
                  NEWS & UPDATES • ຂ່າວສານກອງປະກວດ
                </span>
                <h2 className="text-2xl font-black text-[#240638] mt-0.5">
                  ຂ່າວສານ ແລະ ການເຄື່ອນໄຫວກອງປະກວດລ່າສຸດ
                </h2>
              </div>
            </div>
          </div>`;

const newNewsSliderBlock = `<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl logo-exact-bg flex items-center justify-center text-white shadow-md shrink-0">
                <Newspaper className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#6b1699]">
                  NEWS & UPDATES • ຂ່າວສານກອງປະກວດ
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#240638] mt-0.5">
                  ຂ່າວສານ ແລະ ການເຄື່ອນໄຫວກອງປະກວດລ່າສຸດ
                </h2>
              </div>
            </div>

            {/* Carousel Navigation Buttons & Counter */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <span className="text-xs text-[#644180] font-bold hidden sm:inline">
                ເລື່ອນຊ້າຍ-ຂວາ ({newsList.length} ຂ່າວ)
              </span>
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#9333ea]/20 shadow-sm">
                <button
                  type="button"
                  onClick={() => scrollNews("left")}
                  disabled={!canScrollNewsLeft}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#f6effc] text-[#520d7a]"
                  title="ເລື່ອນໄປຊ້າຍ"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="h-4 w-px bg-gray-200" />
                <button
                  type="button"
                  onClick={() => scrollNews("right")}
                  disabled={!canScrollNewsRight}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#f6effc] text-[#520d7a]"
                  title="ເລື່ອນໄປຂວາ"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* ==================== INTERACTIVE CARD SLIDER (ກາດສະໄລ້) ==================== */}
          <div className="relative group">
            <div
              ref={newsSliderRef}
              onScroll={handleNewsScroll}
              className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {newsList.map((news) => (
                <div
                  key={news.id}
                  onClick={() => setSelectedNewsDetail(news)}
                  className="min-w-[85%] sm:min-w-[46%] lg:min-w-[31.8%] max-w-[85%] sm:max-w-[46%] lg:max-w-[31.8%] snap-start shrink-0 group garden-card rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border border-[#9333ea]/20 cursor-pointer bg-white"
                >
                  {/* Editorial Photo Banner */}
                  <div className="h-56 w-full overflow-hidden garden-luxury-dark p-3 flex items-center justify-center relative">
                    {news.type === "chairman" && (
                      <div className="w-full h-full flex items-center gap-3.5 px-2">
                        <div className="h-full aspect-[4/5] rounded-2xl overflow-hidden border-2 border-amber-400 shadow-lg shrink-0 bg-white">
                          <img
                            src={news.images?.[0] || "/committee/img3.jpg"}
                            alt={news.title}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                          />
                        </div>
                        <div className="flex-1 text-white space-y-2">
                          <div className="inline-flex items-center px-3 py-1 rounded-xl border border-amber-400/40 bg-white/10 text-amber-300 text-[11px] font-black">
                            <span>MHVT 2027 • ສວນບັນດາເຜົ່າ</span>
                          </div>
                          <div className="text-xs font-black text-amber-300 leading-snug">
                            ປະທານ ພູວົງ ພະມີສິດ
                          </div>
                          <div className="text-[11px] text-white/85 leading-relaxed">
                            ປະທານກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ
                          </div>
                        </div>
                      </div>
                    )}

                    {news.type === "committee" && (
                      <div className="w-full h-full grid grid-cols-4 gap-2 items-center">
                        {(news.images || ["/committee/img5.jpg"]).map((imgUrl, i) => (
                          <div
                            key={i}
                            className="h-full rounded-xl overflow-hidden border border-white/30 bg-white shadow-sm"
                          >
                            <img
                              src={imgUrl}
                              alt={\`Committee \${i + 1}\`}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {news.type === "contestants" && (
                      <div className="w-full h-full grid grid-cols-3 gap-2 items-center">
                        {(news.images || ["/contestants/hm01.jpg"]).map((imgUrl, i) => (
                          <div
                            key={i}
                            className="h-full rounded-xl overflow-hidden border border-amber-400/50 bg-[#35064f] shadow-sm"
                          >
                            <img
                              src={imgUrl}
                              alt={\`Contestant \${i + 1}\`}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {news.type !== "chairman" && news.type !== "committee" && news.type !== "contestants" && (
                      <div className="w-full h-full rounded-2xl overflow-hidden bg-black/30">
                        <img
                          src={news.images?.[0] || "/committee/img3.jpg"}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>
                    )}

                    {/* Image count badge */}
                    {news.images && news.images.length > 1 && (
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-black/60 text-white font-mono text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                        <span>📸 {news.images.length} ຮູບ</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between bg-white space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#f3ebfa] text-[#520d7a] text-[11px] font-extrabold border border-[#9333ea]/15">
                          {news.category}
                        </span>
                        <span className="text-xs text-gray-500 font-semibold font-mono">
                          {news.date}
                        </span>
                      </div>
                      <h3 className="font-black text-base text-[#240638] leading-snug line-clamp-2 group-hover:text-[#6b1699] transition">
                        {news.title}
                      </h3>
                      <p className="text-xs text-[#644180] mt-2 leading-relaxed line-clamp-3">
                        {news.summary || news.excerpt || news.content}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-black text-[#6b1699] group-hover:text-[#9333ea]">
                      <span className="flex items-center gap-1">
                        <span>ອ່ານລາຍລະອຽດຂ່າວ</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                      </span>
                      <span className="text-[11px] text-[#644180] font-normal">
                        ກົດເພື່ອເປີດອ່ານ
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Swipe Instruction on Mobile */}
            <div className="flex sm:hidden items-center justify-center gap-1.5 text-xs text-[#644180] pt-2">
              <span>👈 ປັດເລື່ອນຊ້າຍ-ຂວາ ເພື່ອເບິ່ງຂ່າວອື່ນໆ 👉</span>
            </div>
          </div>`;

// Find the whole block from oldNewsStartMarker to the end of news grid
const newsGridStart = content.indexOf(oldNewsStartMarker);
const newsGridEndMarker = `        {/* OFFICIAL FACEBOOK PHOTO ALBUM FROM FACEBOOK.COM/PHEUKSA/PHOTOS */}`;
const newsGridEnd = content.indexOf(newsGridEndMarker);

if (newsGridStart === -1 || newsGridEnd === -1) {
  console.error("Could not find news block markers. start:", newsGridStart, "end:", newsGridEnd);
  process.exit(1);
}

// Replace the news section content
content = content.slice(0, newsGridStart) + newNewsSliderBlock + "\n\n        " + content.slice(newsGridEnd);

// 3. Add News Detail Modal before the closing tags of HomePage
const modalInsertMarker = `{/* CLEAN, MINIMAL VOTING MODAL */}`.length > 0 && content.includes('{/* ==================== MISS KHMU STYLE OFFICIAL PAGEANT VOTING MODAL ==================== */}')
  ? '{/* ==================== MISS KHMU STYLE OFFICIAL PAGEANT VOTING MODAL ==================== */}'
  : 'function PodiumCard';

const newsDetailModalJsx = `{/* ==================== MODAL: NEWS DETAIL POPUP ==================== */}
      {selectedNewsDetail && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 my-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 logo-exact-bg text-white">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-amber-300" />
                <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  {selectedNewsDetail.category}
                </span>
                <span className="text-xs text-white/70">• {selectedNewsDetail.date}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNewsDetail(null)}
                className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-[#240638]">
              {/* Photo Showcase */}
              {selectedNewsDetail.images && selectedNewsDetail.images.length > 0 && (
                <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 max-h-[380px] flex items-center justify-center">
                  <img
                    src={selectedNewsDetail.images[0]}
                    alt={selectedNewsDetail.title}
                    className="w-full h-full object-contain max-h-[360px]"
                  />
                </div>
              )}

              {/* Gallery thumbnails if multiple */}
              {selectedNewsDetail.images && selectedNewsDetail.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {selectedNewsDetail.images.map((img, idx) => (
                    <div key={idx} className="h-16 rounded-xl overflow-hidden border border-gray-200">
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Title & Body */}
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#240638] leading-snug">
                  {selectedNewsDetail.title}
                </h3>
                <div className="text-xs sm:text-sm text-[#644180] mt-3 leading-relaxed space-y-2 whitespace-pre-line">
                  {selectedNewsDetail.content || selectedNewsDetail.summary || selectedNewsDetail.excerpt}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 gap-3">
                <a
                  href="#contestants"
                  onClick={() => setSelectedNewsDetail(null)}
                  className="px-5 py-2.5 rounded-xl font-black text-xs btn-garden-vote flex items-center gap-1.5 shadow"
                >
                  <span>ຮ່ວມໂຫວດໃຫ້ນາງສາວໃນກິດຈະກຳນີ້</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedNewsDetail(null)}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition cursor-pointer"
                >
                  ປິດ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      `;

if (!content.includes('MODAL: NEWS DETAIL POPUP')) {
  content = content.replace(modalInsertMarker, newsDetailModalJsx + modalInsertMarker);
}

fs.writeFileSync(pagePath, content, 'utf8');
console.log("Successfully integrated News Card Slider (ກາດສະໄລ້ຂ່າວສານ) into src/app/page.jsx!");
