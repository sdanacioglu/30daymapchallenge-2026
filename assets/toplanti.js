/* BakırçayCBS · #30DayMapChallenge 2026 — toplantı takvimi verisi
   Yalnızca ad soyad; iletişim bilgisi ve toplantı bağlantısı bu dosyaya girmez.
   Mentör toplantı saati belli olunca "saat" alanını doldurun (ör. "19:00"); gün değişirse "gun" alanını
   (0 = Pazartesi … 6 = Pazar) güncelleyin.
   Akran toplantıları (haftalık gruplar), Google Form yanıt tablosunun "Web'de yayınla → CSV" bağlantısından okunur (akranCsv). */
window.TOPLANTI = {
  baslangic: "2026-10-26",          // ilk pazartesi
  bitis: "2026-12-06",              // son pazar
  akranForm: "https://forms.gle/wh9opMhayG1qrqwF8",                    // öğrencilerin dolduracağı form bağlantısı (forms.gle/…)
  akranCsv: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQRXwgy4Npe8p1IMhia6YJSPQnoQHymlPHaE4UJ4VWMRAn9FauzFZ219FW-1gMPD6uxuu2SUN5yXr7H/pub?gid=1982373967&single=true&output=csv",                     // yanıt tablosunun yayımlanmış CSV bağlantısı

  onayForm: "https://forms.gle/n92Vu8i5at4zTSXDA",                     // mentör onayı formu (forms.gle/…)
  onayCsv: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjo4FT89TmRKbSbMpV1zug4YhEl43idY1oJQReGSbhYD9SGRvoaf3I4VHOPJ0FuYCsIpyz9fRrxXvr/pub?gid=529080939&single=true&output=csv",                      // mentör onayı yanıt tablosunun yayımlanmış CSV bağlantısı

  /* Sabit toplantılar */
  koordinasyon: { gun: 0, saat: "12:00", ilk: "2026-10-26", son: "2026-11-30" },
  genel: { gun: 3, saat: "20:00", ilk: "2026-10-26", son: "2026-12-06",
    istisna: { "2026-10-29": { tarih: "2026-10-28", not: "29 Ekim Cumhuriyet Bayramı nedeniyle Çarşamba" },
               "2026-12-03": { not: "Kapanış toplantısı" } } },
  mentorToplanti: { ilk: "2026-10-26", son: "2026-11-29" },

  mentorler: [
    { ad: "Merve Nur Öz", gun: 5, saat: "20:00", ekip: ["Burak Çevik", "Nebahat Ecem Akkanım", "Yaren Taktuk", "Başak Barin", "Yağmur Tuana Eltemur"] },
    { ad: "Selim Mirsat Gül", gun: 1, saat: "", ekip: ["Zuhal Evren", "Ferid Şahin", "Mehmet Ali Yanmaz", "İremnur Albayrak", "İrem Beytüt"] },
    { ad: "Emre Koçan", gun: 0, saat: "20:00", ekip: ["Efe Koçer", "Damla Çakmak", "Can Kaya", "Efe Coşkun Dönmez", "Eflin Özbilgin", "Gülçin Kekeç"] },
    { ad: "Umut Ceyran", gun: 1, saat: "20:00", ekip: ["Mustafa Baran Arslan", "İpek Baran", "Nisan Demirkahyalılar", "Meral Külkaya", "Serkan Türkkan"] }
  ],

  /* Akran grupları her hafta yeniden oluşturulur (aynı iki kişi en fazla iki kez buluşur). */
  akranHaftalar: [
    { id: "H0", ad: "Hazırlık haftası", bas: "2026-10-26" },
    { id: "H1", ad: "1. hafta", bas: "2026-11-02" },
    { id: "H2", ad: "2. hafta", bas: "2026-11-09" },
    { id: "H3", ad: "3. hafta", bas: "2026-11-16" },
    { id: "H4", ad: "4. hafta", bas: "2026-11-23" }
  ],
  akran: {
    H0: {
      A: ["Damla Çakmak", "Nebahat Ecem Akkanım", "Yaren Taktuk", "Zuhal Evren"],
      B: ["Başak Barin", "Ferid Şahin", "Mustafa Baran Arslan", "Serkan Türkkan"],
      C: ["Burak Çevik", "Can Kaya", "Efe Coşkun Dönmez", "Meral Külkaya"],
      D: ["Eflin Özbilgin", "Gülçin Kekeç", "Nisan Demirkahyalılar", "İremnur Albayrak"],
      E: ["Efe Koçer", "Mehmet Ali Yanmaz", "Yağmur Tuana Eltemur", "İpek Baran", "İrem Beytüt"]
    },
    H1: {
      A: ["Efe Koçer", "Meral Külkaya", "Mustafa Baran Arslan", "Zuhal Evren"],
      B: ["Efe Coşkun Dönmez", "Gülçin Kekeç", "Mehmet Ali Yanmaz", "Yaren Taktuk"],
      C: ["Başak Barin", "Burak Çevik", "Eflin Özbilgin", "İrem Beytüt"],
      D: ["Damla Çakmak", "Ferid Şahin", "Nisan Demirkahyalılar", "İpek Baran"],
      E: ["Can Kaya", "Nebahat Ecem Akkanım", "Serkan Türkkan", "Yağmur Tuana Eltemur", "İremnur Albayrak"]
    },
    H2: {
      A: ["Efe Coşkun Dönmez", "Serkan Türkkan", "Zuhal Evren", "İrem Beytüt"],
      B: ["Damla Çakmak", "Gülçin Kekeç", "Meral Külkaya", "Yağmur Tuana Eltemur"],
      C: ["Eflin Özbilgin", "Ferid Şahin", "Mehmet Ali Yanmaz", "Nebahat Ecem Akkanım"],
      D: ["Burak Çevik", "Mustafa Baran Arslan", "İpek Baran", "İremnur Albayrak"],
      E: ["Başak Barin", "Can Kaya", "Efe Koçer", "Nisan Demirkahyalılar", "Yaren Taktuk"]
    },
    H3: {
      A: ["Burak Çevik", "Efe Koçer", "Gülçin Kekeç", "Serkan Türkkan"],
      B: ["Başak Barin", "Damla Çakmak", "Mehmet Ali Yanmaz", "İremnur Albayrak"],
      C: ["Meral Külkaya", "Nebahat Ecem Akkanım", "Nisan Demirkahyalılar", "İrem Beytüt"],
      D: ["Can Kaya", "Eflin Özbilgin", "Zuhal Evren", "İpek Baran"],
      E: ["Efe Coşkun Dönmez", "Ferid Şahin", "Mustafa Baran Arslan", "Yaren Taktuk", "Yağmur Tuana Eltemur"]
    },
    H4: {
      A: ["Eflin Özbilgin", "Meral Külkaya", "Serkan Türkkan", "Yaren Taktuk"],
      B: ["Ferid Şahin", "Gülçin Kekeç", "Nebahat Ecem Akkanım", "İpek Baran"],
      C: ["Başak Barin", "Efe Coşkun Dönmez", "Efe Koçer", "İremnur Albayrak"],
      D: ["Can Kaya", "Damla Çakmak", "Mustafa Baran Arslan", "İrem Beytüt"],
      E: ["Burak Çevik", "Mehmet Ali Yanmaz", "Nisan Demirkahyalılar", "Yağmur Tuana Eltemur", "Zuhal Evren"]
    }
  }
};
