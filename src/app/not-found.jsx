export default function NotFound() {
  return (
    <div className="min-h-screen garden-luxury-dark flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md border border-amber-400/30 rounded-3xl p-8 space-y-4 shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-2xl logo-exact-bg flex items-center justify-center text-amber-300 text-2xl font-black shadow-lg">
          404
        </div>
        <h1 className="text-2xl font-black text-amber-300">
          ບໍ່ພົບໜ້າທີ່ທ່ານຕ້ອງການ
        </h1>
        <p className="text-sm text-purple-200">
          ຂໍອະໄພ ໜ້າເວັບໄຊນີ້ບໍ່ມີ ຫຼື ອາດຈະຖືກຍ້າຍແລ້ວ.
        </p>
        <div className="pt-2">
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl btn-garden-vote text-xs font-black shadow-lg"
          >
            ກັບຄືນໜ້າຫຼັກ (Home)
          </a>
        </div>
      </div>
    </div>
  );
}
