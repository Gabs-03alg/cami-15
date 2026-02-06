// ===== CONFIG (solo falta el link RSVP cuando me lo des) =====
const CONFIG = {
  eventISO: "2026-03-14T14:00:00-06:00",

  spotifyPlaylistUrl:
    "https://open.spotify.com/playlist/0i4nlkxE1yRr9fGDA435zM?si=747b5286136740fc&pt=3eb22443ac44328ae8fe1ce19bd4f1de",
  pinterestUrl: "https://pin.it/38kwrDr4e",

  // PENDIENTE: me pasas el link del Google Form aquí
  rsvpFormUrl: "https://example.com"
};

const $ = (id) => document.getElementById(id);

// ========= LINKS TOP =========
$("spotifyTop").href = CONFIG.spotifyPlaylistUrl;
$("rsvpTop").href = CONFIG.rsvpFormUrl;

// ========= LINKS EN ESCENAS =========
$("spotifyBtn").href = CONFIG.spotifyPlaylistUrl;
$("pinterestBtn").href = CONFIG.pinterestUrl;
$("rsvpBtn").href = CONFIG.rsvpFormUrl;

// ========= WAZE / MAPS =========
const placeQuery = encodeURIComponent("Campo Verde CAES camino a Pavón");
$("wazeBtn").href = `https://waze.com/ul?q=${placeQuery}&navigate=yes`;
$("mapsBtn").href = `https://www.google.com/maps/search/?api=1&query=${placeQuery}`;

// ========= OVERLAY APLAUSOS (ENTRADA) =========
const overlay = $("applauseOverlay");
const enterBtn = $("enterBtn");
const applauseAudio = $("applauseAudio");

enterBtn.addEventListener("click", async () => {
  try {
    applauseAudio.volume = 0.9;
    await applauseAudio.play(); // permitido porque hay click
  } catch (e) {
    console.warn("No se pudo reproducir aplausos:", e);
  }
  overlay.style.display = "none";
});

// ========= SOBRE + INTRO + REVEAL =========
const openBtn = $("openEnvelopeBtn");
const flap = $("flap");
const letter = $("letter");
const introAudio = $("introAudio");
const revealOverlay = $("revealOverlay");
const revealContinueBtn = $("revealContinueBtn");

let envelopeOpened = false;

openBtn.addEventListener("click", async () => {
  if (envelopeOpened) return;
  envelopeOpened = true;

  // 1) animación del sobre
  flap.style.transform = "rotateX(160deg)";
  letter.style.transform = "translateY(0px)";
  letter.style.opacity = "1";

  // 2) reproduce intro.mp3 (tu recorte 0:39–0:49)
  let played = false;
  try {
    introAudio.currentTime = 0;
    introAudio.volume = 0.95;
    await introAudio.play(); // permitido porque fue click
    played = true;
  } catch (e) {
    console.warn("No se pudo reproducir intro.mp3:", e);
  }

  // 3) mostrar reveal al terminar (si no termina, fallback a 10.5s)
  const fallbackMs = 10500;
  const showReveal = () => revealOverlay.classList.remove("hidden");

  if (played) {
    const failSafe = setTimeout(showReveal, fallbackMs);
    introAudio.onended = () => {
      clearTimeout(failSafe);
      showReveal();
    };
  } else {
    // si no sonó, igual mostramos reveal
    setTimeout(showReveal, 600);
  }
});

// botón continuar del reveal
revealContinueBtn.addEventListener("click", () => {
  revealOverlay.classList.add("hidden");
  // opcional: scroll a escena 2
  document.getElementById("scene2").scrollIntoView({ behavior: "smooth" });
});

// ========= COUNTDOWN =========
const target = new Date(CONFIG.eventISO).getTime();

function tick() {
  const now = Date.now();
  let diff = target - now;
  if (diff < 0) diff = 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const d = String(days).padStart(2, "0");
  $("cdDaysInline").innerText = d;
  $("cdDays").innerText = d;
  $("cdHours").innerText = String(hours).padStart(2, "0");
  $("cdMinutes").innerText = String(minutes).padStart(2, "0");
}

tick();
setInterval(tick, 1000);
