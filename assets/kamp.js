/* BakırçayCBS · #30DayMapChallenge 2026 — kamp sayfası
   PROMPTLAR: yapay zekâya sorulabilecek örnek sorular (köşeli parantezler doldurulur).
   MODULLER: kendi hızında izlenen modüller. Her kaynak bağlantısı eklenmeden önce açılıp doğrulandı (21.10.2026).
   Kaynak: { b: başlık, u: bağlantı, t: tür, d: dil, s: süre, n: not } */
(function () {
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const PROMPTLAR = [
    { adim: "Soru · bu temada sık yapılanlar", metin:
`Deneyimli bir kartografya editörü gibi düşün. #30DayMapChallenge'ın "[TEMA]" teması için en sık yapılan 5 harita yaklaşımını listele ve her birinin neden bu kadar sık tercih edildiğini tek cümleyle açıkla.
Ardından bu beşine benzemeyen, [YER] için uygulanabilir 3 yaklaşım öner. Her biri için yanıtladığı soruyu ve kullanılabilecek açık veri türünü yaz.` },
    { adim: "Kâğıt eskiz · eleştiri", metin:
`Ekteki kâğıt eskizim, "[TEMA]" teması için "[SORU]" sorusunu yanıtlayacak 1080 × 1350 px dikey bir harita.
Görsel hiyerarşi, okuma sırası ve boşluk kullanımı açısından değerlendir: 2 güçlü yön, 2 riskli yön söyle.
Hazır çözüm önerme; tasarımımı geliştirmemi sağlayacak 3 soru sor.` },
    { adim: "Veri · keşif", metin:
`[YER] için [KONU] hakkında açık lisanslı, indirilebilir veri setleri arıyorum.
Yalnızca resmî ya da tanınmış kaynakları listele: kurum, veri seti adı, kapsadığı yıllar, biçim ve lisans.
Emin olmadığın bilgiye "doğrulanmalı" yaz; bağlantı ya da veri seti uydurma.` },
    { adim: "ArcGIS Pro · hata ayıklama", metin:
`ArcGIS Pro'da [ARAÇ ya da İŞLEM] çalıştırırken şu hatayı alıyorum: "[HATA MESAJI]".
Girdi verim: [biçim, koordinat sistemi, yaklaşık boyut]. Olası 3 nedeni olasılık sırasıyla yaz ve her birini ArcGIS Pro'da nasıl kontrol edeceğimi menü adlarıyla adım adım anlat.` },
    { adim: "Taslak · jüri gözüyle", metin:
`Ekteki taslak haritayı bir #30DayMapChallenge jürisi gibi değerlendir: okunabilirlik, renk ve kontrast (renk körlüğü dâhil), tipografi, temaya uygunluk, özgünlük.
Her ölçüte 1–3 puan ver, gerekçesini tek cümleyle açıkla ve en büyük etkiyi yaratacak tek iyileştirmeyi öner.` },
    { adim: "Metin · açıklama", metin:
`Aşağıdaki Türkçe harita açıklamasını anlamını değiştirmeden en fazla 3 cümleye indir; teknik terimleri koru.
Altına doğal bir İngilizce özet cümlesi ekle.
Metin: [AÇIKLAMA]` }
  ];

  const YT = "video · John Nelson";
  const MODULLER = [
    { id: "baslarken", no: 1, ad: "ArcGIS Pro'ya başlarken", ozet: "Arayüz, proje, harita ve yerleşim (layout) mantığı. ArcGIS Pro'yu ilk kez açıyorsan buradan başla.",
      alistirma: "Boş bir proje aç, günün temasına uygun bir katman ekle ve 10,8 × 13,5 inçlik (1080 × 1350 px) bir yerleşim oluştur.", kaynaklar: [
        { b: "Get started with ArcGIS Pro", u: "https://learn.arcgis.com/en/projects/get-started-with-arcgis-pro/", t: "ders · Learn ArcGIS", d: "EN", s: "45 dk" },
        { b: "Try ArcGIS Pro (öğrenme yolu: veri keşfi, sembolleştirme, paylaşım)", u: "https://learn.arcgis.com/en/paths/try-arcgis-pro/", t: "ders dizisi · Learn ArcGIS", d: "EN" },
        { b: "Introduction to exporting a map or layout", u: "https://doc.esri.com/en/arcgis-pro/latest/help/sharing/overview/export-a-map-or-layout.html", t: "belge · Esri", d: "EN", n: "piksel boyutu = sayfa boyutu (inç) × dpi" }
      ] },
    { id: "tasarim", no: 2, ad: "Kartografik tasarımın temelleri", ozet: "Renk, görsel hiyerarşi, tipografi ve yerleşim: her haritayı ilgilendiren temel kararlar.",
      alistirma: "Eskizindeki en önemli öğeyi belirle; renk ve boyutla onu ilk bakışta öne çıkar. Renklerini ColorBrewer'da renk körlüğü için kontrol et.", kaynaklar: [
        { b: "Introduction to Cartography (kendi hızında kurs)", u: "https://introduction-to-cartography-learngis.hub.arcgis.com/", t: "kurs · Esri", d: "EN", n: "hiç deneyimi olmayanlar için" },
        { b: "Visual hierarchy for maps", u: "https://www.esri.com/arcgis-blog/products/arcgis-online/education/visual-hierarchy-for-maps", t: "yazı · Esri", d: "EN" },
        { b: "Design principles for cartography", u: "https://www.esri.com/arcgis-blog/products/arcgis-pro/mapping/design-principles-for-cartography", t: "yazı · Esri", d: "EN" },
        { b: "Taming Typography with ArcGIS Pro", u: "https://www.esri.com/arcgis-blog/products/mapping/mapping/taming-typography-with-arcgis-pro", t: "yazı · Kenneth Field", d: "EN" },
        { b: "ColorBrewer: haritalar için renk şemaları", u: "https://colorbrewer2.org/", t: "araç", d: "EN" }
      ] },
    { id: "gorsel-etki", no: 3, ad: "ArcGIS Pro'da görsel etki teknikleri", ozet: "Kod yazmadan haritayı ilk bakışta değiştiren teknikler. Hepsini öğrenmen gerekmiyor: temana uyan bir ya da ikisini seç.",
      alistirma: "Aynı haritanın iki sürümünü dışa aktar: biri düz, biri tek bir görsel etki tekniğiyle. Hangisi sorunu daha iyi yanıtlıyor? Yanıtını yapım notundaki tasarım kararına yaz.", kaynaklar: [], gruplar: [
        { ad: "Katman harmanlama ve saydamlık", kaynaklar: [
          { b: "How to Make Your ArcGIS Pro Map Awesome with One Blend Mode", u: "https://www.youtube.com/watch?v=AHAvL_hrWTo", t: YT, d: "EN", s: "2:25" },
          { b: "Blend mode helper (her modun etkisini gösteren başvuru haritası)", u: "https://www.esri.com/arcgis-blog/products/arcgis-living-atlas/mapping/demystifying-blend-modes-in-arcgis-with-a-handy-reference-graphic", t: "yazı · John Nelson", d: "EN" },
          { b: "Apply transparency and blending modes", u: "https://doc.esri.com/en/arcgis-pro/latest/help/mapping/layer-properties/apply-visual-effects.html", t: "belge · Esri", d: "EN" } ] },
        { ad: "Gölgeli kabartma ve raster", kaynaklar: [
          { b: "Multidirectional Hillshade: Deconstructed", u: "https://www.youtube.com/watch?v=c7nCuDbObcM", t: YT, d: "EN", s: "7:02" },
          { b: "Fun ambient hillshade in ArcGIS Pro", u: "https://www.esri.com/arcgis-blog/products/arcgis-pro/mapping/fun-ambient-hillshade-in-arcgis-pro", t: "yazı · John Nelson", d: "EN" },
          { b: "Throwing shade in wild color", u: "https://www.esri.com/arcgis-blog/products/arcgis-pro/mapping/throwing-shade-in-wild-color", t: "yazı · John Nelson", d: "EN" } ] },
        { ad: "John Nelson stilleri: Firefly, Vintage, Sketch, Watercolor", kaynaklar: [
          { b: "Make Glowing Firefly Symbols in ArcGIS Pro…and a Layout with Insets", u: "https://www.youtube.com/watch?v=XbqvZh6qQsA", t: YT, d: "EN", s: "4:47" },
          { b: "Steal This Firefly Style Please", u: "https://www.esri.com/arcgis-blog/products/mapping/mapping/steal-this-firefly-style-please", t: "yazı · John Nelson", d: "EN", n: "stil dosyası (.stylx)" },
          { b: "Hillshade that looks hand-drawn?", u: "https://www.youtube.com/watch?v=B4DNzj5zI44", t: YT, d: "EN", s: "7:55" },
          { b: "Vintage Shaded Relief Basemap", u: "https://www.esri.com/arcgis-blog/products/arcgis-online/mapping/vintage-shaded-relief-basemap", t: "yazı · John Nelson", d: "EN" },
          { b: "How to Make a Super Sketchy-Looking Map", u: "https://www.esri.com/arcgis-blog/products/arcgis-pro/mapping/how-to-make-a-super-sketchy-looking-map", t: "yazı · John Nelson", d: "EN", n: "stil dosyası (.stylx)" },
          { b: "Steal this Watercolor Style for Pro, Please", u: "https://www.esri.com/arcgis-blog/products/arcgis-pro/mapping/steal-this-watercolor-style-for-pro-please", t: "yazı · John Nelson", d: "EN", n: "stil dosyası (.stylx)" } ] },
        { ad: "Etiketler, haleler ve maskeleme", kaynaklar: [
          { b: "How to make a layer's labels readable over any background color", u: "https://www.esri.com/arcgis-blog/products/arcgis-pro/mapping/how-to-make-a-layers-labels-readable-over-any-background-color", t: "yazı · John Nelson", d: "EN" },
          { b: "Aynı konunun videosu", u: "https://www.youtube.com/watch?v=n5q_IskXIVE", t: YT, d: "EN", s: "3:00" },
          { b: "Polishing Your Halo", u: "https://www.esri.com/arcgis-blog/products/arcgis-living-atlas/mapping/polishing-your-halo", t: "yazı · Esri", d: "EN" },
          { b: "Mask features", u: "https://doc.esri.com/en/arcgis-pro/latest/help/mapping/layer-properties/use-a-masking-layer.html", t: "belge · Esri", d: "EN" } ] },
        { ad: "Gölge, ışıma ve yumuşak kenar efektleri", kaynaklar: [
          { b: "One Minute Map Hack: Area of Interest Dropshadow Effect", u: "https://www.youtube.com/watch?v=1K6xm_6t8kY", t: YT, d: "EN", s: "0:47" },
          { b: "Boundary Dropshadow Mega-Hack", u: "https://www.esri.com/arcgis-blog/products/mapping/mapping/boundary-dropshadow-mega-hack", t: "yazı · John Nelson", d: "EN" },
          { b: "How to make a coastal halo in ArcGIS Pro…and what color?", u: "https://www.youtube.com/watch?v=LXB9GQCak_A", t: YT, d: "EN", s: "1:49" },
          { b: "Enthingify Symbols with Light & Shadow Effects", u: "https://www.esri.com/arcgis-blog/products/arcgis-pro/mapping/enthingify-symbols-with-light-shadow-effects", t: "yazı · John Nelson", d: "EN" } ] },
        { ad: "Basit 3B", kaynaklar: [
          { b: "Glowing Firefly symbols in 3D", u: "https://www.youtube.com/watch?v=PU-hcsoQr4M", t: YT, d: "EN", s: "8:49" },
          { b: "Author and share a local scene", u: "https://doc.esri.com/en/arcgis-pro/latest/get-started/author-and-share-a-local-scene.html", t: "ders · Esri", d: "EN", s: "~60 dk" } ] },
        { ad: "Daha fazlası", kaynaklar: [
          { b: "John Nelson Maps (YouTube kanalı)", u: "https://www.youtube.com/@JohnNelsonMaps", t: "kanal", d: "EN" },
          { b: "Adventures in Mapping (blog)", u: "https://adventuresinmapping.com/", t: "blog · John Nelson", d: "EN" },
          { b: "John Nelson'ın Esri blog yazıları", u: "https://www.esri.com/arcgis-blog/author/j_nelson", t: "yazılar", d: "EN" } ] }
      ] },
    { id: "veri", no: 4, ad: "Veri bulmak ve doğrulamak", ozet: "Doğru veriyi bulmak, kaynağını ve yılını not etmek, lisansına bakmak.",
      alistirma: "Kullanacağın veri için kurum, veri seti, yıl ve lisansı tek satırda yaz.", kaynaklar: [
        { b: "Kaynaklar sayfası (Türkiye ve dünya)", u: "kaynaklar.html", t: "sayfa", d: "TR" },
        { b: "Bakırçay CBS Açık Veri Kaynakları arşivi", u: "https://sdanacioglu.github.io/bakircay-cbs-acik-veri-kaynaklari/", t: "arşiv", d: "TR" }
      ] },
    { id: "yapay-zeka-modul", no: 5, ad: "Yapay zekâ ile sorumlu çalışmak", ozet: "Yapay zekâyı fikir tartışması, hata ayıklama ve eleştiri için kullanmak; sınırlarını bilmek.",
      alistirma: "\"Bu temada en sık yapılan haritalar\" sorusunu kendi temanla sor; çıkan yaklaşımlardan hangisine en yakın olduğunu ve nasıl farklılaşacağını yaz.", kaynaklar: [
        { b: "Kamp: yapay zekâ ilkeleri", u: "#yapay-zeka", t: "sayfa", d: "TR" },
        { b: "Kamp: soru örnekleri", u: "#promptlar", t: "sayfa", d: "TR" },
        { b: "The Ethics of AI-Generated Maps (Kang, Zhang & Roth)", u: "https://arxiv.org/abs/2304.10743v3", t: "makale", d: "EN", n: "yapay zekâ haritalarında hata ve yanıltma riskleri" },
        { b: "Envisioning Generative AI in Cartography and Mapmaking (Kang & Wang, 2025)", u: "https://arxiv.org/abs/2508.09028", t: "makale", d: "EN" },
        { b: "ArcGIS hazır GeoAI modelleri", u: "https://www.esri.com/en-us/geospatial-artificial-intelligence/deep-learning-models", t: "sayfa · Esri", d: "EN", n: "kullanırsan yapım notuna yaz" }
      ] }
  ];
  window.KAMP_MODULLER = MODULLER;

  /* Soru örnekleri */
  const pl = document.getElementById("prompt-listesi");
  if (pl) pl.innerHTML = PROMPTLAR.map((p, i) => `
    <div class="card prompt">
      <div class="prompt-ust"><strong>${esc(p.adim)}</strong>
        <button type="button" class="btn ghost kopyala" data-hedef="prompt-${i}">Kopyala</button></div>
      <pre id="prompt-${i}">${esc(p.metin)}</pre>
    </div>`).join("");

  /* Modüller */
  const liste = l => !l.length ? "" : `<ul class="res-list">${l.map(k => {
    const dis = /^https?:/.test(k.u);
    return `<li><a href="${esc(k.u)}"${dis ? ' target="_blank" rel="noopener"' : ""}>${esc(k.b)}</a>
      <span>${esc(k.t)}${k.d ? " · " + esc(k.d) : ""}${k.s ? " · " + esc(k.s) : ""}${k.n ? " · " + esc(k.n) : ""}</span></li>`; }).join("")}</ul>`;
  const ml = document.getElementById("modul-listesi");
  if (ml) ml.innerHTML = MODULLER.map(m => `
    <article class="card modul" id="${m.id}">
      <div class="modul-ust"><span class="modul-no">${m.no}</span><h3>${esc(m.ad)}</h3></div>
      <p class="muted">${esc(m.ozet)}</p>
      ${liste(m.kaynaklar)}
      ${(m.gruplar || []).map(g => `<details class="kgrup"><summary>${esc(g.ad)} <span class="muted">(${g.kaynaklar.length})</span></summary>${liste(g.kaynaklar)}</details>`).join("")}
      <div class="alistirma"><strong>⏱️ 10 dakikalık alıştırma:</strong> ${esc(m.alistirma)}</div>
    </article>`).join("");

  /* Kopyala düğmeleri */
  document.addEventListener("click", async e => {
    const b = e.target.closest(".kopyala"); if (!b) return;
    const el = document.getElementById(b.dataset.hedef); if (!el) return;
    try { await navigator.clipboard.writeText(el.textContent); b.textContent = "Kopyalandı ✓"; }
    catch (err) { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = "Seçildi, Ctrl+C"; }
    setTimeout(() => { b.textContent = "Kopyala"; }, 1800);
  });

  /* Kontrol listesi: yalnızca bu tarayıcıda hatırlanır */
  const kutular = [...document.querySelectorAll(".kontrol-listesi input")];
  let kayit = [];
  try { kayit = JSON.parse(localStorage.getItem("kamp-kontrol") || "[]"); } catch (e) { }
  kutular.forEach((k, i) => {
    k.checked = !!kayit[i];
    k.addEventListener("change", () => {
      try { localStorage.setItem("kamp-kontrol", JSON.stringify(kutular.map(x => x.checked))); } catch (e) { }
    });
  });

  /* Adım tarihleri: harita günü seçilince her adımın gerçek tarihi */
  const AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const GUNLER = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const gs = document.getElementById("kamp-gun");
  if (gs && window.TEMALAR) {
    gs.innerHTML += TEMALAR.filter(t => t.level !== "group").map(t => `<option value="${t.n}">${t.n} Kasım · ${esc(t.en)}</option>`).join("");
    const adimlar = [...document.querySelectorAll(".adimlar li[data-once]")];
    const varsayilan = adimlar.map(li => li.querySelector(".tarih").textContent);
    const bugun = new Date(); bugun.setHours(0, 0, 0, 0);
    const goster = () => {
      const n = +gs.value;
      adimlar.forEach((li, i) => {
        const t = li.querySelector(".tarih"), son = li.classList.contains("final");
        li.classList.remove("gecti");
        if (!n) { t.textContent = varsayilan[i]; return; }
        const d = new Date(2026, 10, n - +li.dataset.once);
        const gecti = d < bugun && !son;
        t.textContent = `${d.getDate()} ${AYLAR[d.getMonth()]} ${GUNLER[d.getDay()]}` + (son ? " (son gün)" : "") + (gecti ? " · tarihi geçti, hemen yap" : "");
        li.classList.toggle("gecti", gecti);
      });
      document.getElementById("kamp-gun-not").textContent = n ? "Tarihler önerilir; yalnızca final tarihi kesindir." : "";
      try { localStorage.setItem("kamp-gun", gs.value); } catch (e) { }
    };
    try { const v = localStorage.getItem("kamp-gun"); if (v) gs.value = v; } catch (e) { }
    gs.addEventListener("change", goster); goster();
  }

  if (location.hash) setTimeout(() => document.querySelector(location.hash)?.scrollIntoView(), 60);
})();
