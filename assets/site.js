/* BakırçayCBS · #30DayMapChallenge 2026 — ortak betik */
(function () {
  const LEVEL = {
    easy:  { label: "Kolay",  cls: "lvl-easy" },
    mid:   { label: "Orta",   cls: "lvl-mid" },
    hard:  { label: "İleri",  cls: "lvl-hard" },
    group: { label: "Ortak gün", cls: "lvl-group" }
  };
  const DOW = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
  const AY = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const dateOf = n => new Date(2026, 10, n);

  /* Son teslim: herkes için harita gününden finalOffset gün önce */
  const deadlineDate = t => dateOf(t.n - CONFIG.finalOffset);
  const deadlineOf = t => {
    if (t.level === "group") return "Etkinlikte birlikte";
    const d = deadlineDate(t);
    return `${d.getDate()} ${AY[d.getMonth()]}`;
  };
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const deadlineInExam = t => t.level !== "group" && iso(deadlineDate(t)) >= CONFIG.examStart && iso(deadlineDate(t)) <= CONFIG.examEnd;
  window.deadlineOf = deadlineOf;
  window.deadlineInExam = deadlineInExam;

  /* Header & footer */
  const page = document.body.dataset.page;
  const nav = [
    ["index.html", "home", "Etkinlik"],
    ["takvim.html", "takvim", "Etkinlik takvimi"],
    ["ekip.html", "ekip", "Ekip"],
    ["rehber.html", "rehber", "Rehber"],
    ["kaynaklar.html", "kaynaklar", "Kaynaklar"],
    ["koleksiyon.html", "koleksiyon", "Koleksiyon"],
    ["katil.html", "katil", "Katıl", "cta"]
  ];
  const header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <div class="wrap">
        <a class="brand" href="index.html">
          <img src="assets/logo.png" alt="BakırçayCBS logosu" width="40" height="40">
          <span>BakırçayCBS<small>#30DayMapChallenge 2026</small></span>
        </a>
        <nav class="nav" aria-label="Ana menü">
          ${nav.map(([href, key, label, cls]) =>
            `<a href="${href}"${cls ? ` class="${cls}"` : ""}${key === page ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
        </nav>
      </div>`;
    /* Final teslim şeridi: her sayfada menünün altında */
    if (CONFIG.teslimForm) {
      const serit = document.createElement("div");
      serit.className = "teslim-serit";
      serit.innerHTML = `<div class="wrap"><span>📤 <strong>Final teslim:</strong> harita gününden 3 gün önce, 23:59</span>
        <span class="teslim-linkler"><a href="${esc(CONFIG.teslimForm)}" target="_blank" rel="noopener">Teslim formu →</a>
        <a href="takvim.html">Etkinlik takvimi</a></span></div>`;
      header.after(serit);
    }
  }
  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="wrap">
        <div>© 2026 BakırçayCBS · İzmir Bakırçay Üniversitesi Coğrafi Bilgi Sistemleri Topluluğu<br>
        Haritaların hakları hazırlayan öğrencilere aittir ve izinleriyle paylaşılmaktadır.</div>
        <div class="contact">
          <strong>Soruların için</strong>
          <div class="social" aria-label="İletişim"><a href="${esc(CONFIG.instagram)}" target="_blank" rel="noopener" title="Instagram @bakircaycbs" aria-label="Instagram @bakircaycbs"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a><a href="${esc(CONFIG.linkedin)}" target="_blank" rel="noopener" title="LinkedIn" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11.2 21 14.5V21h-4v-5.8c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21H9z"/></svg></a><a href="mailto:${esc(CONFIG.email)}" title="bakircaycbs@gmail.com" aria-label="E-posta: bakircaycbs@gmail.com"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></a></div>
          <span><a href="https://30daymapchallenge.com/">30daymapchallenge.com</a> · <a href="https://30daymapchallenge.com/galleries/">Galeriler</a></span>
        </div>
      </div>`;
  }

  /* Live countdown */
  const cd = document.getElementById("countdown");
  if (cd) {
    const start = new Date(CONFIG.start);
    const day0 = new Date(CONFIG.dayZero);
    const end = new Date("2026-12-01T00:00:00+03:00");
    const pad = v => String(v).padStart(2, "0");
    const tick = () => {
      const now = new Date();
      const ms = start - now;
      if (ms > 0) {
        const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
        cd.innerHTML = `<div class="lbl">Başlangıca kalan süre</div>
          <div class="cd-grid">
            <div><span class="num">${d}</span><span>gün</span></div>
            <div><span class="num">${pad(h)}</span><span>saat</span></div>
            <div><span class="num">${pad(m)}</span><span>dakika</span></div>
            <div><span class="num">${pad(s)}</span><span>saniye</span></div>
          </div>
          <div class="muted">İlk harita: 1 Kasım 2026 Pazar · ${esc(CONFIG.postTime)} (TSİ)</div>`;
        return true;
      }
      const n = now < end ? Math.floor((now - day0) / 864e5) + 1 : null;
      const t = n && TEMALAR.find(x => x.n === n);
      cd.innerHTML = t
        ? `<div class="lbl">Bugün · Gün ${n}</div><div class="num" style="font-size:2.2rem;margin:6px 0">${esc(t.en)}</div><div class="muted">${esc(t.tr)}</div>
           <div style="margin-top:10px"><a href="koleksiyon.html">Koleksiyona git →</a></div>`
        : `<div class="num" style="font-size:2rem">30 gün, 30 harita</div><div class="lbl"><a href="koleksiyon.html">Koleksiyona göz at →</a></div>`;
      return false;
    };
    if (tick()) { const id = setInterval(() => { if (!tick()) clearInterval(id); }, 1000); }
  }

  /* Calendar (Monday-first grid) */
  const cal = document.getElementById("calendar");
  if (cal) {
    const lead = (dateOf(1).getDay() + 6) % 7;
    const dows = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
    let html = dows.map(d => `<div class="dow">${d}</div>`).join("");
    html += '<div class="day empty"></div>'.repeat(lead);
    TEMALAR.forEach(t => {
      html += `<a class="day ${LEVEL[t.level].cls}" href="temalar.html#gun-${t.n}" title="${esc(t.tr)} · Son teslim: ${esc(deadlineOf(t))}">
        <span class="d">${t.n} Kas · ${DOW[dateOf(t.n).getDay()]}</span>
        <span class="t">${esc(t.en)}</span><span class="tr">${esc(t.tr)}</span>
        ${t.level === "group" ? '<span class="tag">👥 ortak gün</span>' : ""}</a>`;
    });
    cal.innerHTML = html;
  }

  /* Example maps from past galleries */
  const ornekHtml = n => {
    const l = (window.ORNEKLER || {})[String(n)] || [];
    if (!l.length) return "";
    return `<details class="ornekler"><summary>🗺️ Örnek haritalar (${l.length})</summary><ul>
      ${l.map(o => `<li><a href="${esc(o.url)}" target="_blank" rel="noopener">${esc(o.baslik)}</a>
        <span>${esc(o.yazar)} · ${esc(o.yil)} · <em>${esc(o.eski_tema)}</em>${o.not ? ` · ${esc(o.not)}` : ""}</span></li>`).join("")}
    </ul><small>Önceki yılların <a href="https://30daymapchallenge.com/galleries/" target="_blank" rel="noopener">#30DayMapChallenge galerilerinden</a>; ilham içindir.</small></details>`;
  };

  /* Theme cards with level filters */
  const themes = document.getElementById("themes");
  if (themes) {
    const render = filter => {
      themes.innerHTML = TEMALAR
        .filter(t => filter === "all" || t.level === filter)
        .map(t => `
        <article class="card theme ${LEVEL[t.level].cls}" id="gun-${t.n}">
          <div class="head"><span class="num">GÜN ${t.n} · ${t.n} KASIM ${DOW[dateOf(t.n).getDay()].toUpperCase()}</span>
            <span class="badge">${LEVEL[t.level].label}</span></div>
          <h3>${esc(t.en)}</h3>
          <div class="tr">${esc(t.tr)}</div>
          <blockquote>${esc(t.desc)}</blockquote>
          <dl>
            <dt>Fikir önerileri</dt><dd>${esc(t.ideas)}</dd>
            <dt>Veri ipucu</dt><dd>${esc(t.data)} · <a href="kaynaklar.html">Kaynaklar →</a></dd>
            <dt>Son teslim</dt><dd>${esc(deadlineOf(t))}</dd>
          </dl>
          ${t.flag ? `<div class="flag">${esc(t.flag)}</div>` : ""}
          ${ornekHtml(t.n)}
        </article>`).join("");
    };
    const bar = document.getElementById("filters");
    const opts = [["all", "Tümü"], ["easy", "Kolay"], ["mid", "Orta"], ["hard", "İleri"], ["group", "Ortak günler"]];
    bar.innerHTML = opts.map(([v, l], i) => `<button type="button" data-v="${v}" aria-pressed="${i === 0}">${l}</button>`).join("");
    bar.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      bar.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
      render(b.dataset.v);
    });
    render("all");
    if (location.hash) setTimeout(() => document.querySelector(location.hash)?.scrollIntoView(), 50);
  }

  /* Join page: embedded form */
  const form = document.getElementById("form-slot");
  if (form) {
    if (CONFIG.formEmbedUrl) {
      form.innerHTML = `<iframe class="form-frame" src="${esc(CONFIG.formEmbedUrl)}" title="Katılım ve tema tercihi formu" loading="lazy">Yükleniyor…</iframe>
        <p class="muted" style="margin-top:10px">Form görünmüyor mu? <a href="${esc(CONFIG.formUrl || CONFIG.formEmbedUrl)}" target="_blank" rel="noopener">Formu yeni sekmede aç</a>.</p>`;
    } else {
      form.innerHTML = `<div class="card empty-state"><h3>Form çok yakında burada</h3>
        <p class="muted">Katılım ve tema tercihi formu 18 Ekim'de açılacak.</p></div>`;
    }
  }
  document.querySelectorAll("[data-config]").forEach(el => { el.textContent = CONFIG[el.dataset.config] ?? ""; });

  /* Contact box (rehber, katıl) */
  document.querySelectorAll("[data-contact]").forEach(el => {
    el.className = "card contact-box";
    el.innerHTML = `<h3>💬 Sorun mu var?</h3>
      <p class="muted">Süreçle ilgili her soruyu sosyal medya hesaplarımızdan ya da e-postayla iletebilirsin.</p>
      <div class="btn-row" style="margin-top:8px">
        <a class="btn ghost" href="${esc(CONFIG.instagram)}" target="_blank" rel="noopener">Instagram</a>
        <a class="btn ghost" href="${esc(CONFIG.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
        <a class="btn ghost" href="mailto:${esc(CONFIG.email)}">${esc(CONFIG.email)}</a>
      </div>`;
  });

  /* Collection */
  const gal = document.getElementById("gallery");
  if (gal) {
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const items = KOLEKSIYON.filter(m => m.date <= today).sort((a, b) => a.n - b.n);
    const count = document.getElementById("map-count");
    if (count) count.textContent = items.length;
    gal.innerHTML = items.length ? items.map(m => {
      const t = TEMALAR.find(x => x.n === m.n) || {};
      return `<article class="card map-card ${LEVEL[t.level]?.cls || ""}" id="gun-${m.n}">
        <a href="${esc(m.image)}" target="_blank" rel="noopener"><img src="${esc(m.image)}" alt="Gün ${m.n} · ${esc(t.en)}: ${esc(m.title)}" loading="lazy"></a>
        <div class="body">
          <div class="meta">Gün ${m.n} · ${esc(t.en)} (${esc(t.tr)})</div>
          <h3 style="margin:4px 0">${esc(m.title)}</h3>
          <div class="meta">👤 ${esc(m.author)}<br>📊 ${esc(m.data)} · 🛠️ ${esc(m.tool)}</div>
          ${m.link ? `<a href="${esc(m.link)}" target="_blank" rel="noopener">Paylaşımı gör →</a>` : ""}
        </div></article>`;
    }).join("") : `<div class="card empty-state" style="grid-column:1/-1"><h3>İlk harita 1 Kasım'da burada</h3>
      <p class="muted">Haritalar, temalarının gününde bu sayfaya eklenecek.</p></div>`;
  }
})();
