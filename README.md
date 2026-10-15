# Undangan Digital — Template Pernikahan v1

Template undangan pernikahan digital satu halaman, mobile-first. Dibuat untuk **Rancang Undangan**.

## Isi template

- Cover dengan tombol "Buka Undangan" (scroll dikunci sampai dibuka)
- Profil kedua mempelai
- Hitung mundur (countdown) otomatis + tombol "Simpan Tanggal" (Google Calendar)
- Rangkaian acara (Akad & Resepsi) + tombol Google Maps
- Galeri foto
- Formulir RSVP → terkirim sebagai pesan WhatsApp
- Kolom Ucapan & Doa → ucapan tamu langsung tampil di halaman (mode sampel: tampil selama halaman dibuka)
- Musik pengiring → menyala otomatis saat undangan dibuka, bisa dimatikan lewat tombol melayang (dibangkitkan via WebAudio, tanpa file MP3)
- Amplop digital (nomor rekening + tombol salin)

## Link personal per tamu (?to=)

Template membaca `?to=` dari URL dan menampilkan namanya di cover.
Contoh: `https://domainkamu/budi-sinta?to=Bapak%20Hartono`
→ cover menampilkan "Bapak Hartono". Tanpa parameter, tampil "Tamu Undangan".
Aman dari injeksi kode via URL (nama disisipkan sebagai teks polos).

## Cara pakai untuk klien baru

1. **Nama, tanggal, alamat** → edit di `index.html` (cari teks yang mau diganti).
2. **Foto** → ganti file di folder `images/` dengan foto asli klien (nama file boleh sama biar nggak perlu edit HTML, atau edit `src` di `index.html`). Foto bawaan template ini hanya contoh.
3. **Nomor WhatsApp RSVP** → ganti `NOMOR_WA` di `script.js`.
4. **Tanggal countdown** → ganti `TANGGAL_ACARA` di `script.js`.
5. **Warna** → ganti variabel di `:root` pada `style.css` (`--hijau`, `--emas`, `--krem`).

## File

| File | Isi |
|---|---|
| `index.html` | Struktur & teks undangan |
| `style.css` | Tampilan (warna, font, layout) |
| `script.js` | Countdown, RSVP via WA, tombol salin, nama tamu ?to=, musik, kolom ucapan |
| `images/` | Foto contoh (cover, mempelai, galeri) — ganti dengan foto klien |

Tidak butuh server / database — cukup hosting file statis (Vercel, Netlify, GitHub Pages).
