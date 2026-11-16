const fs = require('fs');
const path = require('path');

const pagePath = path.join(process.cwd(), 'src', 'app', 'page.jsx');
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Add state variable
if (!content.includes('const [pastQueens, setPastQueens] = useState([]);')) {
  content = content.replace(
    '  const [contestants, setContestants] = useState([]);',
    '  const [contestants, setContestants] = useState([]);\n  const [pastQueens, setPastQueens] = useState([]);'
  );
}

// 2. Add to fetchState
if (!content.includes('setPastQueens(data.past_queens);')) {
  content = content.replace(
    '        if (data.contestants) {',
    '        if (data.contestants) {\n          if (data.past_queens && data.past_queens.length > 0) setPastQueens(data.past_queens);'
  );
}

// 3. Add to navLinks
if (!content.includes('href: "#past-queens"')) {
  content = content.replace(
    '{ href: "#contestants", label: lang === "LA" ? "ຜູ້ເຂົ້າປະກວດ" : "Contestants", icon: Crown },',
    '{ href: "#contestants", label: lang === "LA" ? "ຜູ້ເຂົ້າປະກວດ" : "Contestants", icon: Crown },\n    { href: "#past-queens", label: lang === "LA" ? "ອະດີດນາງສາວ" : "Hall of Fame", icon: Award },'
  );
}

// 4. Add Section JSX right after </section> of #contestants
const contestantsEndMarker = `        )}
      </section>

      {/* SECTION 4: TICKETS */}`;

const pastQueensSectionJsx = `        )}
      </section>

      {/* ==================== SECTION: HALL OF FAME / PAST QUEENS ==================== */}
      <section id="past-queens" className="py-20 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-[#1c022e] via-[#24043b] to-[#160124] text-white border-y border-amber-400/30">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/40 text-amber-300 font-black text-xs uppercase tracking-wider mb-3 shadow-sm">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>HALL OF FAME • ຫໍກຽດຕິຍົດແຫ່ງມົງກຸດ</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              ອະດີດນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ
            </h2>
            <p className="text-sm text-purple-200/80 mt-2.5 font-medium leading-relaxed">
              ຕຳນານມົງກຸດແຫ່ງຄວາມພາກພູມໃຈ ຂອງສາວງາມເຜົ່າມົ້ງ ນະຄອນຫຼວງວຽງຈັນ (2019 - 2026)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {pastQueens.map((q) => {
              const isHighlight = q.year === "2020" || q.year === "2026";
              return (
                <div
                  key={q.id}
                  className={\`relative rounded-3xl p-6 flex flex-col justify-between text-center transition-all duration-300 hover:-translate-y-1.5 shadow-xl border \${
                    isHighlight
                      ? "bg-gradient-to-b from-[#340753] to-[#1e0332] border-2 border-amber-400 shadow-amber-400/15 ring-1 ring-amber-400/30"
                      : "bg-[#25043a] border-purple-500/30 hover:border-amber-400/60"
                  }\`}
                >
                  <div>
                    {/* Year badge */}
                    <div className="flex justify-center mb-4">
                      <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-[#240638] font-black text-xs shadow-md">
                        👑 ປີ {q.year}
                      </span>
                    </div>

                    {/* Queen Photo / Avatar */}
                    <div className="relative w-28 h-28 mx-auto mb-4">
                      <img
                        src={q.image_url}
                        alt={q.name}
                        onError={(e) => {
                          e.currentTarget.src = \`/api/avatar?code=\${q.year}&bg=gold&name=\${encodeURIComponent(q.name)}\`;
                        }}
                        className="w-full h-full object-cover rounded-full border-4 border-amber-400/80 shadow-lg p-0.5 bg-white/10"
                      />
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-[#240638] flex items-center justify-center font-black text-xs shadow">
                        <Award className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Name & Title */}
                    <h3 className="font-black text-base sm:text-lg text-white">
                      {q.name}
                    </h3>
                    <p className="text-xs text-amber-200/90 font-bold mt-1">
                      {q.title}
                    </p>

                    {/* Special Achievement Badge */}
                    {q.badge && (
                      <div className="mt-2.5">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-purple-900/80 border border-amber-400/40 text-amber-300 font-bold text-[11px] leading-tight">
                          ✨ {q.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-purple-200/70 mt-4 pt-3 border-t border-white/10 leading-relaxed italic">
                    &ldquo;{q.bio}&rdquo;
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: TICKETS */}`;

if (content.includes(contestantsEndMarker)) {
  content = content.replace(contestantsEndMarker, pastQueensSectionJsx);
  fs.writeFileSync(pagePath, content, 'utf8');
  console.log("Successfully added Hall of Fame / Past Queens section to page.jsx!");
} else {
  console.log("Could not find contestantsEndMarker, trying fallback insertion...");
  const altMarker = '{/* SECTION 4: TICKETS */}';
  if (content.includes(altMarker)) {
    content = content.replace(altMarker, pastQueensSectionJsx.split('      {/* SECTION 4: TICKETS */}')[0] + altMarker);
    fs.writeFileSync(pagePath, content, 'utf8');
    console.log("Successfully inserted past queens section before SECTION 4: TICKETS!");
  }
}
