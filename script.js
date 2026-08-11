// --- 1. FUNGSI SAKLAR MENU (TABS) ---
function bukaMenu(idTarget, elemenTombol) {
  // A. Sembunyikan semua wadah konten
  const semuaKonten = document.querySelectorAll('.konten-menu');
  semuaKonten.forEach((konten) => {
    konten.style.display = 'none';
  });

  // B. Hilangkan warna aktif (hijau) dari semua tombol
  const semuaTombol = document.querySelectorAll('.btn-menu');
  semuaTombol.forEach((tombol) => {
    tombol.classList.remove('aktif');
  });

  // C. Tampilkan hanya wadah konten yang dipilih
  document.getElementById(idTarget).style.display = 'block';

  // D. Beri warna hijau (aktif) pada tombol yang baru saja diklik
  elemenTombol.classList.add('aktif');
}

// --- 2. FUNGSI MENGAMBIL DATA SURAH & PENCARIAN ---
const API_URL = 'https://equran.id/api/v2/surat';
const suratListContainer = document.getElementById('surat-list');

// Variabel ini bertugas 'mengingat' data 114 surat agar tidak perlu loading internet terus-menerus saat mengetik
let dataSuratGlobal = [];

async function getDaftarSurat() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    dataSuratGlobal = data.data; // Simpan data ke memori
    tampilkanDaftarSurat(dataSuratGlobal); // Tampilkan semua surat saat awal dibuka
  } catch (error) {
    suratListContainer.innerHTML = '<p style="text-align:center;">Gagal memuat data. Periksa koneksi internet.</p>';
  }
}

// Fungsi khusus untuk menyusun HTML surat (Dipisah agar mudah dipanggil oleh fitur pencarian)
function tampilkanDaftarSurat(dataSurat) {
  suratListContainer.innerHTML = ''; // Kosongkan layar dulu

  // Jika surat yang dicari tidak ada
  if (dataSurat.length === 0) {
    suratListContainer.innerHTML = '<p style="text-align:center; color: #666; margin-top: 20px;">Surat tidak ditemukan.</p>';
    return;
  }

  // Susun surat hasil saringan ke layar
  dataSurat.forEach((surat) => {
    const card = document.createElement('div');
    card.className = 'surat-card';
    card.style.marginBottom = '12px'; // Tambahan jarak antar kotak

    card.onclick = () => {
      nomorSuratPilihan = surat.nomor; // Simpan nomor surat
      document.getElementById('modal-template').style.display = 'flex'; // Munculkan pop-up
    };

    card.innerHTML = `
            <div class="surat-info">
                <h2 style="font-size: 1.2rem; margin-bottom: 5px;">${surat.nomor}. ${surat.namaLatin}</h2>
                <p style="font-size: 0.9rem; color: #666;">${surat.arti} (${surat.jumlahAyat} Ayat)</p>
            </div>
            <div class="surat-arab" style="font-family: 'Amiri Quran', serif; font-size: 1.8rem; font-weight: bold; text-align: right; color: #007b5e;">
                ${surat.nama}
            </div>
        `;
    suratListContainer.appendChild(card);
  });
}
// Tambahkan fungsi untuk menutup atau melanjutkan dari modal di bagian paling bawah script.js:
function tutupModal() {
  document.getElementById('modal-template').style.display = 'none';
}

function lanjutkanMembaca() {
  // Cek mode mana yang dipilih oleh pengguna (ayat atau halaman)
  const modeTerpilih = document.querySelector('input[name="pilihan-mode"]:checked').value;

  // Buka halaman surah dengan membawa parameter nomor dan mode
  window.location.href = `surah.html?nomor=${nomorSuratPilihan}&mode=${modeTerpilih}`;
}

// Fitur Pencarian (Akan aktif setiap kali Anda mengetik huruf di kolom pencarian)
function cariSurat() {
  // Ambil kata yang diketik, ubah jadi huruf kecil semua agar pencarian lebih mudah
  const kataKunci = document.getElementById('cari-surat').value.toLowerCase();

  // Saring (filter) data 114 surat yang cocok dengan ketikan
  const hasilFilter = dataSuratGlobal.filter((surat) => {
    // Bisa mencari berdasarkan Nama Surat ATAU Artinya
    return surat.namaLatin.toLowerCase().includes(kataKunci) || surat.arti.toLowerCase().includes(kataKunci);
  });

  // Tampilkan hasil saringannya ke layar
  tampilkanDaftarSurat(hasilFilter);
}

// Panggil fungsi saat web pertama kali dibuka
getDaftarSurat();

// --- 4. FUNGSI MENAMPILKAN MATERI TAJWID (MODEL DAFTAR LIPAT) ---
const tajwidContainer = document.getElementById('tajwid');

// Data Materi Tajwid Standar (Disimpan dalam bentuk Array Lokal)
const dataTajwid = [
  {
    judul: '1. Hukum Nun Sukun (نْ) dan Tanwin (ـً ـٍ ـٌ)',
    isi: `Hukum ini terjadi jika Nun Sukun atau Tanwin bertemu dengan huruf hijaiyah tertentu. Terbagi menjadi 5 jenis:
        <ul style="text-align: left; margin-top: 10px; padding-left: 20px;">
            <li><b>Izhar Halqi:</b> Dibaca jelas tanpa dengung. (Huruf: ء, هـ, ع, ح, غ, خ)</li>
            <li><b>Idgham Bighunnah:</b> Dimasukkan ke huruf depannya dengan dengung. (Huruf: ي, ن, م, و)</li>
            <li><b>Idgham Bilaghunnah:</b> Dimasukkan ke huruf depannya tanpa dengung. (Huruf: ل, ر)</li>
            <li><b>Iqlab:</b> Bunyi 'Nun' ditukar menjadi bunyi 'Mim' (م) berdengung. (Huruf: ب)</li>
            <li><b>Ikhfa Haqiqi:</b> Dibaca samar-samar antara Izhar dan Idgham, disertai dengung. (15 Huruf sisanya, misal: ت, ث, ج, د, dst)</li>
        </ul>`,
  },
  {
    judul: '2. Hukum Mim Sukun (مْ)',
    isi: `Hukum ini terjadi jika Mim Sukun bertemu huruf hijaiyah. Terbagi menjadi 3 jenis:
        <ul style="text-align: left; margin-top: 10px; padding-left: 20px;">
            <li><b>Ikhfa Syafawi:</b> Mim sukun bertemu huruf Ba (ب). Dibaca samar di bibir dengan dengung.</li>
            <li><b>Idgham Mimi (Mutamatsilain):</b> Mim sukun bertemu huruf Mim (م). Dibaca melebur dan berdengung.</li>
            <li><b>Izhar Syafawi:</b> Mim sukun bertemu semua huruf selain Mim dan Ba. Dibaca jelas, bibir tertutup rapat.</li>
        </ul>`,
  },
  {
    judul: '3. Hukum Qalqalah',
    isi: `Qalqalah artinya pantulan atau getaran suara. Hurufnya ada 5 yaitu: ق, ط, ب, ج, د (Bisa disingkat: Ba-Ju-Di-To-Qo).
        <ul style="text-align: left; margin-top: 10px; padding-left: 20px;">
            <li><b>Qalqalah Sughra (Kecil):</b> Huruf qalqalah mati/sukun di tengah-tengah kata. Pantulannya dibaca ringan.</li>
            <li><b>Qalqalah Kubra (Besar):</b> Huruf qalqalah mati karena waqaf (berhenti) di akhir kalimat. Pantulannya dibaca kuat dan jelas.</li>
        </ul>`,
  },
  {
    judul: '4. Hukum Mad Dasar',
    isi: `Mad artinya memanjangkan bacaan. Berikut adalah 3 hukum Mad yang paling sering ditemui:
        <ul style="text-align: left; margin-top: 10px; padding-left: 20px;">
            <li><b>Mad Thabi'i:</b> Fathah diikuti Alif, Kasrah diikuti Ya sukun, Dhammah diikuti Wawu sukun. Panjang bacaannya 2 harakat (1 alif).</li>
            <li><b>Mad Wajib Muttasil:</b> Mad Thabi'i bertemu huruf Hamzah (ء) di dalam <b>satu kata</b> yang sama. Panjangnya wajib 4-5 harakat.</li>
            <li><b>Mad Jaiz Munfasil:</b> Mad Thabi'i bertemu huruf Hamzah (ء) di <b>kata yang berbeda</b>. Panjangnya boleh 2, 4, atau 5 harakat.</li>
        </ul>`,
  },
  {
    judul: '5. Hukum Alif Lam (ال)',
    isi: `Cara membaca Alif Lam (ال) jika bertemu huruf hijaiyah terbagi menjadi 2 jenis:
        <ul style="text-align: left; margin-top: 10px; padding-left: 20px;">
            <li><b>Alif Lam Qamariyah:</b> Huruf 'Lam' dibaca tampak dan jelas. Cirinya ada tanda sukun di atas huruf Lam.</li>
            <li><b>Alif Lam Syamsiyah:</b> Huruf 'Lam' tidak dibaca melainkan dilebur (di-idgham-kan) ke huruf setelahnya. Cirinya terdapat tanda tasydid di huruf setelah Lam.</li>
        </ul>`,
  },
];

function tampilkanTajwid() {
  // Buat kerangka utama
  let htmlContent = `
        <div class="surat-container" style="max-width: 600px; margin: 0 auto;">
            <div style="background: #007b5e; color: white; padding: 15px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
                <h2>Belajar Tajwid Dasar</h2>
                <p style="opacity: 0.8; margin: 0; font-size: 0.9rem;">Sentuh materi untuk membaca penjelasan</p>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
    `;

  // Looping data tajwid menjadi daftar lipat
  dataTajwid.forEach((materi, index) => {
    htmlContent += `
            <div style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #eee;">
                
                <div onclick="bukaLipatanTajwid(${index})" style="padding: 15px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; background: #fdfdfd;">
                    <div style="font-weight: bold; color: #333; font-size: 1.05rem;">
                        ${materi.judul}
                    </div>
                    <div id="ikon-tajwid-${index}" style="color: #007b5e; font-weight: bold; font-size: 1.2rem; transition: transform 0.3s ease;">+</div>
                </div>
                
                <div id="isi-tajwid-${index}" style="display: none; padding: 20px; background: white; border-top: 1px dashed #eee; font-size: 0.95rem; color: #444; line-height: 1.6;">
                    ${materi.isi}
                </div>
                
            </div>
        `;
  });

  htmlContent += `</div></div>`;

  // Suntikkan ke layar HTML
  tajwidContainer.innerHTML = htmlContent;
}

// Fungsi Interaktif: Membuka dan Menutup Lipatan Tajwid
function bukaLipatanTajwid(index) {
  const isi = document.getElementById(`isi-tajwid-${index}`);
  const ikon = document.getElementById(`ikon-tajwid-${index}`);

  if (isi.style.display === 'none') {
    isi.style.display = 'block';
    ikon.innerText = '−';
    ikon.style.transform = 'rotate(180deg)';
  } else {
    isi.style.display = 'none';
    ikon.innerText = '+';
    ikon.style.transform = 'rotate(0deg)';
  }
}

// Panggil fungsi saat web dimuat
tampilkanTajwid();

// --- 5. FUNGSI MENAMPILKAN DOA HARIAN (MODEL DAFTAR LIPAT) ---
const doaContainer = document.getElementById('doa-list');

// Data doa (Anda bisa menambahkan terus sampai 100 doa di sini nantinya)
const dataDoaHarian = [
  {
    judul: '1. Doa Sebelum Belajar',
    arab: 'رَبِّ زِدْنِي عِلْمًا, وَارْزُقْنِي فَهْمًا',
    latin: "Robbi zidnii 'ilmaa, warzuqnii fahmaa.",
    arti: 'Ya Allah, tambahkanlah aku ilmu dan berikanlah aku rezeki pemahaman.',
  },
  {
    judul: '2. Doa Sesudah Belajar',
    arab: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
    latin: 'Subhaanaka Alloohumma wabihamdika asyhadu an laa ilaaha illaa anta astaghfiruka wa atuubu ilaik.',
    arti: 'Mahasuci Engkau ya Allah dan dengan memuji-Mu, aku bersaksi bahwa tiada tuhan kecuali Engkau. Aku memohon ampunan dan bertaubat kepada-Mu.',
  },

  {
    judul: '3. Doa Untuk Kedua Orang Tua',
    arab: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    latin: 'Rabbighfir lii waliwaalidayya warhamhumaa kamaa rabbayaanii shagiiraa.',
    arti: 'Ya Allah, ampunilah dosaku dan dosa kedua orang tuaku, dan kasihilah keduanya sebagaimana mereka mengasihi aku di waktu kecil.',
  },
  {
    judul: '4. Doa Kebaikan Dunia & Akhirat (Sapu Jagat)',
    arab: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    latin: "Rabbanaa aatinaa fid-dunyaa hasanah, wa fil-aakhirati hasanah, wa qinaa 'adzaaban-naar.",
    arti: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.',
  },
  {
    judul: '5. Doa Bangun Tidur',
    arab: 'اَلْحَمْدُ لِلَّهِ الَّذِيْ أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُوْرُ',
    latin: "Alhamdullillahilladzi ahyaanaa ba'da maa amaatanaa wa ilaihin nushur.",
    arti: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya lah kami kembali.',
  },
  {
    judul: '6. Doa Sebelum Tidur',
    arab: 'بِاسْمِكَ اللّٰهُمَّ أَحْيَا وَبِاسْمِكَ أَمُوتُ',
    latin: 'Bismikallaahumma ahyaa wa bismika amuutu.',
    arti: 'Dengan menyebut nama-Mu ya Allah, aku hidup dan dengan menyebut nama-Mu aku mati.',
  },
  {
    judul: '7. Doa Sebelum Makan',
    arab: 'اَللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
    latin: "Allahumma baarik lanaa fiimaa razaqtanaa wa qinaa 'adzaaban-naar.",
    arti: 'Ya Allah, berkahilah kami dalam rezeki yang telah Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka.',
  },
  {
    judul: '8. Doa Sesudah Makan',
    arab: 'اَلْحَمْدُ لِلَّهِ الَّذِيْ أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِيْنَ',
    latin: "Alhamdulillahilladzi ath'amanaa wa saqaanaa wa ja'alanaa muslimiin.",
    arti: 'Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami termasuk golongan orang muslim.',
  },
  {
    judul: '9. Doa Masuk Kamar Mandi / WC',
    arab: 'اَللّٰهُمَّ إِنِّيْ أَعُوْذُبِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    latin: "Allahumma innii a'uudzubika minal khubutsi wal khabaa'its.",
    arti: 'Ya Allah, sesungguhnya aku berlindung kepada-Mu dari godaan setan laki-laki dan setan perempuan.',
  },
  {
    judul: '10. Doa Keluar Kamar Mandi / WC',
    arab: 'غُفْرَانَكَ اَلْحَمْدُ لِلَّهِ الَّذِيْ أَذْهَبَ عَنِّي الْأَذَى وَعَافَانِيْ',
    latin: "Ghufraanaka, alhamdulillahilladzi adzhaba 'annil adzaa wa 'aafaanii.",
    arti: 'Aku memohon ampunan-Mu. Segala puji bagi Allah yang telah menghilangkan kotoran dari diriku dan memberiku kesehatan.',
  },
  {
    judul: '11. Doa Memakai Pakaian',
    arab: 'اَلْحَمْدُ لِلَّهِ الَّذِيْ كَسَانِيْ هَذَا وَرَزَقَنِيْهِ مِنْ غَيْرِ حَوْلٍ مِنِّيْ وَلَا قُوَّةٍ',
    latin: 'Alhamdulillahilladzi kasaanii haadzaa wa razaqaniihi min ghairi hawlin minnii wa laa quwwatin.',
    arti: 'Segala puji bagi Allah yang telah memakaikan pakaian ini kepadaku dan mengaruniakannya kepadaku tanpa daya dan kekuatan dariku.',
  },
  {
    judul: '12. Doa Melepas Pakaian',
    arab: 'بِسْمِ اللَّهِ الَّذِيْ لَا إِلَهَ إِلَّا هُوَ',
    latin: 'Bismillahilladzi laa ilaaha illaa huwa.',
    arti: 'Dengan nama Allah yang tiada Tuhan selain-Nya.',
  },
  {
    judul: '13. Doa Bercermin',
    arab: 'اَللَّهُمَّ كَمَا حَسَّنْتَ خَلْقِيْ فَحَسِّنْ خُلُقِيْ',
    latin: 'Allahumma kamaa hassanta khalqii fahassin khuluqii.',
    arti: 'Ya Allah, sebagaimana Engkau telah membaguskan penciptaanku, maka baguskanlah pula akhlakku.',
  },
  {
    judul: '14. Doa Keluar Rumah',
    arab: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    latin: "Bismillaahi tawakkaltu 'alallahi, laa hawla wa laa quwwata illa billah.",
    arti: 'Dengan nama Allah, aku bertawakkal kepada Allah. Tidak ada daya dan kekuatan kecuali dengan pertolongan Allah.',
  },
  {
    judul: '15. Doa Masuk Rumah',
    arab: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا',
    latin: "Bismillahi walajnaa, wa bismillahi kharajnaa, wa 'alaa rabbinaa tawakkalnaa.",
    arti: 'Dengan nama Allah kami masuk, dengan nama Allah kami keluar, dan hanya kepada Tuhan kamilah kami bertawakkal.',
  },
  {
    judul: '16. Doa Naik Kendaraan',
    arab: 'سُبْحَانَ الَّذِيْ سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِيْنَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُوْنَ',
    latin: 'Subhaanalladzi sakhkhara lanaa haadzaa wa maa kunnaa lahu muqriniin, wa innaa ilaa rabbinaa lamunqalibuun.',
    arti: 'Maha Suci Allah yang telah menundukkan kendaraan ini bagi kami, padahal sebelumnya kami tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami.',
  },
  {
    judul: '17. Doa Sebelum Wudhu',
    arab: 'بِسْمِ اللَّهِ',
    latin: 'Bismillah.',
    arti: 'Dengan menyebut nama Allah.',
  },
  {
    judul: '18. Doa Sesudah Wudhu',
    arab: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اَللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
    latin: "Asyhadu an laa ilaaha illallaah wahdahu laa syariika lahu, wa asyhadu anna muhammadan 'abduhu wa rasuuluhu. Allahummaj'alnii minat tawwaabiina waj'alnii minal mutathahhiriin.",
    arti: 'Aku bersaksi tiada Tuhan selain Allah Yang Maha Esa tiada sekutu bagi-Nya, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya. Ya Allah, jadikanlah aku termasuk orang-orang yang bertobat dan jadikanlah aku termasuk orang-orang yang mensucikan diri.',
  },
  {
    judul: '19. Doa Masuk Masjid',
    arab: 'اَللَّهُمَّ افْتَحْ لِيْ أَبْوَابَ رَحْمَتِكَ',
    latin: 'Allahummaftah lii abwaaba rahmatik.',
    arti: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.',
  },
  {
    judul: '20. Doa Keluar Masjid',
    arab: 'اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ مِنْ فَضْلِكَ',
    latin: 'Allahumma innii as-aluka min fadhlik.',
    arti: 'Ya Allah, sesungguhnya aku memohon karunia-Mu.',
  },
  {
    judul: '21. Doa Setelah Mendengar Adzan',
    arab: 'اَللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيْلَةَ وَالْفَضِيْلَةَ وَابْعَثْهُ مَقَامًا مَحْمُوْدًا الَّذِيْ وَعَدْتَهُ',
    latin: "Allahumma rabba haadzihid da'watit taammah, wash-shalaatil qaa-imah, aati muhammadanil wasiilata wal fadhiilah, wab'atshu maqaaman mahmuudani alladzii wa'adtah.",
    arti: 'Ya Allah, Tuhan pemilik panggilan yang sempurna ini dan shalat yang didirikan, berilah Nabi Muhammad wasilah (tempat yang tinggi) dan keutamaan, serta bangkitkanlah ia di tempat yang terpuji yang telah Engkau janjikan.',
  },
  {
    judul: '22. Doa Memohon Kelancaran Lisan (Doa Nabi Musa)',
    arab: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي',
    latin: "Rabbisyrah lii shadrii, wayassir lii amrii, wahlul 'uqdatan min lisaanii, yafqahuu qaulii.",
    arti: 'Ya Tuhanku, lapangkanlah dadaku, mudahkanlah urusanku, dan lepaskanlah kekakuan dari lidahku supaya mereka mengerti perkataanku.',
  },
  {
    judul: '23. Doa Memohon Kemudahan Urusan',
    arab: 'اَللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
    latin: "Allahumma laa sahla illaa maa ja'altahu sahlan, wa anta taj'alul hazna idzaa syi'ta sahlan.",
    arti: 'Ya Allah, tidak ada kemudahan kecuali apa yang Engkau jadikan mudah, dan Engkaulah yang menjadikan kesulitan itu mudah apabila Engkau kehendaki.',
  },
  {
    judul: '24. Doa Memohon Ilmu yang Bermanfaat',
    arab: 'اَللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا',
    latin: "Allahumma innii as-aluka 'ilman naafi'an wa rizqan thayyiban wa 'amalan mutaqabbalan.",
    arti: 'Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang halal, dan amal yang diterima.',
  },
  {
    judul: '25. Doa Masuk Pasar / Mall',
    arab: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ، وَهُوَ حَيٌّ لَا يَمُوتُ، بِيَدِهِ الْخَيْرُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    latin: "Laa ilaaha illallah wahdahu laa syariika lah, lahul mulku wa lahul hamdu yuhyii wa yumiit, wa huwa hayyun laa yamuut, biyadihil khairu wa huwa 'alaa kulli syai-in qadiir.",
    arti: 'Tidak ada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya, milik-Nya segala kerajaan dan pujian, yang menghidupkan dan mematikan, Dialah Yang Maha Hidup dan tidak mati, di tangan-Nya segala kebaikan dan Dia Maha Kuasa atas segala sesuatu.',
  },
  {
    judul: '26. Doa Saat Turun Hujan',
    arab: 'اَللَّهُمَّ صَيِّبًا نَافِعًا',
    latin: "Allahumma shayyiban naafi'an.",
    arti: 'Ya Allah, turunkanlah hujan yang bermanfaat.',
  },
  {
    judul: '27. Doa Setelah Hujan Berhenti',
    arab: 'مُطِرْنَا بِفَضْلِ اللَّهِ وَرَحْمَتِهِ',
    latin: 'Muthirnaa bi fadhlillahi wa rahmatihi.',
    arti: 'Kita diberi hujan karena karunia Allah dan rahmat-Nya.',
  },
  {
    judul: '28. Doa Ketika Mendengar Petir',
    arab: 'سُبْحَانَ الَّذِيْ يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلَائِكَةُ مِنْ خِيْفَتِهِ',
    latin: "Subhaanalladzi yusabbihur ra'du bi hamdihi wal malaa-ikatu min khiifatih.",
    arti: 'Maha Suci Allah yang petir bertasbih dengan memuji-Nya, begitu juga para malaikat karena takut kepada-Nya.',
  },
  {
    judul: '29. Doa Saat Angin Kencang',
    arab: 'اَللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا وَخَيْرَ مَا فِيْهَا وَخَيْرَ مَا أُرْسِلَتْ بِهِ، وَأَعُوْذُ بِكَ مِنْ شَرِّهَا وَشَرِّ مَا فِيْهَا وَشَرِّ مَا أُرْسِلَتْ بِهِ',
    latin: "Allahumma innii as-aluka khairahaa wa khaira maa fiihaa wa khaira maa ursilat bihi, wa a'uudzubika min syarrihaa wa syarri maa fiihaa wa syarri maa ursilat bihi.",
    arti: 'Ya Allah, aku memohon kepada-Mu kebaikan angin ini, kebaikan yang ada di dalamnya, dan kebaikan yang diutus bersamanya. Dan aku berlindung kepada-Mu dari keburukannya, keburukan yang ada di dalamnya, dan keburukan yang diutus bersamanya.',
  },
  {
    judul: '30. Doa Menahan Marah',
    arab: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    latin: "A'uudzu billaahi minasy syaithaanir rajiim.",
    arti: 'Aku berlindung kepada Allah dari godaan setan yang terkutuk.',
  },
  {
    judul: '31. Doa Ketika Lupa',
    arab: 'سُبْحَانَ مَنْ لَا يَنَامُ وَلَا يَسْهُوْ',
    latin: 'Subhaana man laa yanaamu wa laa yashuu.',
    arti: 'Maha Suci Zat yang tidak tidur dan tidak lupa.',
  },
  {
    judul: '32. Doa Ketika Bersin',
    arab: 'اَلْحَمْدُ لِلَّهِ',
    latin: 'Alhamdulillah.',
    arti: 'Segala puji bagi Allah.',
  },
  {
    judul: '33. Doa Menjawab Orang yang Bersin',
    arab: 'يَرْحَمُكَ اللَّهُ',
    latin: 'Yarhamukallah.',
    arti: 'Semoga Allah merahmatimu (dibaca oleh yang mendengar).',
  },
  {
    judul: '34. Balasan Untuk Orang yang Menjawab Bersin',
    arab: 'يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ',
    latin: 'Yahdiikumullahu wa yushlihu baalakum.',
    arti: 'Semoga Allah memberimu petunjuk dan memperbaiki keadaanmu.',
  },
  {
    judul: '35. Doa Ketika Sedang Sakit (Dibaca Sambil Memegang Bagian yang Sakit)',
    arab: 'بِسْمِ اللَّهِ (×3) أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ (×7)',
    latin: "Bismillah (3x). A'uudzu billaahi wa qudratihi min syarri maa ajidu wa uhaadziru (7x).",
    arti: 'Dengan nama Allah (3x). Aku berlindung kepada Allah dan kekuasaan-Nya dari keburukan yang aku rasakan dan aku khawatirkan (7x).',
  },
  {
    judul: '36. Doa Menjenguk Orang Sakit',
    arab: 'أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ',
    latin: "As-alullahal 'azhiim rabbal 'arsyil 'azhiim an yasyfiyak.",
    arti: 'Aku memohon kepada Allah Yang Maha Agung, Tuhan Arsy yang agung, agar Dia menyembuhkanmu.',
  },
  {
    judul: '37. Doa Tertimpa Musibah',
    arab: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا',
    latin: "Inna lillaahi wa innaa ilaihi raaji'uun. Allahumma'jurnii fii mushiibatii wa akhlif lii khairan minhaa.",
    arti: 'Sesungguhnya kami milik Allah dan kepada-Nya kami kembali. Ya Allah, berilah pahala dalam musibahku ini dan gantikanlah dengan yang lebih baik daripadanya.',
  },
  {
    judul: '38. Doa Perlindungan Dari Penyakit Berbahaya',
    arab: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبَرَصِ وَالْجُنُونِ وَالْجُذَامِ وَمِنْ سَيِّئِ الْأَسْقَامِ',
    latin: "Allahumma innii a'uudzubika minal barashi wal junuuni wal judzaami wa min sayyi-il asqaam.",
    arti: 'Ya Allah, aku berlindung kepada-Mu dari penyakit belang, gila, kusta, dan dari segala penyakit yang buruk/mengerikan.',
  },
  {
    judul: '39. Doa Ketika Mimpi Baik',
    arab: 'اَلْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِيْنَ',
    latin: "Alhamdulillahi rabbil 'aalamiin.",
    arti: 'Segala puji bagi Allah, Tuhan semesta alam.',
  },
  {
    judul: '40. Doa Ketika Mimpi Buruk',
    arab: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ وَمِنْ شَرِّ هَذِهِ الرُّؤْيَا',
    latin: "A'uudzu billaahi minasy syaithaanir rajiim wa min syarri haadzihir ru'yaa.",
    arti: 'Aku berlindung kepada Allah dari godaan setan yang terkutuk dan dari keburukan mimpi ini.',
  },
  {
    judul: '41. Doa Berbuka Puasa',
    arab: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
    latin: "Dzahabazh zhama'u wabtallatil 'uruuqu wa tsabatal ajru in syaa-allah.",
    arti: 'Telah hilang rasa haus, telah basah urat-urat, dan telah ditetapkan pahala, insya Allah.',
  },
  {
    judul: '42. Doa Di Pagi Hari',
    arab: 'اَللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    latin: 'Allahumma bika ashbahnaa, wa bika amsainaa, wa bika nahyaa, wa bika namuutu, wa ilaikan nusyuur.',
    arti: 'Ya Allah, dengan rahmat-Mu kami memasuki waktu pagi, dengan rahmat-Mu kami memasuki waktu sore, dengan rahmat-Mu kami hidup, dengan rahmat-Mu kami mati, dan kepada-Mu kami dibangkitkan.',
  },
  {
    judul: '43. Doa Di Sore Hari',
    arab: 'اَللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
    latin: 'Allahumma bika amsainaa, wa bika ashbahnaa, wa bika nahyaa, wa bika namuutu, wa ilaikal mashiir.',
    arti: 'Ya Allah, dengan rahmat-Mu kami memasuki waktu sore, dengan rahmat-Mu kami memasuki waktu pagi, dengan rahmat-Mu kami hidup, dengan rahmat-Mu kami mati, dan kepada-Mu tempat kembali.',
  },
  {
    judul: '44. Doa Memohon Kesabaran',
    arab: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَتَوَفَّنَا مُسْلِمِينَ',
    latin: "Rabbanaa afrigh 'alainaa shabran wa tawaffanaa muslimiin.",
    arti: 'Ya Tuhan kami, limpahkanlah kesabaran kepada kami dan matikanlah kami dalam keadaan berserah diri (kepada-Mu).',
  },
  {
    judul: '45. Doa Berlindung Dari Rasa Malas',
    arab: 'اَللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْهَرَمِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ',
    latin: "Allahumma innii a'uudzubika minal 'ajzi wal kasali, wal jubni wal harami wal bukhli, wa a'uudzubika min 'adzaabil qabri, wa min fitnatil mahyaa wal mamaat.",
    arti: 'Ya Allah, aku berlindung kepada-Mu dari kelemahan, rasa malas, sifat pengecut, kepikunan, dan sifat kikir. Aku juga berlindung kepada-Mu dari siksa kubur, serta fitnah kehidupan dan kematian.',
  },
  {
    judul: '46. Doa Tolak Bala (Bencana)',
    arab: 'اَللَّهُمَّ ادْفَعْ عَنَّا الْبَلَاءَ وَالْوَبَاءَ وَالزَّلَازِلَ وَالْمِحَنَ مَا ظَهَرَ مِنْهَا وَمَا بَطَنَ',
    latin: "Allahummadfa' 'annal balaa-a wal wabaa-a waz-zalaazila wal mihan maa zhahara minhaa wa maa bathan.",
    arti: 'Ya Allah, hindarkanlah kami dari bala, wabah penyakit, gempa bumi, dan ujian, baik yang tampak maupun yang tersembunyi.',
  },
  {
    judul: '47. Doa Keteguhan Hati',
    arab: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
    latin: "Yaa muqallibal quluub, tsabbit qalbii 'alaa diinik.",
    arti: 'Wahai Dzat yang membolak-balikkan hati, teguhkanlah hatiku di atas agama-Mu.',
  },
  {
    judul: '48. Doa Memohon Ampunan Dosa Masa Lalu & Masa Depan',
    arab: 'اَللَّهُمَّ اغْفِرْ لِي مَا قَدَّمْتُ وَمَا أَخَّرْتُ، وَمَا أَسْرَرْتُ وَمَا أَعْلَنْتُ، وَمَا أَسْرَفْتُ، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّي',
    latin: "Allahummaghfirlii maa qaddamtu wa maa akhkhartu, wa maa asrartu wa maa a'lantu, wa maa asraftu, wa maa anta a'lamu bihi minnii.",
    arti: 'Ya Allah, ampunilah dosaku yang telah lalu dan yang akan datang, yang aku sembunyikan dan yang aku tampakkan, yang aku lakukan secara berlebihan, dan apa-apa yang Engkau lebih mengetahuinya daripadaku.',
  },
  {
    judul: '49. Doa Penutup Majelis (Kafaratul Majelis)',
    arab: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
    latin: 'Subhaanakallahumma wa bihamdika, asyhadu an laa ilaaha illaa anta, astaghfiruka wa atuubu ilaik.',
    arti: 'Maha Suci Engkau ya Allah, dan dengan memuji-Mu. Aku bersaksi bahwa tiada Tuhan selain Engkau. Aku memohon ampun kepada-Mu dan bertaubat kepada-Mu.',
  },
  {
    judul: '50. Doa Mensyukuri Nikmat',
    arab: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ',
    latin: "Rabbi auzi'nii an asykura ni'matakal latii an'amta 'alayya wa 'alaa waalidayya wa an a'mala shaalihan tardhaahu, wa adkhilnii birahmatika fii 'ibaadikash shaalihiin.",
    arti: 'Ya Tuhanku, berilah aku petunjuk agar aku dapat mensyukuri nikmat-Mu yang telah Engkau limpahkan kepadaku dan kepada kedua orang tuaku, dan agar aku dapat berbuat amal saleh yang Engkau ridhai; dan masukkanlah aku dengan rahmat-Mu ke dalam golongan hamba-hamba-Mu yang saleh.',
  },

  {
    judul: '51. Doa Setelah Sholat Wajib',
    arab: 'أَسْتَغْفِرُ اللهَ (×3) اَللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ ذَا الْجَلَالِ وَالْإِكْرَامِ',
    latin: 'Astaghfirullah (3x). Allahumma antas salaam, wa minkas salaam, tabaarakta dzal jalaali wal ikraam.',
    arti: 'Aku memohon ampun kepada Allah (3x). Ya Allah, Engkau Mahasejahtera, dan dari-Mu kesejahteraan, Maha Suci Engkau, wahai Rabb pemilik keagungan dan kemuliaan.',
  },
  {
    judul: '52. Doa Sholat Jenazah (Untuk Mayit)',
    arab: 'اَللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ',
    latin: "Allahummaghfir lahu warhamhu wa 'aafihi wa'fu 'anhu.",
    arti: 'Ya Allah, ampunilah dia, berilah rahmat kepadanya, selamatkanlah dia, dan maafkanlah kesalahannya.',
  },
  {
    judul: '53. Doa Setelah Sholat Dhuha',
    arab: 'اَللّٰهُمَّ اِنَّ الضُّحَآءَ ضُحَاءُكَ، وَالْبَهَاءَ بَهَاءُكَ، وَالْجَمَالَ جَمَالُكَ، وَالْقُوَّةَ قُوَّتُكَ، وَالْقُدْرَةَ قُدْرَتُكَ، وَالْعِصْمَةَ عِصْمَتُكَ',
    latin: "Allahumma innadh dhuhaa-a dhuhaa-uka, wal bahaa-a bahaa-uka, wal jamaala jamaaluka, wal quwwata quwwatuka, wal qudrata qudratuka, wal 'ishmata 'ishmatuka.",
    arti: 'Ya Allah, sesungguhnya waktu dhuha adalah waktu dhuha-Mu, keagungan adalah keagungan-Mu, keindahan adalah keindahan-Mu, kekuatan adalah kekuatan-Mu, kekuasaan adalah kekuasaan-Mu, dan penjagaan adalah penjagaan-Mu.',
  },
  {
    judul: '54. Doa Setelah Sholat Tahajud',
    arab: 'اَللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ قَيِّمُ السَّمَاوَاتِ وَالْأَرْضِ وَمَنْ فِيهِنَّ، وَلَكَ الْحَمْدُ لَكَ مُلْكُ السَّمَاوَاتِ وَالْأَرْضِ وَمَنْ فِيهِنَّ',
    latin: 'Allahumma lakal hamdu anta qayyimus samaawaati wal ardhi wa man fiihinna, wa lakal hamdu laka mulkus samaawaati wal ardhi wa man fiihinna.',
    arti: 'Ya Allah, bagi-Mu segala puji, Engkaulah penegak langit dan bumi serta segala isinya. Bagi-Mu segala puji, milik-Mu lah kerajaan langit dan bumi serta segala isinya.',
  },
  {
    judul: '55. Doa Setelah Sholat Tarawih (Doa Kamilin)',
    arab: 'اَللّٰهُمَّ اجْعَلْنَا بِالْإِيْمَانِ كَامِلِيْنَ، وَلِلْفَرَائِضِ مُؤَدِّيْنَ، وَلِلصَّلَاةِ حَافِظِيْنَ، وَلِلزَّكَاةِ فَاعِلِيْنَ، وَلِمَا عِنْدَكَ طَالِبِيْنَ',
    latin: "Allahummaj'alnaa bil iimaani kaamiliin, wa lil faraa-idhi mu-addiin, wa lish-shalaati haafidhiin, wa liz-zakaati faa'iliin, wa limaa 'indaka thaalibiin.",
    arti: 'Ya Allah, jadikanlah kami orang-orang yang sempurna imannya, yang melaksanakan kewajiban-kewajiban, yang memelihara shalat, yang menunaikan zakat, dan yang mengharapkan karunia di sisi-Mu.',
  },
  {
    judul: '56. Doa Setelah Sholat Witir',
    arab: 'سُبْحَانَ الْمَلِكِ الْقُدُّوسِ (×3) رَبِّ الْمَلَائِكَةِ وَالرُّوْحِ',
    latin: 'Subhaanal malikil qudduus (3x), rabbil malaa-ikati war-ruuh.',
    arti: 'Maha Suci Engkau, Penguasa Yang Maha Suci (3x), Tuhan para malaikat dan Jibril.',
  },
  {
    judul: '57. Doa (Niat) Mandi Wajib',
    arab: 'نَوَيْتُ الْغُسْلَ لِرَفْعِ الْحَدَثِ الْأَكْبَرِ فَرْضًا لِلَّهِ تَعَالَى',
    latin: "Nawaitul ghusla liraf'il hadatsil akbari fardhan lillaahi ta'aalaa.",
    arti: "Aku niat mandi untuk menghilangkan hadats besar, fardhu karena Allah Ta'ala.",
  },
  {
    judul: '58. Doa Wudhu: Membasuh Telapak Tangan',
    arab: 'اَللَّهُمَّ احْفَظْ يَدَيَّ مِنْ مَعَاصِيكَ كُلِّهَا',
    latin: "Allahummahfadz yadayya min ma'aashiika kullihaa.",
    arti: 'Ya Allah, peliharalah kedua tanganku dari seluruh perbuatan maksiat kepada-Mu.',
  },
  {
    judul: '59. Doa Wudhu: Kumur-Kumur',
    arab: 'اَللَّهُمَّ اسْقِنِي مِنْ حَوْضِ نَبِيِّكَ كَأْسًا لَا أَظْمَأُ بَعْدَهُ أَبَدًا',
    latin: "Allahummasqinii min hawdhi nabiyyika ka'san laa adzma'u ba'dahu abadaa.",
    arti: 'Ya Allah, beri minumlah aku dari telaga Nabi-Mu dengan sebuah piala yang membuatku tidak kehausan selamanya.',
  },
  {
    judul: '60. Doa Wudhu: Membasuh Hidung (Istinsyaq)',
    arab: 'اَللَّهُمَّ أَرِحْنِي رَائِحَةَ الْجَنَّةِ',
    latin: 'Allahumma arihnii raa-ihatal jannah.',
    arti: 'Ya Allah, berikanlah aku penciuman wewangian surga.',
  },
  {
    judul: '61. Doa Wudhu: Membasuh Muka (Disertai Niat)',
    arab: 'نَوَيْتُ الْوُضُوءَ لِرَفْعِ الْحَدَثِ الْأَصْغَرِ فَرْضًا لِلَّهِ تَعَالَى، اَللَّهُمَّ بَيِّضْ وَجْهِي يَوْمَ تَبْيَضُّ وُجُوهٌ وَتَسْوَدُّ وُجُوهٌ',
    latin: "Nawaitul wudhuu-a liraf'il hadatsil ashghari fardhan lillaahi ta'aalaa. Allahumma bayyidh wajhii yauma tabyadhu wujuuhun wa taswaddu wujuuh.",
    arti: "Aku niat wudhu untuk menghilangkan hadats kecil fardhu karena Allah Ta'ala. Ya Allah, putihkanlah (cahayakanlah) wajahku pada hari di mana wajah-wajah memutih dan wajah-wajah menghitam.",
  },
  {
    judul: '62. Doa Wudhu: Membasuh Kedua Tangan',
    arab: 'اَللَّهُمَّ أَعْطِنِي كِتَابِي بِيَمِينِي وَحَاسِبْنِي حِسَابًا يَسِيرًا',
    latin: "Allahumma a'thinii kitaabii biyamiinii wa haasibnii hisaaban yasiiraa.",
    arti: 'Ya Allah, berikanlah catatan amalku dari tangan kananku dan hisablah aku dengan hisab yang ringan.',
  },
  {
    judul: '63. Doa Wudhu: Mengusap Kepala / Rambut',
    arab: 'اَللَّهُمَّ حَرِّمْ شَعْرِي وَبَشَرِي عَلَى النَّارِ',
    latin: "Allahumma harrim sya'rii wa basyarii 'alan-naar.",
    arti: 'Ya Allah, haramkanlah rambutku dan kulitku dari tersentuh api neraka.',
  },
  {
    judul: '64. Doa Wudhu: Mengusap Kuping / Telinga',
    arab: 'اَللَّهُمَّ اجْعَلْنِي مِنَ الَّذِينَ يَسْتَمِعُونَ الْقَوْلَ فَيَتَّبِعُونَ أَحْسَنَهُ',
    latin: "Allahummaj'alnii minalladziina yastami'uunal qaula fayattabi'uuna ahsanah.",
    arti: 'Ya Allah, jadikanlah aku termasuk orang-orang yang mendengarkan perkataan lalu mengikuti apa yang paling baik di antaranya.',
  },
  {
    judul: '65. Doa Wudhu: Membasuh Kedua Kaki',
    arab: 'اَللَّهُمَّ ثَبِّتْ قَدَمَيَّ عَلَى الصِّرَاطِ يَوْمَ تَزِلُّ فِيهِ الْأَقْدَامُ',
    latin: "Allahumma tsabbit qadamayya 'alash-shiraathi yauma tazillu fiihil aqdaam.",
    arti: 'Ya Allah, tetapkanlah kedua kakiku di atas jembatan (Shiraath) pada hari di mana kaki-kaki tergelincir.',
  },
];

// Fungsi untuk merender daftar doa ke layar (menerima data spesifik)
function tampilkanDoaHarian(dataDoa = dataDoaHarian) {
  let htmlContent = '';

  // Jika doa tidak ditemukan saat dicari
  if (dataDoa.length === 0) {
    doaContainer.innerHTML = '<p style="text-align:center; color: #666; margin-top: 20px;">Doa tidak ditemukan.</p>';
    return;
  }

  dataDoa.forEach((doa, index) => {
    htmlContent += `
            <div style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #eee;">
                
                <div onclick="bukaLipatanDoa(${index})" style="padding: 15px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; background: #fdfdfd;">
                    <div style="font-weight: bold; color: #333; font-size: 1.05rem;">${doa.judul}</div>
                    <div id="ikon-doa-${index}" style="color: #007b5e; font-weight: bold; font-size: 1.2rem; transition: transform 0.3s ease;">+</div>
                </div>
                
                <div id="isi-doa-${index}" style="display: none; padding: 20px; background: white; border-top: 1px dashed #eee; text-align: center;">
                    <div class="font-arab" style="font-size: 2rem; color: #007b5e; margin-bottom: 15px; line-height: 2;">${doa.arab}</div>
                    <div style="font-size: 0.95rem; color: #007b5e; font-style: italic; margin-bottom: 8px;">${doa.latin}</div>
                    <div style="font-size: 0.9rem; color: #555; line-height: 1.4;">${doa.arti}</div>
                </div>
                
            </div>
        `;
  });

  doaContainer.innerHTML = htmlContent;
}

// Fungsi Interaktif: Membuka Lipatan Doa
function bukaLipatanDoa(index) {
  const isi = document.getElementById(`isi-doa-${index}`);
  const ikon = document.getElementById(`ikon-doa-${index}`);

  if (isi.style.display === 'none') {
    isi.style.display = 'block';
    ikon.innerText = '−';
    ikon.style.transform = 'rotate(180deg)';
  } else {
    isi.style.display = 'none';
    ikon.innerText = '+';
    ikon.style.transform = 'rotate(0deg)';
  }
}

// Fungsi Fitur Pencarian Doa (Real-time)
function cariDoa() {
  const kataKunci = document.getElementById('cari-doa').value.toLowerCase();

  // Saring data berdasarkan judul atau artinya
  const hasilFilter = dataDoaHarian.filter((doa) => {
    return doa.judul.toLowerCase().includes(kataKunci) || doa.arti.toLowerCase().includes(kataKunci);
  });

  // Tampilkan hasil saringan
  tampilkanDoaHarian(hasilFilter);
}

// Panggil fungsi saat aplikasi dimuat
tampilkanDoaHarian();

// --- 3. FUNGSI MENAMPILKAN ASMAUL HUSNA (DATA LOKAL) ---
const husnaContainer = document.getElementById('asmaul-husna');

// Data statis 99 Asmaul Husna langsung disimpan di dalam aplikasi
const dataAsmaulHusna = [
  { urutan: 1, arab: 'الرَّحْمَنُ', latin: 'Ar-Rahman', arti: 'Yang Maha Pengasih' },
  { urutan: 2, arab: 'الرَّحِيمُ', latin: 'Ar-Rahim', arti: 'Yang Maha Penyayang' },
  { urutan: 3, arab: 'الْمَلِكُ', latin: 'Al-Malik', arti: 'Yang Maha Merajai' },
  { urutan: 4, arab: 'الْقُدُّوسُ', latin: 'Al-Quddus', arti: 'Yang Maha Suci' },
  { urutan: 5, arab: 'السَّلَامُ', latin: 'As-Salam', arti: 'Yang Maha Memberi Kesejahteraan' },
  { urutan: 6, arab: 'الْمُؤْمِنُ', latin: "Al-Mu'min", arti: 'Yang Maha Memberi Keamanan' },
  { urutan: 7, arab: 'الْمُهَيْمِنُ', latin: 'Al-Muhaimin', arti: 'Yang Maha Pemelihara' },
  { urutan: 8, arab: 'الْعَزِيزُ', latin: 'Al-Aziz', arti: 'Yang Maha Perkasa' },
  { urutan: 9, arab: 'الْجَبَّارُ', latin: 'Al-Jabbar', arti: 'Yang Memiliki Mutlak Kegagahan' },
  { urutan: 10, arab: 'الْمُتَكَبِّرُ', latin: 'Al-Mutakabbir', arti: 'Yang Maha Megah' },
  { urutan: 11, arab: 'الْخَالِقُ', latin: 'Al-Khaliq', arti: 'Yang Maha Pencipta' },
  { urutan: 12, arab: 'الْبَارِئُ', latin: "Al-Bari'", arti: 'Yang Maha Melepaskan' },
  { urutan: 13, arab: 'الْمُصَوِّرُ', latin: 'Al-Musawwir', arti: 'Yang Maha Membentuk Rupa' },
  { urutan: 14, arab: 'الْغَفَّارُ', latin: 'Al-Ghaffar', arti: 'Yang Maha Pengampun' },
  { urutan: 15, arab: 'الْقَهَّارُ', latin: 'Al-Qahhar', arti: 'Yang Maha Memaksa' },
  { urutan: 16, arab: 'الْوَهَّابُ', latin: 'Al-Wahhab', arti: 'Yang Maha Pemberi Karunia' },
  { urutan: 17, arab: 'الرَّزَّاقُ', latin: 'Ar-Razzaq', arti: 'Yang Maha Pemberi Rezeki' },
  { urutan: 18, arab: 'الْفَتَّاحُ', latin: 'Al-Fattah', arti: 'Yang Maha Pembuka Rahmat' },
  { urutan: 19, arab: 'الْعَلِيمُ', latin: "Al-'Alim", arti: 'Yang Maha Mengetahui' },
  { urutan: 20, arab: 'الْقَابِضُ', latin: 'Al-Qabidh', arti: 'Yang Maha Menyempitkan' },
  { urutan: 21, arab: 'الْبَاسِطُ', latin: 'Al-Basith', arti: 'Yang Maha Melapangkan' },
  { urutan: 22, arab: 'الْخَافِضُ', latin: 'Al-Khafidh', arti: 'Yang Maha Merendahkan' },
  { urutan: 23, arab: 'الرَّافِعُ', latin: "Ar-Rafi'", arti: 'Yang Maha Meninggikan' },
  { urutan: 24, arab: 'الْمُعِزُّ', latin: "Al-Mu'izz", arti: 'Yang Maha Memuliakan' },
  { urutan: 25, arab: 'الْمُذِلُّ', latin: 'Al-Muzil', arti: 'Yang Maha Menghinakan' },
  { urutan: 26, arab: 'السَّمِيعُ', latin: "As-Sami'", arti: 'Yang Maha Mendengar' },
  { urutan: 27, arab: 'الْبَصِيرُ', latin: 'Al-Bashir', arti: 'Yang Maha Melihat' },
  { urutan: 28, arab: 'الْحَكَمُ', latin: 'Al-Hakam', arti: 'Yang Maha Menetapkan' },
  { urutan: 29, arab: 'الْعَدْلُ', latin: "Al-'Adl", arti: 'Yang Maha Adil' },
  { urutan: 30, arab: 'اللَّطِيفُ', latin: 'Al-Lathif', arti: 'Yang Maha Lembut' },
  { urutan: 31, arab: 'الْخَبِيرُ', latin: 'Al-Khabir', arti: 'Yang Maha Mengenal' },
  { urutan: 32, arab: 'الْحَلِيمُ', latin: 'Al-Halim', arti: 'Yang Maha Penyantun' },
  { urutan: 33, arab: 'الْعَظِيمُ', latin: "Al-'Azhim", arti: 'Yang Maha Agung' },
  { urutan: 34, arab: 'الْغَفُورُ', latin: 'Al-Ghafur', arti: 'Yang Maha Pengampun' },
  { urutan: 35, arab: 'الشَّكُورُ', latin: 'As-Syakur', arti: 'Yang Maha Pembalas Budi' },
  { urutan: 36, arab: 'الْعَلِيُّ', latin: "Al-'Aliy", arti: 'Yang Maha Tinggi' },
  { urutan: 37, arab: 'الْكَبِيرُ', latin: 'Al-Kabir', arti: 'Yang Maha Besar' },
  { urutan: 38, arab: 'الْحَفِيظُ', latin: 'Al-Hafizh', arti: 'Yang Maha Memelihara' },
  { urutan: 39, arab: 'الْمُقِيتُ', latin: 'Al-Muqit', arti: 'Yang Maha Pemberi Kecukupan' },
  { urutan: 40, arab: 'الْحَسِيبُ', latin: 'Al-Hasib', arti: 'Yang Maha Membuat Perhitungan' },
  { urutan: 41, arab: 'الْجَلِيلُ', latin: 'Al-Jalil', arti: 'Yang Maha Luhur' },
  { urutan: 42, arab: 'الْكَرِيمُ', latin: 'Al-Karim', arti: 'Yang Maha Pemurah' },
  { urutan: 43, arab: 'الرَّقِيبُ', latin: 'Ar-Raqib', arti: 'Yang Maha Mengawasi' },
  { urutan: 44, arab: 'الْمُجِيبُ', latin: 'Al-Mujib', arti: 'Yang Maha Mengabulkan' },
  { urutan: 45, arab: 'الْوَاسِعُ', latin: "Al-Wasi'", arti: 'Yang Maha Luas' },
  { urutan: 46, arab: 'الْحَكِيمُ', latin: 'Al-Hakim', arti: 'Yang Maha Bijaksana' },
  { urutan: 47, arab: 'الْوَدُودُ', latin: 'Al-Wadud', arti: 'Yang Maha Mengasihi' },
  { urutan: 48, arab: 'الْمَجِيدُ', latin: 'Al-Majid', arti: 'Yang Maha Mulia' },
  { urutan: 49, arab: 'الْبَاعِثُ', latin: "Al-Ba'ith", arti: 'Yang Maha Membangkitkan' },
  { urutan: 50, arab: 'الشَّهِيدُ', latin: 'As-Syahid', arti: 'Yang Maha Menyaksikan' },
  { urutan: 51, arab: 'الْحَقُّ', latin: 'Al-Haqq', arti: 'Yang Maha Benar' },
  { urutan: 52, arab: 'الْوَكِيلُ', latin: 'Al-Wakil', arti: 'Yang Maha Memelihara' },
  { urutan: 53, arab: 'الْقَوِيُّ', latin: 'Al-Qawiyyu', arti: 'Yang Maha Kuat' },
  { urutan: 54, arab: 'الْمَتِينُ', latin: 'Al-Matin', arti: 'Yang Maha Kokoh' },
  { urutan: 55, arab: 'الْوَلِيُّ', latin: 'Al-Waliyy', arti: 'Yang Maha Melindungi' },
  { urutan: 56, arab: 'الْحَمِيدُ', latin: 'Al-Hamid', arti: 'Yang Maha Terpuji' },
  { urutan: 57, arab: 'الْمُحْصِي', latin: 'Al-Muhshi', arti: 'Yang Maha Menghitung' },
  { urutan: 58, arab: 'الْمُبْدِئُ', latin: "Al-Mubdi'", arti: 'Yang Maha Memulai' },
  { urutan: 59, arab: 'الْمُعِيدُ', latin: "Al-Mu'id", arti: 'Yang Maha Mengembalikan Kehidupan' },
  { urutan: 60, arab: 'الْمُحْيِي', latin: 'Al-Muhyi', arti: 'Yang Maha Menghidupkan' },
  { urutan: 61, arab: 'الْمُمِيتُ', latin: 'Al-Mumit', arti: 'Yang Maha Mematikan' },
  { urutan: 62, arab: 'الْحَيُّ', latin: 'Al-Hayyu', arti: 'Yang Maha Hidup' },
  { urutan: 63, arab: 'الْقَيُّومُ', latin: 'Al-Qayyum', arti: 'Yang Maha Mandiri' },
  { urutan: 64, arab: 'الْوَاجِدُ', latin: 'Al-Wajid', arti: 'Yang Maha Penemu' },
  { urutan: 65, arab: 'الْمَاجِدُ', latin: 'Al-Majid', arti: 'Yang Maha Mulia' },
  { urutan: 66, arab: 'الْوَاحِدُ', latin: 'Al-Wahid', arti: 'Yang Maha Tunggal' },
  { urutan: 67, arab: 'الْأَحَدُ', latin: 'Al-Ahad', arti: 'Yang Maha Esa' },
  { urutan: 68, arab: 'الصَّمَدُ', latin: 'As-Shamad', arti: 'Yang Maha Dibutuhkan' },
  { urutan: 69, arab: 'الْقَادِرُ', latin: 'Al-Qadir', arti: 'Yang Maha Menentukan' },
  { urutan: 70, arab: 'الْمُقْتَدِرُ', latin: 'Al-Muqtadir', arti: 'Yang Maha Berkuasa' },
  { urutan: 71, arab: 'الْمُقَدِّمُ', latin: 'Al-Muqaddim', arti: 'Yang Maha Mendahulukan' },
  { urutan: 72, arab: 'الْمُؤَخِّرُ', latin: "Al-Mu'akhkhir", arti: 'Yang Maha Mengakhirkan' },
  { urutan: 73, arab: 'الْأَوَّلُ', latin: 'Al-Awwal', arti: 'Yang Maha Awal' },
  { urutan: 74, arab: 'الْآخِرُ', latin: 'Al-Akhir', arti: 'Yang Maha Akhir' },
  { urutan: 75, arab: 'الظَّاهِرُ', latin: 'Az-Zhahir', arti: 'Yang Maha Nyata' },
  { urutan: 76, arab: 'الْبَاطِنُ', latin: 'Al-Bathin', arti: 'Yang Maha Ghaib' },
  { urutan: 77, arab: 'الْوَالِي', latin: 'Al-Wali', arti: 'Yang Maha Memerintah' },
  { urutan: 78, arab: 'الْمُتَعَالِي', latin: "Al-Muta'ali", arti: 'Yang Maha Tinggi' },
  { urutan: 79, arab: 'الْبَرُّ', latin: 'Al-Barr', arti: 'Yang Maha Penderma' },
  { urutan: 80, arab: 'التَّوَّابُ', latin: 'At-Tawwab', arti: 'Yang Maha Penerima Tobat' },
  { urutan: 81, arab: 'الْمُنْتَقِمُ', latin: 'Al-Muntaqim', arti: 'Yang Maha Pemberi Balasan' },
  { urutan: 82, arab: 'الْعَفُوُّ', latin: 'Al-Afuww', arti: 'Yang Maha Pemaaf' },
  { urutan: 83, arab: 'الرَّءُوفُ', latin: "Ar-Ra'uf", arti: 'Yang Maha Pengasuh' },
  { urutan: 84, arab: 'مَالِكُ الْمُلْكِ', latin: 'Malikul Mulk', arti: 'Yang Maha Penguasa Kerajaan' },
  { urutan: 85, arab: 'ذُو الْجَلَالِ وَالْإِكْرَامِ', latin: 'Dzul Jalaali Wal Ikraam', arti: 'Yang Maha Pemilik Kebesaran dan Kemuliaan' },
  { urutan: 86, arab: 'الْمُقْسِطُ', latin: 'Al-Muqsit', arti: 'Yang Maha Pemberi Keadilan' },
  { urutan: 87, arab: 'الْجَامِعُ', latin: "Al-Jami'", arti: 'Yang Maha Mengumpulkan' },
  { urutan: 88, arab: 'الْغَنِيُّ', latin: 'Al-Ghaniyy', arti: 'Yang Maha Kaya' },
  { urutan: 89, arab: 'الْمُغْنِي', latin: 'Al-Mughni', arti: 'Yang Maha Pemberi Kekayaan' },
  { urutan: 90, arab: 'الْمَانِعُ', latin: "Al-Mani'", arti: 'Yang Maha Mencegah' },
  { urutan: 91, arab: 'الضَّارُّ', latin: 'Ad-Dharr', arti: 'Yang Maha Penimpa Kemudharatan' },
  { urutan: 92, arab: 'النَّافِعُ', latin: "An-Nafi'", arti: 'Yang Maha Memberi Manfaat' },
  { urutan: 93, arab: 'النُّورُ', latin: 'An-Nur', arti: 'Yang Maha Bercahaya' },
  { urutan: 94, arab: 'الْهَادِي', latin: 'Al-Hadi', arti: 'Yang Maha Pemberi Petunjuk' },
  { urutan: 95, arab: 'الْبَدِيعُ', latin: "Al-Badi'", arti: 'Yang Maha Pencipta Tiada Bandingannya' },
  { urutan: 96, arab: 'الْبَاقِي', latin: 'Al-Baqi', arti: 'Yang Maha Kekal' },
  { urutan: 97, arab: 'الْوَارِثُ', latin: 'Al-Warith', arti: 'Yang Maha Pewaris' },
  { urutan: 98, arab: 'الرَّشِيدُ', latin: 'Ar-Rasyid', arti: 'Yang Maha Pandai' },
  { urutan: 99, arab: 'الصَّبُورُ', latin: 'As-Shabur', arti: 'Yang Maha Sabar' },
];

function tampilkanAsmaulHusna() {
  // 1. Buat kerangka Tabel HTML
  let htmlContent = `
        <div class="surat-container" style="max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="background: #007b5e; color: white; padding: 15px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
                <h2>99 Asmaul Husna</h2>
                <p style="opacity: 0.8; margin: 0;">Cari dan pelajari nama-nama Allah</p>
            </div>
            <div style="overflow-x: auto;">
                <table id="tabel-husna" class="display" style="width:100%; text-align: center">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Arab</th>
                            <th>Latin</th>
                            <th>Arti</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

  // 2. Looping data array lokal ke dalam baris tabel (<tr> dan <td>)
  dataAsmaulHusna.forEach((husna) => {
    htmlContent += `
            <tr>
                <td style="text-align: center; width: 5%;">${husna.urutan}</td>
                <td class="font-arab" style="text-align: center; font-size: 1.8rem; color: #007b5e; width: 35%;">${husna.arab}</td>
                <td style="font-weight: bold; font-size: 1.1rem; width: 25%;">${husna.latin}</td>
                <td style="font-size: 0.95rem; color: #444; width: 35%;">${husna.arti}</td>
            </tr>
        `;
  });

  htmlContent += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

  // 3. Tampilkan di layar
  husnaContainer.innerHTML = htmlContent;

  // 4. Aktifkan Fitur DataTables (Pencarian & Halaman)
  $(document).ready(function () {
    // Hancurkan tabel lama jika sudah ada agar tidak error saat menu diklik berkali-kali
    if ($.fn.DataTable.isDataTable('#tabel-husna')) {
      $('#tabel-husna').DataTable().destroy();
    }

    // Atur DataTables dengan bahasa Indonesia
    $('#tabel-husna').DataTable({
      pageLength: 10, // Menampilkan 10 baris per halaman (bisa diubah)
      language: {
        search: 'Cari Nama/Arti:',
        lengthMenu: 'Tampilkan _MENU_ baris',
        info: 'Menampilkan _START_ sampai _END_ dari _TOTAL_ Asmaul Husna',
        infoEmpty: 'Tidak ada data yang ditemukan',
        paginate: {
          first: 'Pertama',
          last: 'Terakhir',
          next: 'Maju',
          previous: 'Mundur',
        },
      },
    });
  });
}

// Panggil fungsinya
tampilkanAsmaulHusna();

function toggleDarkMode() {
  // 1. Tukar kelas dark-mode di body
  document.body.classList.toggle('dark-mode');

  // 2. Langsung simpan status terbarunya ke memori browser
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('temaAplikasi', 'dark');
  } else {
    localStorage.setItem('temaAplikasi', 'light');
  }
}
