import "./globals.css";

export const metadata = {
  title: "ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງວຽງຈັນ 2027 | Miss Hmong Vientiane 2027",
  description:
    "ຮ່ວມໂຫວດສົ່ງແຮງໃຈເຊຍສາວງາມ ກອງປະກວດ ນາງສາວເຜົ່າມົ້ງນະຄອນຫຼວງ ພາຍໃຕ້ໂຄງການ ສວນບັນດາເຜົ່າ (Lao Ethnic Garden) ແລະ ຮ້ານຄຳພູວົງ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="lo">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@300;400;500;600;700;800;900&family=Noto+Serif+Lao:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen bg-[#f8f4fc] text-[#240638] antialiased"
        style={{
          fontFamily:
            "'Noto Sans Lao', 'Phetsarath OT', 'Lao UI', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
