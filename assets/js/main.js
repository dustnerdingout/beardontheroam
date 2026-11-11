/* =========================================================
   Beard on the Roam
   ---------------------------------------------------------
   EDIT HERE. Everything you'll need to change lives in SITE.
   ========================================================= */
const SITE = {
  // Paste full URLs when the accounts are ready. Empty = "coming soon".
  social: {
    youtube: "https://www.youtube.com/@beardontheroam",
    instagram: "https://www.instagram.com/beardontheroam",
  },

  // The email shown on the contact page AND where the form sends messages.
  contactEmail: "beardontheroam@gmail.com",

  // Big banner at the top of the home page. Drop the file in assets/img and it shows up.
  // Until the file exists, the page shows the logo over a dark mountain backdrop instead.
  heroBanner: "assets/img/hero-banner.jpg",

  // Episode cards on the home page. Add newest first.
  // url: YouTube link. thumb: image path or leave "" to use the YouTube thumbnail automatically.
  episodes: [
    { title: "Episode 01", meta: "Coming soon", url: "", thumb: "" },
    { title: "Episode 02", meta: "Coming soon", url: "", thumb: "" },
    { title: "Episode 03", meta: "Coming soon", url: "", thumb: "" },
  ],
};

/* ========================================================= */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- year ---------- */
$$("#year").forEach((el) => (el.textContent = new Date().getFullYear()));

/* ---------- header + mobile nav ---------- */
const header = $(".site-header");
const onScroll = () => header && header.classList.toggle("is-solid", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const toggle = $(".nav-toggle");
const list = $("#nav-list");
if (toggle && list) {
  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    list.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  $$("a", list).forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
}

/* ---------- home banner photo ---------- */
const banner = $("#banner");
if (banner && SITE.heroBanner) {
  const probe = new Image();
  probe.onload = () => {
    banner.style.backgroundImage = `url("${SITE.heroBanner}")`;
    banner.classList.add("has-photo");
  };
  probe.src = SITE.heroBanner;
}

/* ---------- social links ---------- */
$$("[data-social]").forEach((a) => {
  const url = SITE.social[a.dataset.social];
  if (url) {
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
  }
});
$$("[data-status]").forEach((el) => {
  if (SITE.social[el.dataset.status]) el.textContent = el.dataset.status === "youtube" ? "@beardontheroam // Subscribe" : "@beardontheroam // Follow";
});

/* ---------- episodes ---------- */
const youtubeId = (url) => {
  const m = String(url).match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
  return m ? m[1] : "";
};
const grid = $("#episode-grid");
if (grid) {
  grid.innerHTML = SITE.episodes
    .map((ep) => {
      const id = youtubeId(ep.url);
      const thumb = ep.thumb || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "assets/img/logo-on-dark.webp");
      const live = Boolean(ep.url);
      const tag = live ? "a" : "div";
      const attrs = live ? `href="${ep.url}" target="_blank" rel="noopener"` : `aria-label="${ep.title}, coming soon"`;
      return `
        <${tag} class="ep reveal${live ? "" : " is-soon"}" ${attrs}>
          <div class="ep-thumb">
            <span class="ep-rec">${live ? "REC" : "STANDBY"}</span>
            <img src="${thumb}" alt="" loading="lazy">
            <span class="ep-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 4v16l14-8z"/></svg></span>
          </div>
          <div class="ep-info">
            <span class="ep-title">${ep.title}</span>
            <span class="ep-meta">${ep.meta || ""}</span>
          </div>
        </${tag}>`;
    })
    .join("");
}

/* ---------- reveal on scroll ---------- */
$$(".tag, .section-head, .about-photo, .about-copy, .follow-card, .code-list li, .chapter, .contact-side, .form").forEach((el) =>
  el.classList.add("reveal")
);
const io = "IntersectionObserver" in window
  ? new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("is-in"), io.unobserve(e.target))),
      { threshold: 0.12 }
    )
  : null;
$$(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("is-in")));

/* ---------- topo map lines (hero background) ---------- */
function drawTopo(canvas) {
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  // seeded random so the map stays the same on every load
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  // smooth value noise
  const G = 12, grid = [];
  for (let i = 0; i <= G; i++) { grid[i] = []; for (let j = 0; j <= G; j++) grid[i][j] = rand(); }
  const fade = (t) => t * t * (3 - 2 * t);
  const noise = (x, y) => {
    const xi = Math.floor(x) % G, yi = Math.floor(y) % G, xf = fade(x % 1), yf = fade(y % 1);
    const a = grid[xi][yi], b = grid[xi + 1][yi], c = grid[xi][yi + 1], d = grid[xi + 1][yi + 1];
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  };
  const field = (x, y) => noise(x * 3, y * 3) * 0.65 + noise(x * 7 + 3.3, y * 7 + 1.7) * 0.35;

  // sample the field
  const step = 9;
  const cols = Math.ceil(w / step) + 1, rows = Math.ceil(h / step) + 1;
  const scale = 1 / Math.max(w, h);
  const v = [];
  for (let y = 0; y < rows; y++) { v[y] = []; for (let x = 0; x < cols; x++) v[y][x] = field(x * step * scale, y * step * scale); }

  // marching squares
  const levels = 16;
  for (let l = 1; l < levels; l++) {
    const t = l / levels;
    const major = l % 4 === 0;
    ctx.strokeStyle = major ? "rgba(255,114,40,.55)" : "rgba(236,228,210,.16)";
    ctx.lineWidth = major ? 1.2 : 0.8;
    ctx.beginPath();
    for (let y = 0; y < rows - 1; y++) {
      for (let x = 0; x < cols - 1; x++) {
        const a = v[y][x], b = v[y][x + 1], c = v[y + 1][x + 1], d = v[y + 1][x];
        const idx = (a > t) * 8 + (b > t) * 4 + (c > t) * 2 + (d > t);
        if (idx === 0 || idx === 15) continue;
        const px = x * step, py = y * step;
        const lerp = (p, q) => (t - p) / (q - p);
        const top = [px + step * lerp(a, b), py];
        const right = [px + step, py + step * lerp(b, c)];
        const bottom = [px + step * lerp(d, c), py + step];
        const left = [px, py + step * lerp(a, d)];
        const seg = (p, q) => { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
        switch (idx) {
          case 1: case 14: seg(left, bottom); break;
          case 2: case 13: seg(bottom, right); break;
          case 3: case 12: seg(left, right); break;
          case 4: case 11: seg(top, right); break;
          case 6: case 9: seg(top, bottom); break;
          case 7: case 8: seg(left, top); break;
          case 5: seg(left, top); seg(bottom, right); break;
          case 10: seg(top, right); seg(left, bottom); break;
        }
      }
    }
    ctx.stroke();
  }
}
const topos = $$(".topo");
if (topos.length) {
  const redraw = () => topos.forEach(drawTopo);
  redraw();
  let rt;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(redraw, 200); });
}

/* ---------- contact page ---------- */
const emailLink = $("#email-link");
if (emailLink) {
  if (SITE.contactEmail) {
    emailLink.href = `mailto:${SITE.contactEmail}`;
    $("strong", emailLink).textContent = SITE.contactEmail;
  } else {
    emailLink.removeAttribute("href");
  }
}

const form = $("#contact-form");
if (form) {
  const status = $("#form-status");
  const btn = $("button[type=submit]", form);

  if (!SITE.contactEmail) {
    status.textContent = "Form opens up as soon as the email is set. Check back soon.";
    status.className = "form-status err";
    btn.disabled = true;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!SITE.contactEmail) return;
    if (form.querySelector(".hp input").value) return; // bot trap

    const data = Object.fromEntries(new FormData(form));
    delete data._honey;
    data._subject = `Beard on the Roam: ${data.topic || "New message"} from ${data.name}`;
    data._template = "table";

    btn.disabled = true;
    status.className = "form-status";
    status.textContent = "Sending...";

    try {
      // FormSubmit forwards the message to SITE.contactEmail. No server needed.
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(SITE.contactEmail)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || String(out.success) === "false") throw new Error(out.message || "Send failed");
      form.reset();
      status.className = "form-status ok";
      status.textContent = "Message sent. We'll get back to you once we're back in signal.";
    } catch (err) {
      status.className = "form-status err";
      status.innerHTML = `Couldn't send that one. Email us directly at <a href="mailto:${SITE.contactEmail}">${SITE.contactEmail}</a>.`;
    } finally {
      btn.disabled = false;
    }
  });
}
