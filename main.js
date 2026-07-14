// ============================================================
// Criativos GS — main.js  (compiled from main.ts)
// UTM passthrough · countdown · dates · scroll reveal
// counters · FAQ · sticky CTA · video placeholder
// ============================================================
"use strict";

// ── UTM PASSTHROUGH ──────────────────────────────────────────
const UTM_KEYS = [
  "utm_source","utm_medium","utm_campaign",
  "utm_term","utm_content","utm_id",
  "fbclid","gclid","src","sck","ref","mlid",
];

function parseUTMParams() {
  const params = {};
  const search = new URLSearchParams(window.location.search);
  UTM_KEYS.forEach((key) => {
    const val = search.get(key);
    if (val) params[key] = val;
  });
  return params;
}

function buildCheckoutUrl(base, extras = {}) {
  if (!base) return "#";
  const url = new URL(base.startsWith("http") ? base : `https://${base}`);
  const merged = { ...parseUTMParams(), ...extras };
  Object.entries(merged).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

let _checkoutBase = "";

function initCheckout() {
  _checkoutBase = "https://pay.hub.la/DHb5ObJDQ3legMr1Hnss";

  const apply = () => {
    document.querySelectorAll("[data-checkout]").forEach((btn) => {
      if (btn.dataset.checkoutReady) return; // evita duplicar listeners
      btn.dataset.checkoutReady = "1";

      btn.addEventListener("click", (e) => {
        if (!_checkoutBase) {
          e.preventDefault();
          alert("⚙️ Configure o link de checkout em main.js");
          return;
        }
        // lê UTMs no momento do clique — mlid já foi injetado
        btn.href = buildCheckoutUrl(_checkoutBase);
      });
    });
  };

  apply();
  new MutationObserver(apply).observe(document.body, { childList: true, subtree: true });
}

// ── DATES ────────────────────────────────────────────────────
const PT_MONTHS = [
  "janeiro","fevereiro","março","abril","maio","junho",
  "julho","agosto","setembro","outubro","novembro","dezembro",
];

function formatDatePT(d) {
  return `${d.getDate()} de ${PT_MONTHS[d.getMonth()]}`;
}

function initDates() {
  const label = formatDatePT(new Date());
  document.querySelectorAll(".dyn-date").forEach((el) => (el.textContent = label));
  const yr = document.querySelector("#footer-year");
  if (yr) yr.textContent = String(new Date().getFullYear());
}

// ── COUNTDOWN ────────────────────────────────────────────────
function getMsUntilMidnight() {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 0);
  return Math.max(0, end.getTime() - now.getTime());
}
function pad(n) { return String(n).padStart(2, "0"); }
function initCountdown() {
  let remaining = getMsUntilMidnight();
  const tick = () => {
    if (remaining <= 0) remaining = getMsUntilMidnight();
    const total = Math.floor(remaining / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const short = `${pad(h)}h ${pad(m)}m ${pad(s)}s`;

    const barEl = document.querySelector("#bar-countdown");
    if (barEl) barEl.textContent = short;

    document.querySelectorAll(".bar-countdown-all").forEach((el) => {
      el.textContent = short;
    });

    const bonusEl = document.querySelector("#bonus-countdown");
    if (bonusEl) bonusEl.textContent = short;
    const hEl = document.querySelector("#t-hours");
    const mEl = document.querySelector("#t-min");
    const sEl = document.querySelector("#t-sec");
    if (hEl) hEl.textContent = pad(h);
    if (mEl) mEl.textContent = pad(m);
    if (sEl) sEl.textContent = pad(s);
    remaining -= 1000;
  };
  tick();
  setInterval(tick, 1000);
}

// ── SCROLL REVEAL ────────────────────────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll(
    ".hero-bullets li, .lesson-card, .bonus-item, .reason-card, " +
    ".compare-card, .cta-box, .guarantee-inner, .faq-item, " +
    ".amplify-grid, .authority-inner, .section-headline, .chart-wrap"
  );
  els.forEach((el) => {
    el.classList.add("reveal");
    const siblings = Array.from(el.parentElement?.querySelectorAll(":scope > .reveal") ?? []);
    el.style.transitionDelay = `${siblings.indexOf(el) * 0.06}s`;
  });
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    }),
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
  );
  els.forEach((el) => io.observe(el));
}

// ── COUNTER ANIMATION ────────────────────────────────────────
function animateCount(el, target, dur = 1600) {
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - (1 - p) ** 2;
    el.textContent = Math.round(target * eased).toLocaleString("pt-BR");
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        animateCount(e.target, parseInt(e.target.dataset.counter ?? "0", 10));
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.5 }
  );
  document.querySelectorAll("[data-counter]").forEach((el) => io.observe(el));
}

// ── FAQ ──────────────────────────────────────────────────────
function initFAQ() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        document.querySelectorAll(".faq-item").forEach((o) => { if (o !== item) o.open = false; });
      }
    });
  });
}

// ── PROGRESS BAR ─────────────────────────────────────────────
function initProgress() {
  const bar = document.getElementById("pbar");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? `${(window.scrollY / h) * 100}%` : "0%";
  }, { passive: true });
}

// ── SMOOTH SCROLL ────────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// ── VIDEO ────────────────────────────────────────────────────
function initVideo() {
  const thumb = document.querySelector(".video-thumb");
  if (!thumb) return;
  // ← COLOQUE A URL DO SEU VÍDEO AQUI
  const videoUrl = ""; // ex: "https://vturb.com.br/v/XXXXXX"
  thumb.addEventListener("click", () => {
    if (!videoUrl) {
      const note = document.createElement("p");
      note.style.cssText = "position:absolute;bottom:56px;left:50%;transform:translateX(-50%);" +
        "background:rgba(0,0,0,.85);color:#fff;padding:7px 18px;" +
        "border-radius:100px;font-size:13px;white-space:nowrap;z-index:10;";
      note.textContent = "⚙️ Configure videoUrl em main.js";
      thumb.appendChild(note);
      setTimeout(() => note.remove(), 3000);
      return;
    }
    window.open(videoUrl, "_blank");
  });
}


// ── CTA PULSE ────────────────────────────────────────────────
function initPulse() {
  const btn = document.querySelector("#main-cta-btn");
  if (!btn) return;
  setInterval(() => {
    btn.style.boxShadow = "0 8px 40px rgba(160,240,80,.55)";
    setTimeout(() => { btn.style.boxShadow = "0 4px 24px rgba(160,240,80,.25)"; }, 600);
  }, 3200);
}

// ── BOOT ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initDates();
  initCheckout();
  initCountdown();
  initScrollReveal();
  initCounters();
  initFAQ();
  initProgress();
  initSmoothScroll();
  initVideo();
  initPulse();
});
