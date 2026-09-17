# Roadmap Estyalife

Ringkasan fase pengembangan. Urutan ini mengikuti prioritas: jangan bangun
UI yang indah sebelum sistem di baliknya benar-benar berfungsi.

## ✅ Fase 1 — Fondasi (status: implementasi awal selesai)
- Next.js + TypeScript + React + Tailwind
- Layer IndexedDB (`lib/database`) dengan skema bertipe & migrasi versi
- Sistem save: mulai baru, lanjutkan, hapus, ekspor, impor (`lib/simulation/saveService.ts`)
- Karakter Artisio Libalo dengan kondisi awal sesuai spesifikasi (`lib/simulation/characterFactory.ts`)
- Time engine deterministik: konversi menit↔kalender, umur, durasi aksi standar (`lib/simulation/time.ts`)
- Simulation engine minimal: `advanceTime()` menjalankan peluruhan kebutuhan per jam (`lib/simulation/engine.ts`)
- UI dasar: sampul (daftar save) + dashboard karakter dengan tombol uji lewat-waktu
- Tes unit untuk time engine & simulation engine (Vitest)

## ✅ Fase 2 — AI (status: implementasi awal selesai)
- Input bahasa natural (`components/game/CommandBox.tsx`) — pemain mengetik
  apa yang Artisio mau lakukan, bukan memilih dari menu tetap
- AI Provider abstraction (`lib/ai/providers/`) — pemain memilih salah satu
  dari **tiga Agent AI**: Claude (Anthropic), Gemini (Google), atau ChatGPT
  (OpenAI), lewat panel "Pengaturan Agent AI"
  (`components/game/AgentSettingsPanel.tsx`)
- Token API fleksibel (`lib/ai/apiKeyStore.ts`): pemain boleh menyimpan
  **lebih dari satu token berlabel per Agent** (mis. beberapa token Claude
  berbeda) dan menukar Agent maupun token aktif **kapan saja, termasuk di
  tengah permainan yang sedang berjalan** — tanpa perlu memulai ulang save.
  Token disimpan lokal di IndexedDB pemain, tidak pernah ikut ter-export
  bersama save game (`types/save.ts`)
- Route server satu pintu (`app/api/ai/route.ts`) meneruskan ke API
  Anthropic/Google/OpenAI memakai kunci `.env.local` ATAU token pribadi
  pemain — kunci rahasia tidak pernah dipanggil langsung dari browser
- AI Agent + context builder (`lib/ai/agent.ts`, `lib/ai/contextBuilder.ts`)
  — hanya mengirim konteks relevan (kondisi karakter + beberapa giliran
  terakhir), bukan seluruh dunia
- Skema output terstruktur + validasi Zod (`lib/ai/schema.ts`): effects,
  events, narrative — AI **tidak pernah** mengubah state langsung
- Engine memvalidasi ulang setiap effect secara semantik sebelum
  diterapkan (`lib/simulation/effects.ts`, `lib/simulation/engine.ts`) —
  path di luar whitelist, nilai NaN/Infinity, atau uang jadi negatif
  ditolak SELURUHNYA, bukan diterapkan sebagian
- **Realisme tanpa plot armor** (`lib/ai/prompt.ts`,
  `lib/simulation/randomEvents.ts`, `lib/simulation/death.ts`): kebutuhan
  yang dibiarkan kritis (lapar/lelah/stres) menimbulkan kerusakan
  kesehatan nyata; peristiwa dunia acak (sakit mendadak, kecelakaan,
  kecopetan, sesekali rezeki baik) bisa terjadi kapan pun waktu berjalan,
  di luar kendali AI dan deterministik lewat RNG ber-seed
  (`lib/simulation/rng.ts`); kematian dihitung murni oleh engine dari
  angka kesehatan, tidak pernah oleh narasi AI
  (`components/game/DeathScreen.tsx`)

## ✅ Fase 2.5 — Pembuatan karakter oleh pemain (status: selesai)
- Karakter tidak lagi tetap "Artisio Libalo, 18 tahun" — pemain memilih
  nama, gender (`types/character.ts::Gender`), tanggal lahir, dan kostum
  awal lewat form di sampul (`components/character/CharacterCreationForm.tsx`)
- Katalog kostum/penampilan (`lib/simulation/appearance.ts`) — preset unisex
  emoji + label + deskripsi, dipilih pemain, ditampilkan di header dashboard
- `lib/simulation/characterFactory.ts::createCharacter()` menggantikan
  `createArtisio()` sebagai jalur utama pembuatan karakter (`createArtisio`
  dipertahankan sebagai default contoh untuk unit test & fallback)
- Validasi realistis (`validateBirthMinute()`): tanggal lahir tidak boleh di
  masa depan relatif ke 1 Januari 2012, dan usia awal dibatasi 15-90 tahun
  (Estyalife belum punya mekanisme simulasi masa kecil)
- Prinsip inti dipertahankan: seberapa pun usia/gender/kostum yang dipilih,
  karakter tetap mulai SANGAT MISKIN secara finansial dari nol — hanya
  pendidikan/pengalaman/reputasi dasar yang diskalakan ringan mengikuti usia
- AI Agent (`lib/ai/prompt.ts`, `lib/ai/contextBuilder.ts`) tidak lagi
  hardcode "Artisio" — menerima nama/gender/usia/tahun lahir karakter secara
  dinamis lewat `AIContext`, dan diminta mempertimbangkan generasi karakter
  (`birthYear`) supaya referensi masa muda/pengalaman hidup tetap masuk akal
  secara historis, bukan cuma anti-anakronisme terhadap tahun simulasi
- Save lama dimigrasi otomatis (`lib/simulation/migrations.ts`, schemaVersion
  2 → 3): `gender` default "male", `appearanceId` default preset pertama

## ✅ Fase 3 — Kehidupan (status: implementasi awal selesai)
- Pengeluaran rutin (`types/finance.ts`, `lib/simulation/finance.ts`):
  sewa & listrik jadi `RecurringExpense` yang ditagih otomatis lewat
  `processRecurringExpenses()` di setiap lompatan waktu (`engine.ts` ->
  `advanceTimeRealistic()`), berlaku sama baik lewat AI Agent, pintasan
  cepat, maupun lompatan waktu polos; gagal bayar tercatat sebagai utang +
  event, bukan diabaikan
- Tombol "Makan" yang dulu cuma memajukan waktu tanpa efek kini benar-benar
  memberi makan lewat `eatMeal()` — tiga tingkat (layak/seadanya/tidak
  mampu) tergantung uang tunai saat itu, konsisten dengan prinsip "sangat
  miskin tanpa plot armor"
- Inventori & produk (`types/product.ts`, `lib/simulation/inventory.ts`):
  barang durable (kondisi 0-100, menyusut lewat `depreciationPerMonth`) vs
  barang non-durable; beli/jual lewat halaman **Toko** (`app/game/toko`)
- Database produk historis + anti-anakronisme
  (`lib/simulation/productCatalog.ts`): produk bermerek (Nokia 3310,
  iPhone 4/5, iPad, PS2/PS3) hanya bisa dibeli setelah tahun rilis
  aslinya; barang generik (kaos, motor bekas, dll) selalu tersedia
- Pekerjaan & skill (`types/job.ts`, `lib/simulation/jobCatalog.ts`,
  `lib/simulation/career.ts`): melamar kerja lewat halaman **Karier**
  (`app/game/karier`) dengan syarat pendidikan/reputasi/skill/barang
  wajib (mis. motor untuk ojek online); prinsip anti-anakronisme
  diperluas ke profesi — "Pengemudi ojek online" baru tersedia mulai 2015
  (aplikasi Gojek baru meluncur Januari 2015), sebelumnya ditolak dengan
  alasan historis, bukan cuma syarat kualifikasi
- Kerja tanpa pekerjaan tetap tetap menghasilkan upah kecil ("kerja
  serabutan", deterministik) — bekerja dengan `careerJobId` aktif
  membayar sesuai `wagePerHour`×`hoursPerShift` job tersebut & menambah
  skill terkait
- Semua aksi terstruktur baru (Makan/Kerja/Toko/Karier) SENGAJA tidak
  lewat AI Agent bebas — deterministik lewat fungsi `perform*()` khusus di
  `engine.ts`, supaya sistem keuangan/inventori/karier tidak bisa
  "dihalusinasi". AI Agent (Fase 2) hanya diberi tahu ringkasannya
  (`jobTitle`, `recurringExpensesMonthlyTotal` di `AIContext`) dan
  diinstruksikan untuk tidak menduplikasi gaji tetap/tagihan rutin lewat
  effect bebas
- Save lama dimigrasi otomatis (`lib/simulation/migrations.ts`,
  schemaVersion 3 → 4): `finance.recurringExpenses` & `inventory` default
  array kosong

## ✅ Fase 4 — Dunia (status: implementasi awal selesai)
- Negara & kota (`types/world.ts`, `lib/simulation/worldCatalog.ts`):
  katalog statis (pola sama seperti produk/pekerjaan di Fase 3) — 6 negara
  dengan 11 kota. Karakter tetap berdomisili di Indonesia (mata uang dasar
  seluruh Fase 1-3 adalah Rupiah); negara lain berfungsi sebagai konteks
  dunia & penerbit mata uang/indeks asing di Pasar. Pemain memilih kota
  awal saat membuat karakter (`CharacterCreationForm.tsx`) dan bisa
  **pindah kota** kapan saja lewat halaman **Dunia** (`app/game/dunia`,
  `performRelocate()`) — makan waktu beberapa hari, dunia tetap berjalan
  (kelalaian/bencana tetap bisa terjadi) selama itu
- Ekonomi makro (`lib/simulation/macroEconomy.ts`): inflasi, pengangguran,
  pertumbuhan PDB, suku bunga acuan per negara, berevolusi deterministik
  per tahun kalender lewat random walk *mean-reverting* ber-seed (pola RNG
  sama seperti peristiwa dunia Fase 2) — dihitung ulang dari
  `saveId + negara + waktu`, tidak disimpan sebagai time-series di save
- Mesin harga aset deterministik (`lib/simulation/priceEngine.ts`):
  *geometric Brownian motion* harian ber-seed untuk seluruh kelas aset
  finansial — save+waktu yang sama selalu menghasilkan harga yang sama,
  tanpa membengkakkan save (harga dihitung ulang saat dibutuhkan, bukan
  disimpan sebagai riwayat)
- Mata uang & nilai tukar (`lib/simulation/currencyCatalog.ts`): USD, EUR,
  JPY, SGD, CNY — dikutip sebagai kurs dalam Rupiah, bisa dibeli/dijual
  seperti aset lain
- Pasar saham (`lib/simulation/stockCatalog.ts`,
  `lib/simulation/indexCatalog.ts`): 8 saham individual **fiktif** (bukan
  emiten sungguhan — mensimulasikan harga saham atas nama perusahaan
  nyata akan menyesatkan) lintas sektor, dua di antaranya baru "IPO" di
  tengah permainan (2019, 2021); plus reksa dana indeks IHSG, S&P 500, dan
  Nikkei 225 (NAV awal Rp1.000/unit, konvensi reksa dana Indonesia)
- Kripto mengikuti kronologi historis (`lib/simulation/cryptoCatalog.ts`):
  8 aset dengan `genesisMinute` mengikuti tahun peluncuran ASLI di dunia
  nyata (Bitcoin 2009, Litecoin 2011, Ethereum 2015, dst.) — prinsip
  anti-anakronisme Fase 3 diperluas ke pasar kripto; harga pergerakannya
  sendiri sepenuhnya simulasi, bukan replikasi data historis nyata
- Halaman **Pasar** (`app/game/pasar`): beli/jual seluruh kelas aset +
  ringkasan "Portofolio Saya" (untung/rugi per posisi, rata-rata harga beli
  tertimbang) — `lib/simulation/investments.ts`
- Kekayaan bersih (dashboard & daftar save) kini menghitung nilai
  portofolio investasi juga (`calculateNetWorthWithPortfolio()`)
- Sama seperti Toko/Karier di Fase 3: jual-beli aset & pindah kota SENGAJA
  tidak lewat AI Agent bebas — deterministik lewat `performBuyAsset()`,
  `performSellAsset()`, `performRelocate()` di `engine.ts`. AI Agent hanya
  diberi tahu ringkasannya (`location`, `portfolio` di `AIContext`) untuk
  keperluan narasi, dan diinstruksikan untuk tidak menduplikasinya lewat
  effect bebas
- Save lama dimigrasi otomatis (`lib/simulation/migrations.ts`,
  schemaVersion 4 → 5): `investments` default array kosong;
  `location.countryId`/`cityId` di-default-kan ke Indonesia/Jakarta kalau
  masih null (bentuk field ini sejak Fase 1, baru benar-benar dipakai di
  sini)
- **Batasan yang disengaja**: pemain belum bisa pindah domisili ke negara
  lain (memerlukan sistem finansial multi-mata-uang asli, di luar cakupan
  pembaruan ini); statistik makro tiap negara & pergerakan tiap aset
  berevolusi independen tanpa propagasi sebab-akibat lintas sistem —
  keduanya kandidat wajar untuk Fase 5 ("Guncangan ekonomi & propagasi
  sebab-akibat") & Fase 8 ("Causal graph interaktif")

## ⬜ Fase 5 — Peristiwa
- News engine
- Peristiwa historis
- Progresi teknologi
- Guncangan ekonomi & propagasi sebab-akibat (causal graph)

## ⬜ Fase 6 — Sosial
- NPC persisten (hubungan, kepercayaan, riwayat)
- Bisnis: dirikan, beli, jual, rekrut, dsb.
- Progresi karier

## ⬜ Fase 7 — UI
- Dashboard dunia/negara/pasar
- Peta interaktif
- Timeline
- Chart historis

## ⬜ Fase 8 — Lanjutan
- Alternate history & divergensi timeline
- Causal graph interaktif ("Kenapa ini berubah?")
- Optimasi simulasi jangka panjang (Web Workers, dsb.)

Spesifikasi lengkap (82 bagian) ada di percakapan awal proyek ini — jika
perlu direferensikan ulang, minta pengguna untuk membagikannya kembali.
