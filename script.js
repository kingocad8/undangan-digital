/* ═══════════════════════════════════════════════════════════
   RANCANG UNDANGAN — Template Pernikahan v2
   ★★★ CUKUP ISI BLOK KONFIG DI BAWAH, SELESAI ★★★
   Semua kebutuhan per klien (tanggal, WA, maps, musik, ucapan)
   diatur dari sini. Jangan ubah kode di bawah garis.
   ═══════════════════════════════════════════════════════════ */

const KONFIG = {
  // 1. Tanggal & jam acara (format: YYYY-MM-DDTHH:MM:SS+07:00)
  TANGGAL_ACARA: "2026-12-19T08:00:00+07:00",

  // 2. Nomor WhatsApp penerima RSVP (format: 62..., tanpa + / spasi)
  NOMOR_WA: "6281234567890",

  // 3. Alamat untuk tombol "Lihat Google Maps" (tulis alamat lengkap)
  MAPS_QUERY: "Gedung Serbaguna Batu Aji, Batam",

  // 4. Peta yang tampil di halaman (opsional).
  //    Cara isi: buka Google Maps → cari alamat → Bagikan → "Sematkan peta"
  //    → salin LINK di dalam src="..." (bukan seluruh kode iframe).
  //    Kosongkan ("") jika tidak mau tampilkan peta di halaman.
  MAPS_EMBED_URL: "",

  // 5. Musik pengiring (opsional).
  //    Taruh file MP3 lagu pilihan klien di folder ini dengan nama music.mp3.
  //    Kosongkan ("") untuk pakai nada bawaan (tanpa file).
  MUSIK_MP3: "music.mp3",

  // 6. Ucapan tamu permanen (opsional, gratis via Google Sheets).
  //    Cara isi: lihat SOP-FULFILLMENT.md bagian "Ucapan permanen".
  //    Kosongkan ("") = mode sampel (ucapan hanya tampil selama halaman dibuka).
  WISHES_API_URL: "",

  // 7. Slideshow galeri: tiap berapa milidetik ganti foto (5000 = 5 detik)
  SLIDESHOW_MS: 5000,
};

/* ══════════════════ JANGAN UBAH DARI SINI ══════════════════ */

// 0. Nama tamu personal dari ?to= di URL (mis. undangan.html?to=Bapak+Hartono)
//    Tanpa parameter → tetap tampil "Tamu Undangan".
//    Pakai textContent (bukan innerHTML) supaya aman dari injeksi kode via URL.
(function () {
  var el = document.querySelector(".nama-tamu");
  if (!el) return;
  var nama = new URLSearchParams(window.location.search).get("to");
  if (nama) {
    nama = nama.trim().slice(0, 60);
    if (nama) {
      el.textContent = nama;
      // Isi otomatis kolom nama di formulir RSVP
      var inputNama = document.querySelector('#form-rsvp [name="nama"]');
      if (inputNama && !inputNama.value) inputNama.value = nama;
    }
  }
})();

// 1. Buka undangan: sembunyikan cover, izinkan scroll, nyalakan musik
document.getElementById("btn-buka").addEventListener("click", () => {
  document.getElementById("cover").classList.add("tersembunyi");
  document.body.classList.add("terbuka");
  window.scrollTo(0, 0);
  try { setMusik(true); } catch (err) { /* musik opsional, abaikan */ }
});

// 2. Hitung mundur
const target = new Date(KONFIG.TANGGAL_ACARA).getTime();

function updateCountdown() {
  const sisa = target - Date.now();

  if (sisa <= 0) {
    document.querySelector(".countdown").innerHTML =
      "<p class='teks'>Acara telah berlangsung. Terima kasih atas doa restunya.</p>";
    return;
  }

  const hari  = Math.floor(sisa / 86400000);
  const jam   = Math.floor((sisa % 86400000) / 3600000);
  const menit = Math.floor((sisa % 3600000) / 60000);
  const detik = Math.floor((sisa % 60000) / 1000);

  document.getElementById("cd-hari").textContent  = hari;
  document.getElementById("cd-jam").textContent   = String(jam).padStart(2, "0");
  document.getElementById("cd-menit").textContent = String(menit).padStart(2, "0");
  document.getElementById("cd-detik").textContent = String(detik).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// 3. Peta: tampilkan embed jika diisi, tombol selalu pakai alamat
(function () {
  var btnMaps = document.getElementById("btn-maps");
  if (btnMaps && KONFIG.MAPS_QUERY) {
    btnMaps.href = "https://maps.google.com/?q=" + encodeURIComponent(KONFIG.MAPS_QUERY);
  }
  var wadah = document.getElementById("peta");
  if (wadah && KONFIG.MAPS_EMBED_URL) {
    var iframe = document.createElement("iframe");
    iframe.src = KONFIG.MAPS_EMBED_URL;
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.title = "Peta lokasi acara";
    wadah.appendChild(iframe);
  }
})();

// 4. RSVP → kirim sebagai pesan WhatsApp ke nomor klien
document.getElementById("form-rsvp").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target;

  const pesan =
    `*Konfirmasi Kehadiran*\n\n` +
    `Nama: ${f.nama.value}\n` +
    `Kehadiran: ${f.kehadiran.value}\n` +
    `Jumlah tamu: ${f.jumlah.value} orang\n` +
    `Ucapan: ${f.ucapan.value || "-"}`;

  window.open(`https://wa.me/${KONFIG.NOMOR_WA}?text=${encodeURIComponent(pesan)}`, "_blank");
});

// 5. Tombol "Salin Nomor" rekening
document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      const asli = btn.textContent;
      btn.textContent = "Tersalin ✓";
      setTimeout(() => (btn.textContent = asli), 2000);
    } catch {
      alert("Gagal menyalin, silakan salin manual: " + btn.dataset.copy);
    }
  });
});

// 6. Musik pengiring.
//    Prioritas: file MP3 (music.mp3) → kalau tidak ada/gagal, pakai nada bawaan WebAudio.
//    Dinyalakan saat tamu menekan "Buka Undangan" (gesture pengguna, lolos blokir autoplay).
var audioMp3 = new Audio();
var mp3Gagal = !KONFIG.MUSIK_MP3;
var mp3Nyala = false;
if (KONFIG.MUSIK_MP3) {
  audioMp3.src = KONFIG.MUSIK_MP3;
  audioMp3.loop = true;
  audioMp3.preload = "auto";
  audioMp3.addEventListener("error", () => { mp3Gagal = true; });
}

var ctxMusik = null, penguatMusik = null, timerMusik = null, nadaNyala = false;
var tombolMusik = document.getElementById("tombol-musik");
var NADA = [261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 349.23,
            440, 523.25, 440, 349.23, 261.63, 329.63, 392, 329.63];

function jadwalMelodi() {
  if (!nadaNyala || !ctxMusik) return;
  var mulai = ctxMusik.currentTime + 0.05;
  NADA.forEach(function (freq, i) {
    var osc = ctxMusik.createOscillator(), gain = ctxMusik.createGain();
    var t = mulai + i * 0.42;
    osc.type = i % 4 === 0 ? "triangle" : "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.055, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.36);
    osc.connect(gain); gain.connect(penguatMusik);
    osc.start(t); osc.stop(t + 0.4);
  });
  timerMusik = setTimeout(jadwalMelodi, NADA.length * 420);
}

function nadaHidup() {
  if (!ctxMusik) {
    ctxMusik = new (window.AudioContext || window.webkitAudioContext)();
    penguatMusik = ctxMusik.createGain();
    penguatMusik.gain.value = 0.33;
    penguatMusik.connect(ctxMusik.destination);
  }
  if (ctxMusik.state === "suspended") ctxMusik.resume();
  nadaNyala = true;
  jadwalMelodi();
}

function nadaMati() {
  nadaNyala = false;
  clearTimeout(timerMusik);
  if (ctxMusik) ctxMusik.suspend();
}

function musikMatiSemua() {
  try { audioMp3.pause(); } catch (e) {}
  mp3Nyala = false;
  nadaMati();
}

function setMusik(nyala) {
  if (nyala) {
    if (!mp3Gagal) {
      nadaMati();
      audioMp3.play().then(() => { mp3Nyala = true; }
      ).catch(() => { mp3Gagal = true; nadaHidup(); });
    } else {
      nadaHidup();
    }
  } else {
    musikMatiSemua();
  }
  tombolMusik.setAttribute("aria-pressed", String(nyala));
  tombolMusik.querySelector("span").textContent = nyala ? "Musik: nyala" : "Musik: mati";
}

tombolMusik.addEventListener("click", function () {
  try { setMusik(!mp3Nyala && !nadaNyala); } catch (err) { /* abaikan */ }
});

// 7. Galeri: ketuk foto → tampil penuh (lightbox) + slideshow otomatis
(function () {
  var daftar = Array.prototype.slice.call(document.querySelectorAll(".grid-galeri img"));
  if (!daftar.length) return;

  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-gambar");
  var idx = 0, timer = null;

  function tampil(i) {
    idx = (i + daftar.length) % daftar.length;
    lbImg.src = daftar[idx].src;
    lbImg.alt = daftar[idx].alt || "Foto galeri";
  }
  function jalan() {
    henti();
    timer = setInterval(() => tampil(idx + 1), KONFIG.SLIDESHOW_MS);
  }
  function henti() { if (timer) clearInterval(timer); timer = null; }
  function buka(i) {
    tampil(i);
    lb.classList.add("buka");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    jalan();
  }
  function tutup() {
    lb.classList.remove("buka");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    henti();
  }

  daftar.forEach((img, i) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => buka(i));
  });
  document.getElementById("lb-tutup").addEventListener("click", tutup);
  document.getElementById("lb-kiri").addEventListener("click", (e) => { e.stopPropagation(); tampil(idx - 1); jalan(); });
  document.getElementById("lb-kanan").addEventListener("click", (e) => { e.stopPropagation(); tampil(idx + 1); jalan(); });
  lb.addEventListener("click", (e) => { if (e.target === lb) tutup(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") tutup(); });
})();

// 8. Ucapan & doa.
//    Jika WISHES_API_URL diisi → ucapan tersimpan permanen & tampil untuk semua tamu.
//    Jika kosong → mode sampel (hanya tampil selama halaman dibuka).
function tambahUcapan(nama, pesan) {
  var item = document.createElement("article");
  item.className = "item-ucapan";
  var kuat = document.createElement("strong");
  kuat.textContent = nama; // textContent = aman dari injeksi HTML/JS
  var p = document.createElement("p");
  p.textContent = pesan;
  item.appendChild(kuat);
  item.appendChild(p);
  document.getElementById("daftar-ucapan").prepend(item);
}

(function () {
  var api = KONFIG.WISHES_API_URL;
  var daftar = document.getElementById("daftar-ucapan");

  if (api) {
    // Muat ucapan tersimpan (ganti contoh bawaan)
    fetch(api).then((r) => r.json()).then((data) => {
      if (Array.isArray(data) && data.length) {
        daftar.innerHTML = "";
        data.slice().reverse().forEach((u) => {
          if (u.nama && u.pesan) tambahUcapan(String(u.nama).slice(0, 40), String(u.pesan).slice(0, 220));
        });
      }
    }).catch(() => { /* biarkan contoh bawaan */ });
  }

  document.getElementById("form-ucapan").addEventListener("submit", function (e) {
    e.preventDefault();
    var nama = e.target.nama.value.trim().slice(0, 40);
    var pesan = e.target.pesan.value.trim().slice(0, 220);
    if (!nama || !pesan) return;

    if (api) {
      // Kirim ke Google Sheets (no-cors: terkirim tanpa baca respons)
      fetch(api, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ nama, pesan }),
      }).catch(() => {});
    }
    tambahUcapan(nama, pesan); // tampil langsung
    e.target.reset();
  });
})();
