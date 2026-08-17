// 1. Mengambil nomor surah dan mode dari alamat URL
const urlParams = new URLSearchParams(window.location.search);
const nomorSurah = urlParams.get('nomor');
const modeMembaca = urlParams.get('mode') || 'ayat'; // Menangkap pilihan: 'ayat' atau 'halaman'

const API_URL = `https://equran.id/api/v2/surat/${nomorSurah}`;
const ayatListContainer = document.getElementById('ayat-list');
const judulSurah = document.getElementById('judul-surah');
const infoSurah = document.getElementById('info-surah');

// Variabel Pendukung
let daftarAyat = [];
let currentAyatIndex = 0;
let qariAktif = '05';
let ukuranFontArab = 2.5;

async function getDetailSurah() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const surah = data.data;

    daftarAyat = surah.ayat;

    // Tampilkan Nama Surah di Header
    judulSurah.innerText = surah.namaLatin;
    infoSurah.innerText = `${surah.arti} • ${surah.jumlahAyat} Ayat`;

    // 2. Cek Mode Membaca yang Dipilih Siswa
    if (modeMembaca === 'halaman') {
      // === MODE MUSHAF (ARAB MURNI, MENYAMBUNG, TANPA LATIN & TERJEMAHAN) ===

      // Sembunyikan elemen audio
      document.getElementById('audio-container').style.display = 'none';

      ayatListContainer.innerHTML = '';

      // Buat kotak kontainer lebar bergaya lembaran mushaf
      let teksMushafHtml = `
                <div class="surat-card" style="display: block; padding: 30px; background: #fffdf9; border: 1px solid #e2dcd5; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <div style="text-align: center; border-bottom: 2px solid #007b5e; padding-bottom: 15px; margin-bottom: 25px;">
                        <h2 style="color: #007b5e; margin: 0; font-size: 1.5rem;">${surah.namaLatin}</h2>
                        <p style="color: #666; font-size: 0.9rem; margin: 5px 0 0 0;">${surah.arti} • ${surah.jumlahAyat} Ayat</p>
                    </div>
            `;

      // Tambahkan Bismillah jika bukan surah At-Taubah (Surah 9)
      if (nomorSurah != '9') {
        teksMushafHtml += `
                    <div style="text-align: center; font-family: 'Amiri Quran', serif; font-size: 2.5rem; color: #007b5e; margin-bottom: 30px;">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </div>
                `;
      }

      // Wadah teks Arab menyambung rapat ala mushaf
      teksMushafHtml += `
                <div class="font-arab" style="font-size: ${ukuranFontArab}rem; text-align: justify; direction: rtl; line-height: 2.8; color: #111; word-spacing: 3px;">
            `;

      // Gabungkan seluruh teks Arab ayat dengan nomor ayat yang bersih
      daftarAyat.forEach((ayat) => {
        const nomorAyatArab = ayat.nomorAyat.toLocaleString('ar-EG');

        // Hanya gunakan ornamen standar ayat (simbol ۝ / U+06DD) yang sudah otomatis membingkai nomor
        teksMushafHtml += `${ayat.teksArab} <span style="color: #007b5e; display: inline-block; padding: 0 4px; font-weight: bold;">&#1757;${nomorAyatArab}</span> `;
      });
      teksMushafHtml += `
                </div>
            </div>
            `;

      ayatListContainer.innerHTML = teksMushafHtml;
    } else {
      // === JIKA PILIH MODE BACA PER AYAT (DENGAN AUDIO & AUTO-SCROLL) ===

      const audioContainer = document.getElementById('audio-container');
      audioContainer.innerHTML = `
                <select id="pilih-qari" onchange="gantiQari()" style="margin-bottom: 10px; padding: 6px; border-radius: 5px; border: 1px solid #ccc; font-family: inherit; font-size: 0.9rem; background: white; color: #333; cursor: pointer;">
                    <option value="01">Abdullah Al-Juhany</option>
                    <option value="02">Abdul Muhsin Al-Qasim</option>
                    <option value="03">Abdurrahman as-Sudais</option>
                    <option value="04">Ibrahim Al-Dossari</option>
                    <option value="05" selected>Misyari Rasyid Al-Afasi</option>
                    <option value="06">Yasser Al-Dosari</option>
                </select>
                <br>
                <audio id="audio-player" controls style="width: 100%; max-width: 300px; border-radius: 30px;">
                    <source id="audio-source" src="${daftarAyat[0].audio['05']}" type="audio/mpeg">
                    Browser HP Anda tidak mendukung pemutar audio.
                </audio>
                
                <div style="margin-top: 12px; display: flex; justify-content: center; gap: 20px; font-size: 0.9rem; color: #fff;">
                    <label style="cursor: pointer;"><input type="checkbox" id="cek-latin" checked onchange="aturTampilanTeks()"> Tampilkan Latin</label>
                    <label style="cursor: pointer;"><input type="checkbox" id="cek-terjemah" checked onchange="aturTampilanTeks()"> Tampilkan Terjemahan</label>
                </div>
            `;

      const audioPlayer = document.getElementById('audio-player');

      audioPlayer.addEventListener('ended', function () {
        currentAyatIndex++;
        if (currentAyatIndex < daftarAyat.length) {
          putarAyat(currentAyatIndex);
        } else {
          currentAyatIndex = 0;
          fokusKeAyat(currentAyatIndex);
        }
      });

      audioPlayer.addEventListener('play', function () {
        fokusKeAyat(currentAyatIndex);
      });

      ayatListContainer.innerHTML = '';

      daftarAyat.forEach((ayat, index) => {
        const ayatCard = document.createElement('div');
        ayatCard.className = 'surat-card';
        ayatCard.id = `ayat-ke-${index}`;
        ayatCard.style.flexDirection = 'column';
        ayatCard.style.alignItems = 'stretch';
        ayatCard.style.gap = '10px';

        ayatCard.onclick = () => putarAyat(index);
        ayatCard.style.cursor = 'pointer';

        ayatCard.innerHTML = `
                    <div style="border-bottom: 1px solid #eee; padding-bottom: 10px;">
                        <span style="background: #007b5e; color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: bold;">Ayat ${ayat.nomorAyat}</span>
                    </div>
                    <div class="font-arab" style="font-size: ${ukuranFontArab}rem;">
                        ${ayat.teksArab}
                    </div>
                    <div class="teks-latin" style="font-size: 1rem; color: #007b5e; font-style: italic; margin-top: 5px;">
                        ${ayat.teksLatin}
                    </div>
                    <div class="teks-terjemah" style="font-size: 0.95rem; color: #444; line-height: 1.5;">
                        ${ayat.teksIndonesia}
                    </div>
                `;
        ayatListContainer.appendChild(ayatCard);
      });

      aturTampilanTeks();
    }
  } catch (error) {
    ayatListContainer.innerHTML = '<p style="text-align:center;">Gagal memuat ayat. Periksa koneksi.</p>';
  }
}

// Fungsi mengganti Qari
function gantiQari() {
  qariAktif = document.getElementById('pilih-qari').value;
  const audioPlayer = document.getElementById('audio-player');
  const isAudioPlaying = !audioPlayer.paused;

  const audioSource = document.getElementById('audio-source');
  audioSource.src = daftarAyat[currentAyatIndex].audio[qariAktif];
  audioPlayer.load();

  if (isAudioPlaying) {
    audioPlayer.play();
  }
}

// Fungsi memutar ayat spesifik
function putarAyat(index) {
  currentAyatIndex = index;
  const audioPlayer = document.getElementById('audio-player');
  const audioSource = document.getElementById('audio-source');

  audioSource.src = daftarAyat[index].audio[qariAktif];
  audioPlayer.load();
  audioPlayer.play();
}

// Fungsi Scroll & Highlight
function fokusKeAyat(index) {
  const semuaCard = document.querySelectorAll('.surat-card');
  semuaCard.forEach((card) => {
    card.style.backgroundColor = 'white';
    card.style.border = 'none';
    card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
  });

  const ayatAktif = document.getElementById(`ayat-ke-${index}`);
  if (ayatAktif) {
    ayatAktif.style.backgroundColor = '#e8f5e9';
    ayatAktif.style.border = '2px solid #007b5e';
    ayatAktif.style.boxShadow = '0 4px 8px rgba(0, 123, 94, 0.2)';
    ayatAktif.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Fungsi Menyembunyikan/Menampilkan Teks Latin & Terjemah
function aturTampilanTeks() {
  const tampilLatin = document.getElementById('cek-latin').checked;
  const tampilTerjemah = document.getElementById('cek-terjemah').checked;

  const elemenLatin = document.querySelectorAll('.teks-latin');
  const elemenTerjemah = document.querySelectorAll('.teks-terjemah');

  elemenLatin.forEach((el) => {
    el.style.display = tampilLatin ? 'block' : 'none';
  });
  elemenTerjemah.forEach((el) => {
    el.style.display = tampilTerjemah ? 'block' : 'none';
  });
}

// Fungsi Mengatur Ukuran Huruf (Zoom Text)
function ubahUkuranFont(nilai) {
  ukuranFontArab += nilai * 0.2;
  if (ukuranFontArab < 1.5) ukuranFontArab = 1.5;
  if (ukuranFontArab > 4.0) ukuranFontArab = 4.0;

  const semuaTeksArab = document.querySelectorAll('.font-arab');
  semuaTeksArab.forEach((el) => {
    el.style.fontSize = ukuranFontArab + 'rem';
  });
}

// Fungsi Mode Gelap (Dark Mode)
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
}

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
}

// Jalankan sistem utama
if (nomorSurah) {
  getDetailSurah();
} else {
  ayatListContainer.innerHTML = '<p style="text-align:center;">Surah tidak ditemukan.</p>';
}
