// ========= CONFIG =========
const CONFIG = {
  eventISO: "2026-03-14T14:00:00-06:00",
  spotifyPlaylistUrl:
    "https://open.spotify.com/playlist/0i4nlkxE1yRr9fGDA435zM?si=747b5286136740fc&pt=3eb22443ac44328ae8fe1ce19bd4f1de",
  pinterestUrl: "https://pin.it/38kwrDr4e",
  rsvpFormUrl: "https://example.com" // luego me das el link real
};

// Helper seguro: si no existe el ID, no rompe
const $ = (id) => document.getElementById(id);
const setHrefIfExists = (id, url) => {
  const el = $(id);
  if (el) el.href = url;
};

// ========= LINKS (solo si existen en tu HTML) =========
setHrefIfExists("spotifyTop", CONFIG.spotifyPlaylistUrl);
setHrefIfExists("rsvpTop", CONFIG.rsvpFormUrl);
setHrefIfExists("spotifyBtn", CONFIG.spotifyPlaylistUrl);
setHrefIfExists("pinterestBtn", CONFIG.pinterestUrl);
setHrefIfExists("rsvpBtn", CONFIG.rsvpFormUrl);

// Waze/Maps (solo si existen)
const placeQuery = encodeURIComponent("Campo Verde CAES camino a Pavón");
setHrefIfExists("wazeBtn", `https://waze.com/ul?q=${placeQuery}&navigate=yes`);
setHrefIfExists("mapsBtn", `https://www.google.com/maps/search/?api=1&query=${placeQuery}`);

// ========= OVERLAY APLAUSOS =========
const overlay = $("applauseOverlay");
const enterBtn = $("enterBtn");
const applauseAudio = $("applauseAudio");

if (enterBtn) {
  enterBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (applauseAudio) {
        applauseAudio.volume = 0.9;
        await applauseAudio.play();
      }
    } catch (err) {
      console.warn("No se pudo reproducir aplausos:", err);
    }

    // OCULTAR OVERLAY SI EXISTE
    if (overlay) overlay.style.display = "none";

    // SCROLL SUAVE AL INICIO DEL CONTENIDO (si existe)
    const first = document.getElementById("scene1") || document.querySelector("header") || document.body;
    first.scrollIntoView({ behavior: "smooth" });
  });
}

// ========= SOBRE + INTRO + REVEAL =========
const openBtn = $("openEnvelopeBtn");
const flap = $("flap");
const letter = $("letter");
const introAudio = $("introAudio");
const revealOverlay = $("revealOverlay");
const revealContinueBtn = $("revealContinueBtn");

let envelopeOpened = false;

if (openBtn) {
  openBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (envelopeOpened) return;
    envelopeOpened = true;

    if (flap) flap.style.transform = "rotateX(160deg)";
    if (letter) {
      letter.style.transform = "translateY(0px)";
      letter.style.opacity = "1";
    }

    let played = false;
    try {
      if (introAudio) {
        introAudio.currentTime = 0;
        introAudio.volume = 0.95;
        await introAudio.play();
        played = true;
      }
    } catch (err) {
      console.warn("No se pudo reproducir intro:", err);
    }

    const showReveal = () => {
      if (revealOverlay) revealOverlay.classList.remove("hidden");
    };

    if (played && introAudio) {
      const fallbackMs = 10500;
      const timer = setTimeout(showReveal, fallbackMs);
      introAudio.onended = () => {
        clearTimeout(timer);
        showReveal();
      };
    } else {
      setTimeout(showReveal, 600);
    }
  });
}

if (revealContinueBtn) {
  revealContinueBtn.addEventListener("click", () => {
    if (revealOverlay) revealOverlay.classList.add("hidden");
    const s2 = document.getElementById("scene2");
    if (s2) s2.scrollIntoView({ behavior: "smooth" });
  });
}

// ========= COUNTDOWN (solo si existen los IDs) =========
const target = new Date(CONFIG.eventISO).getTime();

function tick() {
  const now = Date.now();
  let diff = target - now;
  if (diff < 0) diff = 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const d = String(days).padStart(2, "0");
  const h = String(hours).padStart(2, "0");
  const m = String(minutes).padStart(2, "0");

  if ($("cdDaysInline")) $("cdDaysInline").innerText = d;
  if ($("cdDays")) $("cdDays").innerText = d;
  if ($("cdHours")) $("cdHours").innerText = h;
  if ($("cdMinutes")) $("cdMinutes").innerText = m;
}

tick();
setInterval(tick, 1000);

tick();
setInterval(tick, 1000);
