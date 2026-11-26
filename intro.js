const destination = document.querySelector(".hero-banner .brand-mark");
const hero = document.querySelector(".hero-banner picture img");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

const pause = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

async function playIntro() {
  const overlay = document.createElement("div");
  overlay.className = "site-intro";
  overlay.setAttribute("aria-hidden", "true");
  const mark = destination.cloneNode();
  mark.className = "intro-mark";
  overlay.append(mark);
  overlay.insertAdjacentHTML("beforeend", '<div class="intro-track"><span class="intro-bar"></span></div>');
  document.body.append(overlay);
  const bar = overlay.querySelector(".intro-bar");
  let flight;

  try {
    const loading = bar.animate([{transform:"scaleX(0)"}, {transform:"scaleX(.88)"}],
      {duration:900, easing:"ease-out", fill:"forwards"});
    await Promise.all([
      pause(400),
      Promise.race([hero.decode().catch(() => {}), pause(900)])
    ]);

    const scale = getComputedStyle(bar).transform;
    loading.cancel();
    await bar.animate([{transform:scale}, {transform:"scaleX(1)"}],
      {duration:180, fill:"forwards"}).finished;

    const start = mark.getBoundingClientRect();
    const end = destination.getBoundingClientRect();
    if (reducedMotion.matches || end.top < 0 || end.bottom > innerHeight) return;

    flight = mark.cloneNode();
    flight.className = "intro-flight";
    Object.assign(flight.style, {
      left: `${start.left}px`, top: `${start.top}px`,
      width: `${start.width}px`, height: `${start.height}px`
    });
    document.body.append(flight);
    mark.style.visibility = "hidden";
    destination.classList.add("is-docking");

    const slide = flight.animate([
      {transform:"translate(0, 0) scale(1)"},
      {transform:`translate(${end.left - start.left}px, ${end.top - start.top}px) scale(${end.width / start.width})`}
    ], {duration:600, easing:"cubic-bezier(.32,.72,.25,1)", fill:"forwards"});
    await Promise.all([
      slide.finished,
      overlay.animate([{opacity:1}, {opacity:0}], {duration:380, fill:"forwards"}).finished
    ]);
  } finally {
    destination.classList.remove("is-docking");
    overlay.remove();
    flight?.remove();
  }
}

if (destination && hero && !location.hash && !reducedMotion.matches && typeof destination.animate === "function") {
  playIntro().catch(() => {});
}
