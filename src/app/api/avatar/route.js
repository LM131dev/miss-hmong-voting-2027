import { NextResponse } from "next/server";

const PALETTES = {
  garden: { bg1: "#240638", bg2: "#6b1699", accent: "#fde047", dress: "#9333ea" },
  emerald: { bg1: "#1f0433", bg2: "#580d80", accent: "#fde047", dress: "#7e22ce" },
  crimson: { bg1: "#2a053d", bg2: "#701a75", accent: "#fbbf24", dress: "#c026d3" },
  gold: { bg1: "#28053d", bg2: "#6b1699", accent: "#fef08a", dress: "#eab308" },
  purple: { bg1: "#1e0330", bg2: "#581c87", accent: "#f472b6", dress: "#9333ea" },
  rose: { bg1: "#2e053b", bg2: "#701a75", accent: "#fcd34d", dress: "#e11d48" },
  indigo: { bg1: "#1e093b", bg2: "#4c1d95", accent: "#f5d0fe", dress: "#6d28d9" },
  teal: { bg1: "#210538", bg2: "#5b1387", accent: "#fde047", dress: "#86198f" },
  amber: { bg1: "#29063d", bg2: "#6b1699", accent: "#fde047", dress: "#d97706" },
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code") || "MH01";
  const name = searchParams.get("name") || "Miss Ethnic Garden";
  const bgKey = searchParams.get("bg") || "garden";
  const p = PALETTES[bgKey] || PALETTES.garden;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#9333ea"/>
        <stop offset="45%" stop-color="${p.bg2}"/>
        <stop offset="100%" stop-color="${p.bg1}"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.2" cy="0.15" r="0.7">
        <stop offset="0%" stop-color="#e9d5ff" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#240638" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="silver" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#e2e8f0"/>
        <stop offset="50%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#94a3b8"/>
      </linearGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="50%" stop-color="#facc15"/>
        <stop offset="100%" stop-color="#ca8a04"/>
      </linearGradient>
    </defs>

    <!-- Lush Lao Ethnic Garden Green Backdrop -->
    <rect width="400" height="500" fill="url(#bg)"/>
    <rect width="400" height="500" fill="url(#glow)"/>

    <!-- Subtle Kranok / Botanical Watermark Curves -->
    <path d="M-20 420 Q90 300 60 150 Q140 240 190 80 Q230 220 340 160 Q280 310 420 420" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="18"/>
    <circle cx="200" cy="215" r="168" fill="none" stroke="url(#gold)" stroke-width="1.5" stroke-opacity="0.35" stroke-dasharray="5 5"/>
    <circle cx="200" cy="215" r="142" fill="#ffffff" fill-opacity="0.07"/>

    <!-- Top Brand Ribbon -->
    <rect x="110" y="16" width="180" height="24" rx="12" fill="#1e0330" fill-opacity="0.65" stroke="#fde047" stroke-opacity="0.45" stroke-width="1"/>
    <text x="200" y="32" text-anchor="middle" fill="#fef08a" font-family="sans-serif" font-size="10" font-weight="bold" letter-spacing="1">ສວນບັນດາເຜົ່າ • LAO ETHNIC GARDEN</text>

    <!-- Traditional Ethnic Attire & Silver/Gold Ornaments -->
    <path d="M92 500 C92 375 135 335 200 335 C265 335 308 375 308 500 Z" fill="#140120"/>
    <path d="M135 338 L200 432 L265 338" fill="none" stroke="${p.dress}" stroke-width="20"/>
    <path d="M148 340 L200 415 L252 340" fill="none" stroke="url(#gold)" stroke-width="5"/>
    <path d="M140 345 Q200 395 260 345" fill="none" stroke="url(#silver)" stroke-width="12" stroke-linecap="round"/>
    <path d="M150 360 Q200 410 250 360" fill="none" stroke="url(#silver)" stroke-width="7" stroke-linecap="round"/>
    <circle cx="170" cy="385" r="5" fill="url(#silver)"/>
    <circle cx="200" cy="393" r="6.5" fill="url(#gold)"/>
    <circle cx="230" cy="385" r="5" fill="url(#silver)"/>

    <!-- Neck & Face -->
    <rect x="178" y="285" width="44" height="60" rx="18" fill="#fde6d8"/>
    <ellipse cx="200" cy="225" rx="64" ry="76" fill="#18181b"/>
    <ellipse cx="200" cy="232" rx="54" ry="66" fill="#fde6d8"/>
    <path d="M170 212 Q180 206 190 212" fill="none" stroke="#3f2e21" stroke-width="3" stroke-linecap="round"/>
    <path d="M210 212 Q220 206 230 212" fill="none" stroke="#3f2e21" stroke-width="3" stroke-linecap="round"/>
    <circle cx="180" cy="224" r="4.5" fill="#1c1917"/>
    <circle cx="220" cy="224" r="4.5" fill="#1c1917"/>
    <circle cx="181.5" cy="222.5" r="1.5" fill="#ffffff"/>
    <circle cx="221.5" cy="222.5" r="1.5" fill="#ffffff"/>
    <ellipse cx="168" cy="242" rx="9" ry="5" fill="#fb7185" fill-opacity="0.35"/>
    <ellipse cx="232" cy="242" rx="9" ry="5" fill="#fb7185" fill-opacity="0.35"/>
    <path d="M187 258 Q200 269 213 258" fill="none" stroke="#e11d48" stroke-width="3.5" stroke-linecap="round"/>

    <!-- Earrings -->
    <circle cx="144" cy="242" r="6" fill="url(#gold)"/>
    <path d="M144 248 L139 272 L149 272 Z" fill="url(#silver)"/>
    <circle cx="256" cy="242" r="6" fill="url(#gold)"/>
    <path d="M256 248 L251 272 L261 272 Z" fill="url(#silver)"/>

    <!-- Royal Ethnic Headdress / Crown -->
    <path d="M126 190 C126 125 274 125 274 190 L262 202 C220 182 180 182 138 202 Z" fill="${p.dress}" stroke="url(#gold)" stroke-width="3"/>
    <path d="M132 176 Q200 150 268 176" fill="none" stroke="url(#silver)" stroke-width="8"/>
    <polygon points="200,90 184,142 216,142" fill="url(#gold)"/>
    <polygon points="162,108 152,148 176,148" fill="url(#silver)"/>
    <polygon points="238,108 224,148 248,148" fill="url(#silver)"/>
    <circle cx="200" cy="87" r="7.5" fill="#bef264"/>
    <circle cx="162" cy="105" r="5" fill="${p.accent}"/>
    <circle cx="238" cy="105" r="5" fill="${p.accent}"/>
    <circle cx="145" cy="168" r="6" fill="#bef264"/>
    <circle cx="172" cy="160" r="6" fill="#fbbf24"/>
    <circle cx="200" cy="157" r="7" fill="#f43f5e"/>
    <circle cx="228" cy="160" r="6" fill="#fbbf24"/>
    <circle cx="255" cy="168" r="6" fill="#bef264"/>

    <!-- Bottom Nameplate -->
    <rect x="24" y="424" width="352" height="56" rx="16" fill="#1e0330" fill-opacity="0.88" stroke="url(#gold)" stroke-width="1.5"/>
    <text x="48" y="459" fill="#fde047" font-family="sans-serif" font-size="22" font-weight="bold">${code}</text>
    <text x="122" y="458" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="600">${name}</text>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
