# Estyalife

Simulator kehidupan, ekonomi, dan dunia berbasis AI. Dimulai 1 Januari 2012.
Pemain membuat karakternya sendiri — nama, gender, tanggal lahir, kostum
awal, dan kota awal — lalu hidupnya terbentuk dari keputusan pemain, kondisi
ekonomi, dan peristiwa dunia. Semua karakter mulai benar-benar dari nol
secara finansial (sangat miskin), apa pun usia atau latar belakang yang
dipilih.

Status saat ini: **Fase 4 (Dunia)**. Lihat `docs/ROADMAP.md` untuk fase
berikutnya.

## Menjalankan secara lokal

Proyek ini dibuat di lingkungan tanpa akses internet, jadi dependensi
belum ter-install. Di komputer kamu (dengan internet):

```bash
npm install
npm run dev
```

Buka http://localhost:3000 — akan muncul halaman sampul untuk membuat karakter
baru (nama, gender, tanggal lahir, kostum awal) atau melanjutkan save yang
tersimpan di IndexedDB browser.

**Agent AI (Fase 2):** salin `.env.example` jadi `.env.local` lalu isi
`ANTHROPIC_API_KEY` / `GOOGLE_API_KEY` / `OPENAI_API_KEY` kalau kamu mau
menyediakan kunci default di server. Ini opsional — pemain juga bisa
memilih Agent (Claude / Gemini / ChatGPT) dan mengisi token API miliknya
sendiri lewat panel "Pengaturan Agent AI" di dalam permainan, dan
menukarnya kapan saja termasuk di tengah permainan yang sedang berjalan.

Menjalankan tes unit:

```bash
npm test
```

## Struktur folder

```
src/
├── app/
│   ├── api/ai/route.ts   # Route server satu pintu ke Claude/Gemini/ChatGPT
│   ├── page.tsx          # Sampul: daftar save, mulai baru
│   └── game/page.tsx     # Dashboard karakter + kotak perintah + catatan hidup
│   └── game/toko/page.tsx    # Beli/jual barang & hunian/utilitas
│   └── game/karier/page.tsx  # Lamar kerja, lihat lowongan, berhenti kerja
│   └── game/pasar/page.tsx   # Beli/jual mata uang/saham/indeks/kripto + portofolio
│   └── game/dunia/page.tsx   # Domisili, ekonomi makro, pindah kota, konteks dunia luar
├── components/
│   ├── character/        # Komponen UI karakter (CharacterCreationForm, NeedBar, LedgerRow)
│   └── game/             # CommandBox, NarrativeFeed, DeathScreen, AgentSettingsPanel
├── lib/
│   ├── ai/                # Agent, prompt, context builder, skema Zod, providers/
│   │   └── providers/     # Abstraksi provider: anthropic, google, openai
│   ├── database/          # Layer IndexedDB + repository bertipe (termasuk settings)
│   ├── simulation/         # Time engine, character factory, appearance (kostum),
│   │                       # game engine, effects, random events, death, migrations,
│   │                       # save service, finance (pengeluaran rutin & makan),
│   │                       # inventory (beli/jual/depresiasi), career (pekerjaan),
│   │                       # productCatalog & jobCatalog (anti-anakronisme),
│   │                       # worldCatalog & macroEconomy (negara/kota/ekonomi makro),
│   │                       # priceEngine (harga aset deterministik) & investments,
│   │                       # currencyCatalog/stockCatalog/indexCatalog/cryptoCatalog,
│   │                       # marketRegistry (gabungan seluruh katalog aset)
│   ├── state/              # Zustand store (state game aktif di memori)
│   └── format.ts           # Helper format Rupiah
├── types/                   # Semua tipe TypeScript (character, time, save, ai, dll)
docs/
└── ROADMAP.md               # Ringkasan fase pengembangan
```

## Prinsip arsitektur (berlaku untuk semua fase)

- **Simulation engine bersifat otoritatif.** Sejak Fase 2, AI hanya
  *mengusulkan* aksi (`AIActionResult` — lihat `src/types/ai.ts`) — engine
  (`lib/simulation/engine.ts::applyAIActionResult`) yang memvalidasi
  ulang secara semantik dan menerapkan efeknya. AI tidak pernah mengubah
  state secara langsung, dan tidak pernah memutuskan kematian karakter.
- **ID entitas tidak pernah berupa nama tampilan** — selalu lewat
  `generateId()` (lihat `src/types/common.ts`).
- **Waktu disimpan sebagai menit sejak epoch** (2012-01-01), bukan
  `Date` browser, agar deterministik dan tidak bergantung timezone.
- **Local-first**: seluruh state tersimpan di IndexedDB, bertahan lewat
  refresh dan mati koneksi internet.
- **Tidak ada satu komponen raksasa** — logika dipecah per folder
  (`lib/simulation`, `lib/database`, dst.) agar mudah diperluas tanpa
  menulis ulang seluruh aplikasi.
- **RNG deterministik ber-seed, bukan `Math.random()` global**
  (`lib/simulation/rng.ts`): peristiwa dunia acak (Fase 2), harga aset
  finansial, dan evolusi ekonomi makro (Fase 4) semuanya dihitung ulang
  dari `saveId + waktu simulasi` saat dibutuhkan — save+waktu yang sama
  selalu menghasilkan hasil yang sama (bisa diuji), dan TIDAK disimpan
  sebagai time-series di save supaya ukurannya tidak membengkak tanpa
  batas seiring waktu simulasi berjalan.
