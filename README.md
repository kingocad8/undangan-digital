# Undangan Digital — Template Pernikahan v2

Template undangan pernikahan digital satu halaman, mobile-first. Dibuat untuk **Rancang Undangan**.

## Isi template (v2)

- Cover dengan tombol "Buka Undangan" (scroll dikunci sampai dibuka) + nama tamu personal via `?to=`
- Profil kedua mempelai
- Hitung mundur (countdown) otomatis + tombol "Simpan Tanggal" (Google Calendar)
- Rangkaian acara (Akad & Resepsi) + **peta embed Google Maps** (opsional) + tombol Maps
- Galeri foto → **ketuk untuk tampil penuh (lightbox) + slideshow otomatis**
- Formulir RSVP → terkirim sebagai pesan WhatsApp ke nomor klien
- Kolom Ucapan & Doa → **tersimpan permanen via Google Sheets** (opsional, gratis); tanpa setup = mode sampel
- **Musik pengiring MP3** (file `music.mp3` dari klien) → otomatis nyala saat dibuka, bisa dimatikan; tanpa file = nada bawaan
- Amplop digital (nomor rekening + tombol salin)

## Link personal per tamu (?to=)

Template membaca `?to=` dari URL dan menampilkan namanya di cover.

Contoh: `https://domainkamu/budi-sinta?to=Bapak%20Hartono` → cover menampilkan "Bapak Hartono". Tanpa parameter, tampil "Tamu Undangan".

Aman dari injeksi kode via URL (nama disisipkan sebagai teks polos).

## Cara pakai untuk klien baru — CUKUP ISI 1 BLOK

Buka `script.js`, isi blok `const KONFIG = {...}` di paling atas:

| Field | Diisi apa |
|---|---|
| `TANGGAL_ACARA` | `"2026-12-19T08:00:00+07:00"` |
| `NOMOR_WA` | `"6281234567890"` (format 62, tanpa +/spasi) |
| `MAPS_QUERY` | `"Gedung Serbaguna Batu Aji, Batam"` |
| `MAPS_EMBED_URL` | Link dari Google Maps → Bagikan → "Sematkan peta" → salin isi `src="..."`; `""` = tidak tampilkan peta |
| `MUSIK_MP3` | `"music.mp3"` (taruh file di folder ini); `""` = nada bawaan |
| `WISHES_API_URL` | URL Web App Apps Script (lihat `apps-script/Code.gs`); `""` = mode sampel |
| `SLIDESHOW_MS` | `5000` (biarkan) |

Teks lain (nama, venue, rekening) → cari & ganti langsung di `index.html`.
Foto → timpa file di `images/` dengan nama yang sama (kompres < 300KB/foto).

## File

| File | Isi |
|---|---|
| `index.html` | Struktur & teks undangan |
| `style.css` | Tampilan (warna, font, layout, lightbox) |
| `script.js` | Seluruh logika + 1 blok KONFIG |
| `images/` | Foto contoh — ganti dengan foto klien |
| `music.mp3` | (opsional) Lagu pilihan klien |
| `apps-script/Code.gs` | Backend ucapan permanen (Google Sheets, gratis) |
| `SOP-FULFILLMENT.md` | Panduan operasional per order (tanpa coding) |
| `template-pernikahan-v2.zip` | Paket siap download untuk fulfillment manual |

## Alur kerja

Edit/push ke GitHub → Vercel otomatis deploy → website update. Lihat `SOP-FULFILLMENT.md` untuk operasional harian.
