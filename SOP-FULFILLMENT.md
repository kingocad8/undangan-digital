# SOP Fulfillment — Undangan Digital Rancang Undangan

**Waktu per order:** ±30–60 menit (mayoritas menunggu klien kirim data).
**Skill dibutuhkan:** bisa pakai browser. Tanpa coding, tanpa terminal.

---

## 0. Kumpulkan data dari klien (kirim format ini via WA)

```
DATA UNDANGAN DIGITAL — Rancang Undangan
1. Nama mempelai pria & wanita (+ gelar bila ada):
2. Nama orang tua (ayah & ibu masing-masing):
3. Tanggal & jam akad:
4. Tanggal & jam resepsi:
5. Alamat/venue akad & resepsi:
6. Link Google Maps venue (atau shareloc pin):
7. Nomor WA untuk terima RSVP (format 628...):
8. Rekening amplop digital (maks 2 — bank/no/a.n.):
9. Foto: cover 1, mempelai 2, galeri 4–8 (kirim via WA/Drive, nanti dikompres)
10. Lagu MP3 pilihan (opsional — kalau tidak ada, pakai nada bawaan):
11. Masa aktif undangan: 3 / 6 / 12 bulan:
12. Ucapan tamu permanen? ya/tidak (butuh setup Google Sheets ±10 mnt):
```

---

## 1. Siapkan folder klien

1. Di repo GitHub `kingocad8/undangan-digital`, download file `template-pernikahan-v2.zip`.
2. Ekstrak di HP/laptop → rename folder jadi nama klien, mis. `budi-sinta`.

## 2. Isi 1 blok KONFIG (buka `script.js` pakai notepad)

Cukup isi bagian `const KONFIG = {...}` di paling atas. Contoh:

| Field | Diisi apa |
|---|---|
| `TANGGAL_ACARA` | `"2026-12-19T08:00:00+07:00"` (format persis ini) |
| `NOMOR_WA` | `"6281234567890"` (tanpa +, tanpa spasi) |
| `MAPS_QUERY` | `"Gedung Serbaguna Batu Aji, Batam"` (alamat lengkap) |
| `MAPS_EMBED_URL` | Link dari Google Maps → Bagikan → "Sematkan peta" → salin isi `src="..."`. Kosongkan `""` jika tidak mau peta di halaman |
| `MUSIK_MP3` | `"music.mp3"` jika klien kirim lagu; `""` jika pakai nada bawaan |
| `WISHES_API_URL` | URL Web App Apps Script (lihat langkah 6); `""` = mode sampel |
| `SLIDESHOW_MS` | `5000` (biarkan) |

Teks lain (nama, venue, rekening) → cari & ganti langsung di `index.html`.

## 3. Foto & musik

- **Foto:** timpa file di folder `images/` dengan nama yang SAMA (`cover.jpg`, `pria.jpg`, `wanita.jpg`, `galeri-1.jpg` dst). Kompres dulu sampai < 300KB per foto (pakai tinypng.com, gratis).
- **Musik:** taruh file MP3 klien dengan nama persis `music.mp3` di folder utama (sejajar `index.html`).

## 4. Upload ke GitHub

1. Buka repo → folder `clients/` → **Add file → Create new file**.
2. Isi nama file: `budi-sinta/.gitkeep` → Commit (ini bikin foldernya).
3. Buka folder `clients/budi-sinta/` → **Add file → Upload files** → drag semua isi folder klien → Commit.
4. Vercel otomatis deploy (±1–2 menit).

## 5. Tes link (checklist QC)

- [ ] Buka `https://undangan-digital-bice-two.vercel.app/clients/budi-sinta/` di HP
- [ ] Cover: ketuk "Buka Undangan" → musik nyala
- [ ] Coba `?to=Nama+Tamu` → nama tampil di cover
- [ ] Countdown jalan, tombol Simpan Tanggal bisa diklik
- [ ] Peta tampil (jika diisi), tombol Maps buka alamat benar
- [ ] Galeri: ketuk foto → tampil penuh + geser otomatis
- [ ] RSVP: isi form → tombol buka WA ke nomor klien dengan pesan terisi
- [ ] Tombol Salin Nomor rekening berfungsi
- [ ] Ucapan: kirim 1 tes → tampil di daftar

## 6. Ucapan permanen via Google Sheets (opsional, per klien ±10 menit)

1. Buat Google Sheet baru → nama mis. "Ucapan - Budi & Sinta" → baris 1 isi: `Nama | Pesan | Waktu`.
2. **Ekstensi → Apps Script** → hapus isi editor → tempel isi file `apps-script/Code.gs` → Simpan.
3. **Deploy → Deployment baru → Aplikasi web** → "Jalankan sebagai: Saya" → "Akses: Semua orang" → Deploy → **salin URL Web App**.
4. Tempel URL ke `WISHES_API_URL` di `script.js` → upload ulang file → jadi.

## 7. Serahkan ke klien

Kirim via WA:
- Link undangan: `https://undangan-digital-bice-two.vercel.app/clients/budi-sinta/`
- PDF **Panduan Sebar Undangan Digital** (cara bikin link personal per tamu)
- Info masa aktif: link aktif sampai [tanggal]

## 8. Expired

- **Otomatis (disarankan):** catat tanggal kedaluwarsa di sheet admin; saat tiba, hapus folder `clients/<nama>/` dari GitHub → link mati.
- **Perpanjangan:** klien bayar biaya perpanjang → folder tetap ada, update tanggal di sheet.

---

*Template v2 — Rancang Undangan. Terakhir diperbarui: 15 Okt 2026.*
