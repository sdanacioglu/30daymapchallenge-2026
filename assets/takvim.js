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

  const TUR = {
    genel:  { ad: "Genel toplantı", cls: "t-genel" },
    mentor: { ad: "Mentör toplantısı", cls: "t-mentor" },
    akran:  { ad: "Akran toplantısı", cls: "t-akran" },
    koord:  { ad: "Koordinasyon", cls: "t-koord" },
    final:  { ad: "Final teslim", cls: "t-final" }
  };

  /* --- Sabit olaylar --- */
  const olaylar = [];
  const bas = tarih(T.baslangic), son = tarih(T.bitis);
  for (let d = bas; d <= son; d = ekle(d, 1)) {
    const s = iso(d), g = hg(d);
    if (g === T.koordinasyon.gun && s >= T.koordinasyon.ilk && s <= T.koordinasyon.son)
      olaylar.push({ t: s, tur: "koord", saat: T.koordinasyon.saat, baslik: "Koordinasyon", alt: "Koordinatör + mentörler", kimler: T.mentorler.map(m => m.ad).concat("Şevki Danacıoğlu") });
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
  /* Final teslimleri (harita gününden 3 gün önce) */
  Object.entries(EKIP.gunler).forEach(([n, l]) => {
    const tm = TEMALAR.find(x => x.n === +n) || {};
    const d = ekle(new Date(2026, 10, +n), -CONFIG.finalOffset);
    olaylar.push({ t: iso(d), tur: "final", saat: "", baslik: `Gün ${n} finali`, alt: `${tm.en || ""} · ${l.map(p => p.ad).join(", ")}`, kimler: l.map(p => p.ad) });
  });

  /* --- Kişi listesi --- */
  const kisiler = [...new Set(T.mentorler.flatMap(m => [m.ad, ...m.ekip]).concat(Object.values(T.akran).flat()))]
    .sort((a, b) => a.localeCompare(b, "tr"));
  const sel = document.getElementById("kisi");
  sel.innerHTML += kisiler.map(k => `<option>${esc(k)}</option>`).join("") + `<option>Şevki Danacıoğlu</option>`;

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
  const akranOku = satirlar => {
    const harita = {};
    satirlar.forEach((r, i) => {
      const g = (r["Grup"] || "").trim().charAt(0).toUpperCase(); if (!T.akran[g]) return;
      const al = k => r[`${g} grubu · ${k}`] || r[k] || "";
      const t = tarihOku(al("Tarih")); if (!t) return;
      const anahtar = g + t, yapildi = /yap[ıi]ld[ıi]/i.test(al("Bildirim türü"));
      const kat = al("Katılanlar").split(/,\s*/).filter(Boolean);
      const eski = harita[anahtar];
      if (!eski || yapildi || !eski.yapildi)
        harita[anahtar] = { g, t, saat: al("Saat").slice(0, 5), moderator: al("Moderatör"), yapildi: yapildi || (eski && eski.yapildi),
          katilan: yapildi ? kat : (eski ? eski.katilan : []), sira: i };
    });
    return Object.values(harita);
  };

  /* --- Takvim çizimi --- */
  const ilgili = (o, k) => !k || o.herkes || (o.kimler || []).includes(k);
  function ciz() {
    const k = sel.value;
    const tum = olaylar.concat(akran.map(a => ({
      t: a.t, tur: "akran", saat: a.saat, baslik: `Grup ${a.g}`,
      alt: a.yapildi ? `Yapıldı · ${a.katilan.length}/${T.akran[a.g].length} katılım` : `Planlandı${a.moderator ? " · moderatör: " + a.moderator : ""}`,
      kimler: T.akran[a.g], durum: a.yapildi ? "yapildi" : "plan"
    })));
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
          ${o.saat ? `<span class="tk-saat">${esc(o.saat)}</span>` : ""}<span class="tk-ad">${esc(o.baslik)}</span>${o.tur === "akran" || o.tur === "genel" && o.alt !== "Tüm ekip" ? `<small>${esc(o.alt)}</small>` : ""}</div>`).join("")}
      </div>`;
    }
    document.getElementById("takvim").innerHTML = html;
    const eksik = T.mentorler.filter(m => !m.saat).map(m => m.ad.split(" ")[0]);
    document.getElementById("takvim-not").textContent = eksik.length ? `Mentör toplantı saatleri belirlenince eklenecek (${eksik.join(", ")}).` : "";
    takip();
  }

  /* --- Akran grupları ve haftalık takip --- */
  document.getElementById("akran-gruplar").innerHTML = Object.entries(T.akran).map(([g, l]) =>
    `<div><strong>Grup ${g}</strong><span>${l.map(esc).join(" · ")}</span></div>`).join("");
  document.getElementById("form-dugme").innerHTML = T.akranForm
    ? `<a class="btn" href="${esc(T.akranForm)}" target="_blank" rel="noopener">Akran toplantısı bildir →</a>`
    : `<p class="muted" style="margin:8px 0 0">Bildirim formu bağlantısı WhatsApp grubunda paylaşılacak.</p>`;

  function takip() {
    const haftalar = [];
    for (let w = bas; w <= son; w = ekle(w, 7)) haftalar.push(w);
    const k = sel.value;
    const gruplar = Object.keys(T.akran).filter(g => !k || T.akran[g].includes(k));
    document.getElementById("akran-takip").innerHTML = `<table class="akran-tablo"><thead><tr><th>Grup</th>
      ${haftalar.map((w, h) => `<th>${h === 0 ? "Hazırlık" : h <= 4 ? h + ". hafta" : "Kapanış"}<br><span class="muted">${w.getDate()} ${AY[w.getMonth()]}</span></th>`).join("")}</tr></thead><tbody>
      ${gruplar.map(g => `<tr><td><strong>${g}</strong></td>${haftalar.map(w => {
        const a = iso(w), b = iso(ekle(w, 6));
        const l = akran.filter(x => x.g === g && x.t >= a && x.t <= b).sort((x, y) => x.t.localeCompare(y.t));
        if (!l.length) return `<td class="${b < bugun ? "eksik" : ""}">${b < bugun ? "Bildirim yok" : "—"}</td>`;
        return `<td>${l.map(x => x.yapildi
          ? `<span class="durum yapildi">✓ ${tarih(x.t).getDate()} ${AY[tarih(x.t).getMonth()]} · ${x.katilan.length}/${T.akran[g].length}</span>`
          : `<span class="durum plan">⏳ ${tarih(x.t).getDate()} ${AY[tarih(x.t).getMonth()]} ${esc(x.saat)}</span>`).join("<br>")}</td>`;
      }).join("")}</tr>`).join("")}</tbody></table>`;
  }

  ciz();
  const durum = document.getElementById("akran-durum");
  if (T.akranCsv) {
    fetch(T.akranCsv + (T.akranCsv.includes("?") ? "&" : "?") + "t=" + Date.now())
      .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(txt => { akran = akranOku(csvParse(txt)); durum.textContent = `${akran.length} akran toplantısı bildirildi · son güncelleme ${new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`; ciz(); })
      .catch(() => { durum.textContent = "Akran toplantıları şu anda yüklenemedi; sayfayı biraz sonra yenile."; });
  } else durum.textContent = "Akran toplantıları, bildirim formu açıldığında burada görünecek.";
})();
