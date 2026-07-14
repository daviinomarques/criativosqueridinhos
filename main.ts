// ============================================================
// Criativos GS — main.ts
// Handles: UTM passthrough, countdown, dates, scroll reveal,
//          counters, FAQ, sticky CTA, video placeholder
// ============================================================

// ── TYPES ────────────────────────────────────────────────────
interface CheckoutConfig {
  baseUrl: string;
  utmParams: Record<string, string>;
}

interface TimerUnits {
  hours: number;
  minutes: number;
  seconds: number;
}

// ── UTM PASSTHROUGH ──────────────────────────────────────────
const UTM_KEYS: string[] = [
  "utm_source", "utm_medium", "utm_campaign",
  "utm_term",   "utm_content", "utm_id",
  "fbclid",     "gclid",       "src",
  "sck",        "ref",
];

function parseUTMParams(): Record<string, string> {
  const params: Record<string, string> = {};
  const search = new URLSearchParams(window.location.search);
  UTM_KEYS.forEach((key) => {
    const val = search.get(key);
    if (val) params[key] = val;
  });
  return params;
}

function buildCheckoutUrl(base: string, extras: Record<string, string> = {}): string {
  if (!base) return "#";
  const url = new URL(base.startsWith("http") ? base : `https://${base}`);
  const utms = parseUTMParams();
  const merged = { ...utms, ...extras };
  Object.entries(merged).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

// Store config globally so CTAs built later still get it
let _checkoutConfig: CheckoutConfig = { baseUrl: "", utmParams: {} };

function initCheckout(): void {
  // ← PUT YOUR CHECKOUT URL HERE (Hotmart / Kiwify / etc.)
  _checkoutConfig.baseUrl = ""; // e.g. "go.hotmart.com/XXXXXXX"
  _checkoutConfig.utmParams = parseUTMParams();

  const applyToButtons = (): void => {
    document.querySelectorAll<HTMLAnchorElement>("[data-checkout]").forEach((btn) => {
      const url = buildCheckoutUrl(_checkoutConfig.baseUrl);
      if (url !== "#") btn.href = url;
      btn.addEventListener("click", (e) => {
        if (!_checkoutConfig.baseUrl) {
          e.preventDefault();
          console.warn("⚙️  Configure a variável baseUrl em main.ts");
          alert("⚙️  Configure o link de checkout em main.ts (variável baseUrl)");
        }
      });
    });
  };

  applyToButtons();
  // Re-apply after any dynamic DOM changes
  const mo = new MutationObserver(applyToButtons);
  mo.observe(document.body, { childList: true, subtree: true });
}

// ── DATES ────────────────────────────────────────────────────
const PT_MONTHS: string[] = [
  "janeiro","fevereiro","março","abril","maio","junho",
  "julho","agosto","setembro","outubro","novembro","dezembro",
];

function formatDatePT(d: Date): string {
  return `${d.getDate()} de ${PT_MONTHS[d.getMonth()]}`;
}

function initDates(): void {
  const today = new Date();
  const label  = formatDatePT(today);
  document.querySelectorAll<HTMLElement>(".dyn-date").forEach((el) => {
    el.textContent = label;
  });
  const yearEl = document.querySelector<HTMLElement>("#footer-year");
  if (yearEl) yearEl.textContent = String(today.getFullYear());
}

// ── COUNTDOWN ────────────────────────────────────────────────
function getMsUntilMidnight(): number {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 0);
  return Math.max(0, end.getTime() - now.getTime());
}

function msToUnits(ms: number): TimerUnits {
  const total = Math.floor(ms / 1000);
  return {
    hours:   Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function pad(n: number): string { return String(n).padStart(2, "0"); }

function initCountdown(): void {
  let remaining = getMsUntilMidnight();

  const selectors = {
    barText:    "#bar-countdown",
    bonusText:  "#bonus-countdown",
    mainH:      "#t-hours",
    mainM:      "#t-min",
    mainS:      "#t-sec",
  };

  const tick = (): void => {
    if (remaining <= 0) remaining = getMsUntilMidnight();
    const { hours, minutes, seconds } = msToUnits(remaining);
    const short = `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;

    const barEl = document.querySelector<HTMLElement>(selectors.barText);
    if (barEl) barEl.textContent = short;
    const bonusEl = document.querySelector<HTMLElement>(selectors.bonusText);
    if (bonusEl) bonusEl.textContent = short;

    const hEl = document.querySelector<HTMLElement>(selectors.mainH);
    const mEl = document.querySelector<HTMLElement>(selectors.mainM);
    const sEl = document.querySelector<HTMLElement>(selectors.mainS);
    if (hEl) hEl.textContent = pad(hours);
    if (mEl) mEl.textContent = pad(minutes);
    if (sEl) sEl.textContent = pad(seconds);

    remaining -= 1000;
  };

  tick();
  setInterval(tick, 1000);
}

// ── SCROLL REVEAL ────────────────────────────────────────────
function initScrollReveal(): void {
  const els = document.querySelectorAll<HTMLElement>(
    ".hero-bullets li, .lesson-card, .bonus-item, .reason-card, " +
    ".compare-card, .cta-box, .guarantee-inner, .faq-item, " +
    ".amplify-grid, .authority-inner, .section-headline, .chart-wrap"
  );

  els.forEach((el, i) => {
    el.classList.add("reveal");
    const siblings = Array.from(
      el.parentElement?.querySelectorAll<HTMLElement>(":scope > .reveal") ?? []
    );
    el.style.transitionDelay = `${siblings.indexOf(el) * 0.06}s`;
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
  );

  els.forEach((el) => io.observe(el));
}

// ── COUNTER ANIMATION ────────────────────────────────────────
function animateCount(el: HTMLElement, target: number, dur = 1600): void {
  const start = performance.now();
  const step = (now: number): void => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - (1 - p) ** 2;
    el.textContent = Math.round(target * eased).toLocaleString("pt-BR");
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters(): void {
  const els = document.querySelectorAll<HTMLElement>("[data-counter]");
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          animateCount(el, parseInt(el.dataset.counter ?? "0", 10));
          io.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  els.forEach((el) => io.observe(el));
}

// ── FAQ ACCORDION ────────────────────────────────────────────
function initFAQ(): void {
  document.querySelectorAll<HTMLDetailsElement>(".faq-item").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        document
          .querySelectorAll<HTMLDetailsElement>(".faq-item")
          .forEach((other) => { if (other !== item) other.open = false; });
      }
    });
  });
}

// ── PROGRESS BAR ─────────────────────────────────────────────
function initProgress(): void {
  const bar = document.getElementById("pbar");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? `${(window.scrollY / h) * 100}%` : "0%";
  }, { passive: true });
}

// ── SMOOTH SCROLL ────────────────────────────────────────────
function initSmoothScroll(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector<HTMLElement>(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// ── VIDEO PLACEHOLDER ────────────────────────────────────────
function initVideo(): void {
  const thumb = document.querySelector<HTMLElement>(".video-thumb");
  if (!thumb) return;
  // ← PUT YOUR VIDEO URL HERE (Vturb, Pandavideo, YouTube embed, etc.)
  const videoUrl = ""; // e.g. "https://vturb.com.br/v/XXXXXX"

  thumb.addEventListener("click", () => {
    if (!videoUrl) {
      const note = document.createElement("p");
      note.style.cssText =
        "position:absolute;bottom:56px;left:50%;transform:translateX(-50%);" +
        "background:rgba(0,0,0,.85);color:#fff;padding:7px 18px;" +
        "border-radius:100px;font-size:13px;white-space:nowrap;z-index:10;";
      note.textContent = "⚙️ Configure videoUrl em main.ts";
      thumb.appendChild(note);
      setTimeout(() => note.remove(), 3000);
      return;
    }
    window.open(videoUrl, "_blank");
  });
}



// ── CTA PULSE ────────────────────────────────────────────────
function initPulse(): void {
  const btn = document.querySelector<HTMLElement>("#main-cta-btn");
  if (!btn) return;
  setInterval(() => {
    btn.style.boxShadow = "0 8px 40px rgba(160,240,80,.55)";
    setTimeout(() => {
      btn.style.boxShadow = "0 4px 24px rgba(160,240,80,.25)";
    }, 600);
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
