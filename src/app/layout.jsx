import "./globals.css";
import { Noto_Serif_Lao } from "next/font/google";

const notoSerifLao = Noto_Serif_Lao({
  subsets: ["lao", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-serif-lao",
  display: "swap",
});

export const metadata = {
  title: "ສວນບັນດາເຜົ່າ • Lao Ethnic Garden | ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ 2026",
  description:
    "ຮ່ວມໂຫວດສົ່ງແຮງໃຈເຊຍສາວງາມ ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ ພາຍໃຕ້ໂຄງການ ສວນບັນດາເຜົ່າ (Lao Ethnic Garden)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="lo" className={notoSerifLao.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+Lao:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${notoSerifLao.className} min-h-screen bg-[#f3f8ed] text-[#16300e] antialiased selection:bg-[#8cc63f] selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
