/* BakırçayCBS · #30DayMapChallenge 2026 — toplantı takvimi
   Sabit toplantılar toplanti.js'ten üretilir; akran toplantıları yayımlanmış CSV'den okunur. */
(function () {
  const T = window.TOPLANTI;
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const AY = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  const GUNK = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const tarih = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const ekle = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const hg = d => (d.getDay() + 6) % 7;                         // 0 = Pazartesi
  const bugun = iso(new Date());
  const fold = s => String(s || "").toLocaleLowerCase("tr").trim();

  /* Öğrenci takvimi: genel, mentör ve akran toplantıları */
  const TUR = {
    genel:  { ad: "Genel toplantı", cls: "t-genel" },
    mentor: { ad: "Mentör toplantısı", cls: "t-mentor" },
    akran:  { ad: "Akran toplantısı", cls: "t-akran" },
    final: { ad: "Final teslimin", cls: "t-final" },
    paylasim: { ad: "Paylaşım günün", cls: "t-paylasim" }
  };

  /* --- Sabit olaylar --- */
  const olaylar = [];
  const bas = tarih(T.baslangic), son = tarih(T.bitis);
  for (let d = bas; d <= son; d = ekle(d, 1)) {
    const s = iso(d), g = hg(d);
    if (g === T.genel.gun && s >= T.genel.ilk && s <= T.genel.son) {
      const ist = (T.genel.istisna || {})[s] || {};
      olaylar.push({ t: ist.tarih || s, tur: "genel", saat: T.genel.saat, baslik: "Genel toplantı", alt: ist.not || "Tüm ekip", herkes: true });
    }
    if (s >= T.mentorToplanti.ilk && s <= T.mentorToplanti.son)
      T.mentorler.forEach(m => {
        if (g === m.gun) olaylar.push({ t: s, tur: "mentor", saat: m.saat || "", baslik: m.ad.split(" ")[0] + " ekibi",
          alt: "Mentör: " + m.ad, kimler: [m.ad].concat(m.ekip) });
      });
  }
  /* Paylaşım günleri: yalnızca bir kişi seçildiğinde, o kişinin harita günü */
  Object.entries((window.EKIP || {}).gunler || {}).forEach(([n, l]) => {
    const tm = TEMALAR.find(x => x.n === +n) || {};
    olaylar.push({ t: iso(new Date(2026, 10, +n - CONFIG.finalOffset)), tur: "final", saat: "",
      baslik: `📤 Final teslim · Gün ${n}`, alt: tm.en || "", kimler: l.map(p => p.ad), kisiye: true });
    olaylar.push({ t: iso(new Date(2026, 10, +n)), tur: "paylasim", saat: +n === 10 ? "14:00" : CONFIG.postTime,
      baslik: `🗺️ Paylaşım · Gün ${n}`, alt: tm.en || "", kimler: l.map(p => p.ad), kisiye: true });
  });

  /* --- Kişi listesi --- */
  const uyeler = (h, g) => ((T.akran[h] || {})[g] || []);
  const kisiler = [...new Set(T.mentorler.flatMap(m => [m.ad, ...m.ekip]))]
    .sort((a, b) => a.localeCompare(b, "tr"));
  const sel = document.getElementById("kisi");
  sel.innerHTML += kisiler.map(k => `<option>${esc(k)}</option>`).join("");

  /* --- Tür filtresi --- */
  const acik = new Set(Object.keys(TUR));
  const fb = document.getElementById("tur-filtre");
  fb.innerHTML = Object.entries(TUR).map(([k, v]) => `<button type="button" class="${v.cls}" data-t="${k}" aria-pressed="true"><i></i>${v.ad}</button>`).join("");
  fb.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    acik.has(b.dataset.t) ? acik.delete(b.dataset.t) : acik.add(b.dataset.t);
    b.setAttribute("aria-pressed", acik.has(b.dataset.t)); ciz();
  });
  try { const k = localStorage.getItem("takvim-kisi"); if (k && [...sel.options].some(o => o.value === k)) sel.value = k; } catch (e) { }
  sel.addEventListener("change", () => { try { localStorage.setItem("takvim-kisi", sel.value); } catch (e) { } ciz(); });

  /* --- Akran toplantıları (CSV) --- */
  let akran = [];
  const csvParse = txt => {
    const rows = []; let row = [], f = "", q = false;
    for (let i = 0; i < txt.length; i++) {
      const c = txt[i];
      if (q) { if (c === '"') { if (txt[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
      else if (c === '"') q = true;
      else if (c === ",") { row.push(f); f = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && txt[i + 1] === "\n") i++; row.push(f); rows.push(row); row = []; f = ""; }
      else f += c;
    }
    if (f || row.length) { row.push(f); rows.push(row); }
    const h = rows.shift() || [];
    return rows.filter(r => r.some(Boolean)).map(r => Object.fromEntries(h.map((k, i) => [k.trim(), (r[i] || "").trim()])));
  };
  const tarihOku = s => {
    let m;
    if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
    if ((m = s.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})/))) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
    return "";
  };
  /* Form: "Toplantı" sütunu "H1-A · …" ile başlar; alanlar "H1-A · Tarih" gibi adlandırılır.
     Aynı hafta ve grup için son "Planlandı" tarih/saati günceller; "Yapıldı" katılımı kaydeder. */
  const akranOku = satirlar => {
    const harita = {};
    satirlar.forEach(r => {
      const m = (r["Toplantı"] || "").match(/^(H\d)-([A-E])/); if (!m) return;
      const [, h, g] = m, key = `${h}-${g}`; if (!uyeler(h, g).length) return;
      const al = k => r[`${key} · ${k}`] || "";
      const yapildi = /yap[ıi]ld[ıi]/i.test(al("Bildirim türü"));
      const t = tarihOku(al("Tarih")), saat = al("Saat").slice(0, 5);
      const o = harita[key] || (harita[key] = { h, g, t: "", saat: "", yapildi: false, katilan: [] });
      if (t) { o.t = t; o.saat = saat || o.saat; }
      if (yapildi) { o.yapildi = true; o.katilan = al("Katılanlar").split(/,\s*/).filter(Boolean); }
    });
    return Object.values(harita).filter(o => o.t).map(o => ({ ...o, katilmayan: uyeler(o.h, o.g).filter(x => !o.katilan.includes(x)) }));
  };

  /* --- Takvim çizimi --- */
  const ilgili = (o, k) => o.kisiye ? !!k && o.kimler.includes(k) : (!k || o.herkes || (o.kimler || []).includes(k));
  function ciz() {
    fb.querySelectorAll('[data-t="paylasim"], [data-t="final"]').forEach(b => { b.hidden = !sel.value; });
    const k = sel.value;
    const tum = olaylar.concat(akran.map(a => {
      const n = uyeler(a.h, a.g).length;
      return { t: a.t, tur: "akran", saat: a.saat, baslik: `Akran ${a.g}${a.yapildi ? ` ✓ ${a.katilan.length}/${n}` : ""}`,
        alt: a.yapildi ? (a.katilmayan.length ? "Katılmadı: " + a.katilmayan.join(", ") : "Herkes katıldı")
                       : "Planlandı · " + uyeler(a.h, a.g).join(", "),
        kimler: uyeler(a.h, a.g), durum: a.yapildi ? (a.katilmayan.length ? "yapildi eksikli" : "yapildi") : "plan" };
    }));
    const gor = tum.filter(o => acik.has(o.tur) && ilgili(o, k));
    const gunluk = {};
    gor.forEach(o => (gunluk[o.t] = gunluk[o.t] || []).push(o));
    Object.values(gunluk).forEach(l => l.sort((a, b) => (a.saat || "99").localeCompare(b.saat || "99")));

    let html = "";
    /* Ana sayfadaki challenge takvimiyle aynı ızgara: pazartesiden başlar, Kasım günlerinde tema ve seviye rengi */
    const LVL = { easy: "lvl-easy", mid: "lvl-mid", hard: "lvl-hard", group: "lvl-group" };
    html = GUNK.map(g => `<div class="dow">${g}</div>`).join("");
    for (let d = bas; d <= son; d = ekle(d, 1)) {
      const s = iso(d), l = gunluk[s] || [];
      const tm = d.getMonth() === 10 ? TEMALAR.find(x => x.n === d.getDate()) : null;
      html += `<div class="day tk-gun ${tm ? LVL[tm.level] : "tk-disi"}${s === bugun ? " bugun" : ""}${l.length ? "" : " bos"}">
        <span class="d">${d.getDate()} ${AY[d.getMonth()]} · ${GUNK[hg(d)]}</span>
        ${tm ? `<span class="t">${esc(tm.en)}</span>` : ""}
        ${l.map(o => `<div class="tk-olay ${TUR[o.tur].cls}${o.durum ? " " + o.durum : ""}" title="${esc(o.baslik + " · " + o.alt)}">
          ${o.saat ? `<span class="tk-saat">${esc(o.saat)}</span>` : ""}<span class="tk-ad">${esc(o.baslik)}</span>${o.tur === "akran" || o.tur === "paylasim" || o.tur === "final" || (o.tur === "genel" && o.alt !== "Tüm ekip") ? `<small>${esc(o.alt)}</small>` : ""}</div>`).join("")}
      </div>`;
    }
    document.getElementById("takvim").innerHTML = html;
    const eksik = T.mentorler.filter(m => !m.saat).map(m => m.ad.split(" ")[0]);
    document.getElementById("takvim-not").textContent = eksik.length ? `Mentör toplantı saatleri belirlenince eklenecek (${eksik.join(", ")}).` : "";
    takip();
    mentorCiz();
  }

  /* --- Mentör ekipleri: harita günleri ekip.js'ten --- */
  const haritaGunu = ad => Object.keys((window.EKIP || {}).gunler || {})
    .filter(n => EKIP.gunler[n].some(p => p.ad === ad)).map(Number);
  function mentorCiz() {
    const k = sel.value;
    document.getElementById("mentor-ekipler").innerHTML = T.mentorler.map(m => {
      const gun = `${["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"][m.gun]}${m.saat ? " · " + esc(m.saat) : ""}`;
      return `<div class="card${k && (m.ad === k || m.ekip.includes(k)) ? " benim" : ""}">
        <h3 style="margin-top:0">${esc(m.ad)}</h3>
        <p class="muted" style="margin:0 0 8px">${m.ekip.length} kişi · ${gun}</p>
        <ul>${m.ekip.map(ad => { const g = haritaGunu(ad);
          return `<li class="${ad === k ? "benim" : ""}">${esc(ad)}${g.length ? ` <span class="muted">(${g.join(", ")})</span>` : ""}</li>`; }).join("")}</ul>
      </div>`;
    }).join("");
  }

  /* --- Haftalık akran grupları ve takip --- */
  const buHafta = (T.akranHaftalar.slice().reverse().find(w => w.bas <= bugun) || T.akranHaftalar[0]).id;
  let seciliHafta = buHafta;
  /* "26 Eki – 1 Kas" ya da "2–8 Kas" */
  const aralik = w => { const a = tarih(w.bas), b = ekle(a, 6);
    return a.getMonth() === b.getMonth() ? `${a.getDate()}–${b.getDate()} ${AY[b.getMonth()]}` : `${a.getDate()} ${AY[a.getMonth()]} – ${b.getDate()} ${AY[b.getMonth()]}`; };
  function gruplariCiz() {
    const k = sel.value;
    document.getElementById("akran-gruplar").innerHTML =
      `<div class="filters hafta-sec" role="group" aria-label="Hafta">${T.akranHaftalar.map(w =>
        `<button type="button" data-h="${w.id}" aria-pressed="${w.id === seciliHafta}">${esc(w.ad)}<small>${aralik(w)}</small></button>`).join("")}</div>` +
      `<p class="hafta-baslik"><strong>${esc(T.akranHaftalar.find(w => w.id === seciliHafta).ad)}</strong> · ${aralik(T.akranHaftalar.find(w => w.id === seciliHafta))}</p>` +
      Object.entries(T.akran[seciliHafta] || {}).map(([g, l]) =>
        `<div class="${k && l.includes(k) ? "benim" : ""}"><strong>${seciliHafta}-${g}</strong><span>${l.map(esc).join(" · ")}</span></div>`).join("");
  }
  document.getElementById("akran-gruplar").addEventListener("click", e => {
    const b = e.target.closest("button[data-h]"); if (b) { seciliHafta = b.dataset.h; gruplariCiz(); }
  });
  document.getElementById("form-dugme").innerHTML = T.akranForm
    ? `<a class="btn" href="${esc(T.akranForm)}" target="_blank" rel="noopener">Akran toplantısı bildir →</a>`
    : `<p class="muted" style="margin:8px 0 0">Bildirim formu bağlantısı WhatsApp grubunda paylaşılacak.</p>`;

  function takip() {
    gruplariCiz();
    const k = sel.value;
    const satir = ["A", "B", "C", "D", "E"];
    document.getElementById("akran-takip").innerHTML = `<table class="akran-tablo"><thead><tr><th>Grup</th>
      ${T.akranHaftalar.map(w => `<th>${esc(w.ad)}<br><span class="muted">${aralik(w)}</span></th>`).join("")}</tr></thead><tbody>
      ${satir.map(g => `<tr><td><strong>${g}</strong></td>${T.akranHaftalar.map(w => {
        const l = uyeler(w.id, g), benim = k && l.includes(k), gizli = k && !benim;
        const son = iso(ekle(tarih(w.bas), 6)), x = akran.find(a => a.h === w.id && a.g === g);
        const uye = `<span class="uyeler">${l.map(esc).join(", ")}</span>`;
        let ic;
        if (gizli) ic = `<span class="muted">·</span>`;
        else if (!x) ic = son < bugun ? `<span class="durum eksik">Bildirim yok</span>` : `<span class="muted">—</span>`;
        else if (!x.yapildi) ic = `<span class="durum plan">⏳ ${tarih(x.t).getDate()} ${AY[tarih(x.t).getMonth()]} ${esc(x.saat)}</span>`;
        else ic = `<span class="durum yapildi">✓ ${tarih(x.t).getDate()} ${AY[tarih(x.t).getMonth()]} · ${x.katilan.length}/${l.length}</span>` +
          (x.katilmayan.length ? `<span class="katilmayan">Katılmadı: ${x.katilmayan.map(esc).join(", ")}</span>` : "");
        return `<td class="${benim ? "benim" : ""}">${ic}${gizli ? "" : uye}</td>`;
      }).join("")}</tr>`).join("")}</tbody></table>`;
  }

  ciz();
  const durum = document.getElementById("akran-durum");
  if (T.akranCsv) {
    fetch(T.akranCsv + (T.akranCsv.includes("?") ? "&" : "?") + "t=" + Date.now())
      .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(txt => { akran = akranOku(csvParse(txt)); durum.textContent = `${akran.length} akran toplantısı bildirildi (${akran.filter(a => a.yapildi).length} yapıldı) · son güncelleme ${new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`; ciz(); })
      .catch(() => { durum.textContent = "Akran toplantıları şu anda yüklenemedi; sayfayı biraz sonra yenile."; });
  } else durum.textContent = "Akran toplantıları, bildirim formu açıldığında burada görünecek.";
})();
