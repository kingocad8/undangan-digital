/* ═══════════════════════════════════════════
   RANCANG UNDANGAN — Template Pernikahan v1
   ★★★ YANG PERLU DIGANTI ADA DI BLOK INI ★★★
   ═══════════════════════════════════════════ */

const TANGGAL_ACARA = "2026-12-19T08:00:00+07:00"; // format: YYYY-MM-DDTHH:MM:SS+07:00
const NOMOR_WA = "6281234567890"; // ← GANTI dengan nomor WA mempelai/admin (format: 62...)

/* ═══════════ JANGAN UBAH DARI SINI ═══════════ */

// 0. Nama tamu personal dari ?to= di URL (mis. undangan.html?to=Bapak+Hartono)
//    Tanpa parameter → tetap tampil "Tamu Undangan".
//    Pakai textContent (bukan innerHTML) supaya aman dari injeksi kode via URL.
(function () {
  var el = document.querySelector(".nama-tamu");
  if (!el) return;
  var nama = new URLSearchParams(window.location.search).get("to");
  if (nama) {
    nama = nama.trim().slice(0, 60);
    if (nama) el.textContent = nama;
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
const target = new Date(TANGGAL_ACARA).getTime();

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

// 3. RSVP → kirim sebagai pesan WhatsApp
document.getElementById("form-rsvp").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target;

  const pesan =
    `*Konfirmasi Kehadiran*\n\n` +
    `Nama: ${f.nama.value}\n` +
    `Kehadiran: ${f.kehadiran.value}\n` +
    `Jumlah tamu: ${f.jumlah.value} orang\n` +
    `Ucapan: ${f.ucapan.value || "-"}`;

  window.open(`https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(pesan)}`, "_blank");
});

// 4. Tombol "Salin Nomor" rekening
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

// 5. Musik pengiring — dibangkitkan via WebAudio, tanpa file MP3 (nol modal).
//    Dinyalakan otomatis saat tamu menekan "Buka Undangan" (gesture pengguna),
//    bisa dimatikan/dinyalakan lewat tombol melayang.
var ctxMusik = null, penguatMusik = null, timerMusik = null, musikNyala = false;
var tombolMusik = document.getElementById("tombol-musik");
var NADA = [261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 349.23,
            440, 523.25, 440, 349.23, 261.63, 329.63, 392, 329.63];

function jadwalMelodi() {
  if (!musikNyala || !ctxMusik) return;
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

function setMusik(nyala) {
  if (nyala) {
    if (!ctxMusik) {
      ctxMusik = new (window.AudioContext || window.webkitAudioContext)();
      penguatMusik = ctxMusik.createGain();
      penguatMusik.gain.value = 0.33;
      penguatMusik.connect(ctxMusik.destination);
    }
    if (ctxMusik.state === "suspended") ctxMusik.resume();
    musikNyala = true;
    jadwalMelodi();
  } else {
    musikNyala = false;
    clearTimeout(timerMusik);
    if (ctxMusik) ctxMusik.suspend();
  }
  tombolMusik.setAttribute("aria-pressed", String(nyala));
  tombolMusik.querySelector("span").textContent = nyala ? "Musik: nyala" : "Musik: mati";
}

tombolMusik.addEventListener("click", function () {
  try { setMusik(!musikNyala); } catch (err) { /* abaikan */ }
});

// 6. Kolom ucapan — ucapan tamu langsung tampil di halaman.
//    Mode sampel: hanya tampil selama halaman dibuka (tanpa database).
document.getElementById("form-ucapan").addEventListener("submit", function (e) {
  e.preventDefault();
  var nama = e.target.nama.value.trim().slice(0, 40);
  var pesan = e.target.pesan.value.trim().slice(0, 220);
  if (!nama || !pesan) return;
  var item = document.createElement("article");
  item.className = "item-ucapan";
  var kuat = document.createElement("strong");
  kuat.textContent = nama; // textContent = aman dari injeksi HTML/JS
  var p = document.createElement("p");
  p.textContent = pesan;
  item.appendChild(kuat);
  item.appendChild(p);
  document.getElementById("daftar-ucapan").prepend(item);
  e.target.reset();
});
