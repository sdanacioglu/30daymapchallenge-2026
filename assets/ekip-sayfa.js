/* BakırçayCBS · #30DayMapChallenge 2026 — ekip sayfası */
(function () {
  const LEVEL = { easy: ["Kolay", "lvl-easy"], mid: ["Orta", "lvl-mid"], hard: ["İleri", "lvl-hard"], group: ["Ortak gün", "lvl-group"] };
  const DOW = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const AY = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const dateOf = n => new Date(2026, 10, n);
  const KISA = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
  const gunAdi = n => DOW[dateOf(n).getDay()];
  const saat = n => n === 10 ? "14:00" : CONFIG.postTime;
  const fold = s => s.toLocaleLowerCase("tr").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i");
  const bugun = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; })();
  const haritalar = n => (window.KOLEKSIYON || []).filter(m => m.n === n && m.date <= bugun);
  const ILK = 8;                                   // "ilk günler": finali 5 Kasım'a kadar olanlar

  /* Yerel önizleme: koordinatör notları ve senaryolar (GitHub'da bu dosya yok) */
  const NOT = window.EKIP_NOTLAR || null;
  const SEN = NOT ? NOT.senaryolar : [{ id: "A", gunler: Object.fromEntries(Object.entries(EKIP.gunler).map(([k, v]) => [k, v.map(p => p.ad)])), notlar: {} }];
  let aktif = SEN[0];
  try { const s = localStorage.getItem("ekip-senaryo"); if (s && SEN.find(x => x.id === s)) aktif = SEN.find(x => x.id === s); } catch (e) { }
  const kisiler = (n, s = aktif) => s.gunler[n] || [];
  const sira = (ad, n) => { const k = NOT && NOT.kisiler[ad]; if (!k) return null; const i = k.t.indexOf(n); return i < 0 ? 0 : i + 1; };
  const gunu = (ad, s) => +Object.keys(s.gunler).find(g => s.gunler[g].includes(ad));
  const bosta = () => NOT ? Object.keys(NOT.kisiler).filter(ad => !(NOT.listeDisi || []).includes(ad) && !Object.values(aktif.gunler).flat().includes(ad)) : [];
  const adaylar = n => bosta().filter(ad => NOT.kisiler[ad].t.includes(n)).sort((a, b) => sira(a, n) - sira(b, n));
  const adayHtml = n => adaylar(n).map(ad => `${esc(ad)} <b>(${sira(ad, n)}.)</b>`).join(", ");
  const degisti = n => aktif !== SEN[0] && kisiler(n).join("|") !== kisiler(n, SEN[0]).join("|");

  const bireysel = TEMALAR.filter(t => t.level !== "group");
  const ozetle = s => {
    const tum = [...new Set(Object.values(s.gunler).flat())], say = [0, 0, 0, 0];
    let den = 0;
    Object.entries(s.gunler).forEach(([g, l]) => l.forEach(ad => {
      const r = sira(ad, +g); if (r !== null) say[r]++;
      if (+g <= ILK && NOT && NOT.kisiler[ad]?.d) den++;
    }));
    return { tum: tum.length, ikili: Object.values(s.gunler).filter(l => l.length > 1).length,
      dolu: bireysel.filter(t => kisiler(t.n, s).length).length, say, den };
  };

  if (EKIP.taslak && document.getElementById("taslak-not")) {
    document.getElementById("taslak-not").innerHTML =
      `<div class="note"><strong>Taslak liste.</strong> Atamalar koordinatör onayından sonra kesinleşir (son güncelleme: ${esc(EKIP.guncelleme)}).</div>`;
  }

  /* Senaryo seçici (yalnızca yerel) */
  if (NOT && SEN.length > 1 && document.getElementById("ekip-ozet")) {
    const kutu = document.createElement("div");
    kutu.className = "card senaryo";
    document.getElementById("ekip-ozet").before(kutu);
    const ciz = () => {
      kutu.innerHTML = `<div class="senaryo-ust"><strong>🔒 Senaryo karşılaştırması</strong> <small class="muted">yalnızca yerel önizlemede</small></div>
        <div class="filters" role="group" aria-label="Senaryo">${SEN.map(s => `<button type="button" data-s="${s.id}" aria-pressed="${s === aktif}">${esc(s.ad)}</button>`).join("")}</div>
        <div class="table-wrap"><table class="senaryo-tablo"><thead><tr><th></th>${SEN.map(s => `<th>${esc(s.id)}</th>`).join("")}</tr></thead><tbody>
        ${[["1. tercih", o => o.say[1]], ["2. tercih", o => o.say[2]], ["3. tercih", o => o.say[3]], ["Tercih dışı teklif", o => o.say[0]],
           ["İkili ekip", o => o.ikili], [`Deneyimli kişi · Gün 1–${ILK}`, o => o.den]]
          .map(([l, f]) => `<tr><td>${l}</td>${SEN.map(s => `<td${s === aktif ? ' class="aktif"' : ""}>${f(ozetle(s))}</td>`).join("")}</tr>`).join("")}
        </tbody></table></div>
        ${aktif !== SEN[0] ? `<p class="muted" style="margin:8px 0 0"><span class="degisti-ornek"></span> ${SEN[0].id}'ya göre değişen günler · ${TEMALAR.filter(t => degisti(t.n)).length} gün</p>` : ""}`;
    };
    kutu.addEventListener("click", e => {
      const b = e.target.closest("button[data-s]"); if (!b) return;
      aktif = SEN.find(s => s.id === b.dataset.s);
      try { localStorage.setItem("ekip-senaryo", aktif.id); } catch (e) { }
      ciz(); render();
    });
    ciz();
  }

  /* İsimler hiçbir yerde sınıf, tercih ya da başka etiketle gösterilmez. */
  const isimHtml = ad => `<span class="kisi" data-ad="${esc(fold(ad))}">${esc(ad)}</span>`;

  const cal = document.getElementById("ekip-takvim");
  const liste = document.getElementById("ekip-liste");
  const ara = document.getElementById("ekip-ara"), sonuc = document.getElementById("ara-sonuc");

  function render() {
    const o = ozetle(aktif), ozet = document.getElementById("ekip-ozet");
    if (ozet) ozet.innerHTML = [
      [o.tum, "katılımcı"], [`${o.dolu}/${bireysel.length}`, "bireysel gün dolu"],
      [o.ikili, "ikili ekip"], [TEMALAR.length - bireysel.length, "ortak gün"], [TEMALAR.filter(t => haritalar(t.n).length).length, "harita yayında"]
    ].map(([v, l]) => `<div><span class="num">${v}</span><span>${l}</span></div>`).join("");

    const panel = document.getElementById("bosta-panel");
    if (NOT && panel) {
      const b = bosta(), dolu = n => !!kisiler(n).length;
      panel.hidden = false;
      panel.innerHTML = `<div class="senaryo-ust"><strong>🔒 Boşta olanlar (${b.length})</strong> <small class="muted">yalnızca yerel önizlemede · üstü çizili tercih dolu</small></div>
        <ul class="bosta-liste">${b.sort((x, y) => x.localeCompare(y, "tr")).map(ad => { const k = NOT.kisiler[ad];
          return `<li><span class="kisi">${esc(ad)}<i class="yerel sinif">${esc(k.s)}</i>${k.gec ? '<i class="yerel gec">geç</i>' : ""}</span>
            <span class="tercihler">${k.t.map((g, i) => `<a href="#gun-${g}" class="${dolu(g) ? "dolu" : ""}" title="${i + 1}. tercih · Gün ${g}${dolu(g) ? " (dolu)" : ""}">${g}</a>`).join("")}</span></li>`; }).join("")}</ul>
        ${(NOT.listeDisi || []).length ? `<p class="muted" style="margin:8px 0 0">Liste dışı (üniversite dışı): ${NOT.listeDisi.map(esc).join(", ")}</p>` : ""}`;
    }
    const lead = (dateOf(1).getDay() + 6) % 7;
    cal.innerHTML = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map(d => `<div class="dow">${d}</div>`).join("")
      + '<div class="day empty"></div>'.repeat(lead)
      + TEMALAR.map(t => {
        const l = kisiler(t.n), grup = t.level === "group", h = haritalar(t.n).length;
        const uyari = "";
        return `<a class="day ${LEVEL[t.level][1]}${degisti(t.n) ? " degisti" : ""}" href="#gun-${t.n}" data-n="${t.n}">
          <span class="d">${t.n} Kas · ${KISA[dateOf(t.n).getDay()]}${uyari}</span>
          <span class="t">${esc(t.en)}</span>
          <span class="kisiler">${grup ? '<span class="kisi hep">🤝 Tüm ekip</span>' : l.length ? l.map(ad => isimHtml(ad, t.n, true)).join("") : '<span class="kisi bos">Boş</span>' + (NOT && adaylar(t.n).length ? `<span class="aday">Tercih eden: ${adayHtml(t.n)}</span>` : "")}</span>
          <span class="tag">${l.length > 1 ? "👥 ikili ekip" : ""}${h ? " 🗺️ harita yayında" : ""}</span></a>`;
      }).join("");

    if (liste) liste.innerHTML = `<table><thead><tr><th>Gün</th><th>Tema</th><th>Hazırlayan</th><th>Final teslim</th><th>Paylaşım</th></tr></thead><tbody>
      ${TEMALAR.map(t => {
        const l = kisiler(t.n), grup = t.level === "group";
        return `<tr class="${LEVEL[t.level][1]}${degisti(t.n) ? " degisti" : ""}" data-n="${t.n}" tabindex="0">
          <td><strong>${t.n}</strong> <span class="muted">${t.n} Kas ${KISA[dateOf(t.n).getDay()]}</span></td>
          <td><span class="lvl-cizgi"></span>${esc(t.en)}<br><span class="muted">${esc(t.tr)}</span></td>
          <td>${grup ? "🤝 Tüm ekip" : l.map(ad => isimHtml(ad, t.n, true)).join("<br>") || `<span class="muted">Boş</span>${NOT && adaylar(t.n).length ? `<br><span class="aday">Tercih eden: ${adayHtml(t.n)}</span>` : ""}`}</td>
          <td>${esc(deadlineOf(t))}${deadlineInExam(t) ? " ❗" : ""}</td>
          <td>${t.n} Kas · ${saat(t.n)}</td></tr>`;
      }).join("")}</tbody></table>
      <p class="muted" style="margin:10px 0 0">❗ Final teslimi ara sınav dönemine (31 Ekim – 8 Kasım) denk geliyor.</p>`;
    filtrele();
    hashOku();
  }

  /* Görünüm geçişi */
  const bar = document.getElementById("gorunum");
  if (bar) {
  const goster = v => {
    bar.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.v === v));
    cal.hidden = v !== "takvim"; liste.hidden = v !== "liste";
    try { localStorage.setItem("ekip-gorunum", v); } catch (e) { }
  };
  bar.addEventListener("click", e => { const b = e.target.closest("button"); if (b) goster(b.dataset.v); });
  try { const v = localStorage.getItem("ekip-gorunum"); if (v) goster(v); } catch (e) { }
  }

  /* İsim arama */
  function filtrele() {
    const q = fold(ara.value.trim());
    let say = 0;
    document.querySelectorAll("#ekip-takvim .day[data-n], #ekip-liste tr[data-n]").forEach(el => {
      const eslesen = [...el.querySelectorAll(".kisi[data-ad]")].filter(k => q && k.dataset.ad.includes(q));
      el.classList.toggle("soluk", !!q && !eslesen.length);
      el.querySelectorAll(".kisi").forEach(k => k.classList.toggle("bulundu", eslesen.includes(k)));
      if (el.matches(".day") && eslesen.length) say++;
    });
    sonuc.textContent = q ? (say ? `${say} günde eşleşme var.` : "Eşleşen isim yok.") : "";
  }
  ara.addEventListener("input", filtrele);

  /* Gün detayı */
  const dlg = document.getElementById("gun-detay"), ic = document.getElementById("gd-icerik");
  const ac = n => {
    const t = TEMALAR.find(x => x.n === n); if (!t) return;
    const l = kisiler(n), grup = t.level === "group", h = haritalar(n);
    const once = TEMALAR.find(x => x.n === n - 1), sonra = TEMALAR.find(x => x.n === n + 1);
    const notlar = NOT && aktif.notlar[n];
    const onceki = degisti(n) ? kisiler(n, SEN[0]) : null;
    const ornek = ((window.ORNEKLER || {})[String(n)] || []).length;
    ic.innerHTML = `
      <div class="gd-ust ${LEVEL[t.level][1]}">
        <span class="num">GÜN ${n} · ${n} KASIM ${gunAdi(n).toUpperCase()}</span>
        <span class="badge">${LEVEL[t.level][0]}</span>
        <button type="button" class="gd-kapat" aria-label="Kapat">×</button>
      </div>
      <h2 id="gd-baslik">${esc(t.en)}</h2>
      <div class="gd-tr">${esc(t.tr)}</div>
      <blockquote>${esc(t.desc)}</blockquote>
      <div class="gd-blok">
        <h3>${grup ? "Kim hazırlıyor?" : l.length > 1 ? "Hazırlayanlar (ikili ekip)" : "Hazırlayan"}</h3>
        <div class="gd-kisiler">${grup ? '<span class="kisi hep">🤝 Tüm ekip birlikte</span>'
          : l.length ? l.map(ad => isimHtml(ad, n)).join("") : '<span class="kisi bos">Henüz atanmadı</span>'}</div>
        ${onceki ? `<p class="muted" style="margin:8px 0 0">Taslak ${esc(SEN[0].id)}'da: ${onceki.map(esc).join(" + ") || "—"}</p>` : ""}
      </div>
      <dl class="gd-tarih">
        <div><dt>Final teslim</dt><dd>${esc(deadlineOf(t))}${deadlineInExam(t) ? ' <span title="Ara sınav dönemi">❗ vize dönemi</span>' : ""}</dd></div>
        <div><dt>Paylaşım</dt><dd>${n} ${AY[10]} · ${saat(n)}</dd></div>
      </dl>
      <div class="gd-blok">
        <h3>Harita</h3>
        ${h.length ? h.map(m => `<figure class="gd-harita">
            <a href="${esc(m.image)}" target="_blank" rel="noopener"><img src="${esc(m.image)}" alt="Gün ${n} · ${esc(t.en)}: ${esc(m.title)}"></a>
            <figcaption><strong>${esc(m.title)}</strong><br><span class="muted">👤 ${esc(m.author)} · 📊 ${esc(m.data)} · 🛠️ ${esc(m.tool)}</span>
            ${m.link ? `<br><a href="${esc(m.link)}" target="_blank" rel="noopener">Paylaşımı gör →</a>` : ""}</figcaption></figure>`).join("")
          : `<div class="gd-bos">🗺️ Harita ${n} Kasım ${saat(n)}'de burada yayımlanacak.</div>`}
      </div>
      ${notlar ? `<div class="gd-yerel"><strong>🔒 Koordinatör notu</strong> <small>(yalnızca yerel önizlemede)</small><ul>${notlar.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>` : ""}
      <div class="gd-alt">
        <a href="temalar.html#gun-${n}">Tema ayrıntıları${ornek ? ` ve ${ornek} örnek harita` : ""} →</a>
        <span class="gd-gez">
          ${once ? `<a class="btn ghost" href="#gun-${once.n}" aria-label="Önceki gün">← ${once.n}</a>` : ""}
          ${sonra ? `<a class="btn ghost" href="#gun-${sonra.n}" aria-label="Sonraki gün">${sonra.n} →</a>` : ""}
        </span>
      </div>`;
    if (!dlg.open) dlg.showModal();
    ic.querySelector(".gd-kapat").focus();
  };
  const kapat = () => { if (dlg.open) dlg.close(); };
  function hashOku() { const m = location.hash.match(/^#gun-(\d+)$/); m ? ac(+m[1]) : kapat(); }
  dlg.addEventListener("close", () => { if (/^#gun-/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search); });
  dlg.addEventListener("click", e => { if (e.target === dlg || e.target.closest(".gd-kapat")) kapat(); });
  if (liste) liste.addEventListener("click", e => { const tr = e.target.closest("tr[data-n]"); if (tr) location.hash = `gun-${tr.dataset.n}`; });
  if (liste) liste.addEventListener("keydown", e => { const tr = e.target.closest("tr[data-n]"); if (tr && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); location.hash = `gun-${tr.dataset.n}`; } });
  document.addEventListener("keydown", e => {
    if (!dlg.open) return;
    const m = location.hash.match(/^#gun-(\d+)$/); if (!m) return;
    if (e.key === "ArrowRight" && +m[1] < 30) location.hash = `gun-${+m[1] + 1}`;
    if (e.key === "ArrowLeft" && +m[1] > 1) location.hash = `gun-${+m[1] - 1}`;
  });
  window.addEventListener("hashchange", hashOku);
  render();
})();
