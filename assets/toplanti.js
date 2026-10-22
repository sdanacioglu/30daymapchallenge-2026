/* BakırçayCBS · #30DayMapChallenge 2026 — toplantı takvimi verisi
   Yalnızca ad soyad; iletişim bilgisi ve toplantı bağlantısı bu dosyaya girmez.
   Mentör toplantı saati belli olunca "saat" alanını doldurun (ör. "19:00"); gün değişirse "gun" alanını
   (0 = Pazartesi … 6 = Pazar) güncelleyin.
   Akran toplantıları, Google Form yanıt tablosunun "Web'de yayınla → CSV" bağlantısından okunur (akranCsv). */
window.TOPLANTI = {
  baslangic: "2026-10-26",          // ilk pazartesi
  bitis: "2026-12-06",              // son pazar
  akranForm: "https://forms.gle/wh9opMhayG1qrqwF8",                    // öğrencilerin dolduracağı form bağlantısı (forms.gle/…)
  akranCsv: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQRXwgy4Npe8p1IMhia6YJSPQnoQHymlPHaE4UJ4VWMRAn9FauzFZ219FW-1gMPD6uxuu2SUN5yXr7H/pub?gid=1982373967&single=true&output=csv",                     // yanıt tablosunun yayımlanmış CSV bağlantısı

  /* Sabit toplantılar */
  koordinasyon: { gun: 0, saat: "12:00", ilk: "2026-10-26", son: "2026-11-30" },
  genel: { gun: 3, saat: "20:00", ilk: "2026-10-26", son: "2026-12-06",
    istisna: { "2026-10-29": { tarih: "2026-10-28", not: "29 Ekim Cumhuriyet Bayramı nedeniyle Çarşamba" },
               "2026-12-03": { not: "Kapanış toplantısı" } } },
  mentorToplanti: { ilk: "2026-10-26", son: "2026-11-29" },

  mentorler: [
    { ad: "Merve Nur Öz", gun: 1, saat: "", ekip: ["Burak Çevik", "Nebahat Ecem Akkanım", "Mehmet Ali Yanmaz", "Yaren Taktuk", "Başak Barin"] },
    { ad: "Selim Mirsat Gül", gun: 1, saat: "", ekip: ["Zuhal Evren", "Efe Koçer", "İremnur Albayrak", "İrem Beytüt", "Yağmur Tuana Eltemur"] },
    { ad: "Emre Koçan", gun: 1, saat: "", ekip: ["Ferid Şahin", "Damla Çakmak", "Can Kaya", "Efe Coşkun Dönmez", "Eflin Özbilgin", "Gülçin Kekeç"] },
    { ad: "Umut Ceyran", gun: 1, saat: "", ekip: ["Mustafa Baran Arslan", "İpek Baran", "Nisan Demirkahyalılar", "Meral Külkaya", "Serkan Türkkan"] }
  ],

  akran: {
    A: ["Burak Çevik", "Damla Çakmak", "İrem Beytüt", "Serkan Türkkan"],
    B: ["Nebahat Ecem Akkanım", "Can Kaya", "Nisan Demirkahyalılar", "Yağmur Tuana Eltemur"],
    C: ["Zuhal Evren", "Mehmet Ali Yanmaz", "Efe Coşkun Dönmez", "Meral Külkaya"],
    D: ["Efe Koçer", "İpek Baran", "Yaren Taktuk", "Eflin Özbilgin"],
    E: ["Ferid Şahin", "Mustafa Baran Arslan", "İremnur Albayrak", "Başak Barin", "Gülçin Kekeç"]
  }
};
