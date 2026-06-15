const main = document.getElementById("main");
const portfolio = document.getElementById("portfolio");
const resume = document.getElementById("resume");

const toPortfolio = document.getElementById("toPortfolio");
const toResume = document.getElementById("toResume");
const backBtns = document.querySelectorAll(".back");

const matrix = document.querySelector(".matrix");
const theatre = document.querySelector(".theatre");
const cinema = document.getElementById("cinema");

/* ================= MATRIX ================= */
const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&@*+-<>";
const columns = Math.floor(window.innerWidth / 18);

function rand() {
  return chars[Math.floor(Math.random() * chars.length)];
}

const drops = [];

for (let i = 0; i < columns; i++) {
  const el = document.createElement("div");

  el.style.position = "absolute";
  el.style.left = i * 18 + "px";
  el.style.top = "0";

  el.style.color = "#39ff14";
  el.style.fontFamily = "monospace";
  el.style.fontSize = "18px";
  el.style.whiteSpace = "pre";

  el.style.textShadow = "0 0 12px #39ff14";

  // базовый “киношный” blur
  el.style.filter = "blur(0.6px)";
  el.style.opacity = "0.9";

  matrix.appendChild(el);

  drops.push({
    el,
    y: Math.random() * -1000,
    speed: 2 + Math.random() * 6,
    len: 10 + Math.floor(Math.random() * 20)
  });
}

/* ===== animation ===== */
function animate() {
  drops.forEach(d => {
    let text = "";

    for (let i = 0; i < d.len; i++) {
      text += rand() + "\n";
    }

    d.el.innerText = text;

    d.y += d.speed;

    // движение
    d.el.style.transform = `translateY(${d.y}px)`;

    // 🔥 живой blur (как в кино)
    const blur = 0.3 + Math.abs(Math.sin(d.y * 0.01)) * 1.2;
    d.el.style.filter = `blur(${blur}px)`;

    if (d.y > window.innerHeight + 500) {
      d.y = -1000;
      d.speed = 2 + Math.random() * 6;
    }
  });

  requestAnimationFrame(animate);
}

animate();

/* ================= MOUSE EFFECT ================= */
document.addEventListener("mousemove", (e) => {
  const x = e.clientX / window.innerWidth;

  matrix.style.filter = `
    brightness(${0.6 + x * 1.8})
    contrast(${1 + x * 0.5})
    saturate(${1 + x})
  `;

  theatre.style.filter = `
    brightness(${1 + (1 - x) * 0.8})
    saturate(${1 + (1 - x)})
    contrast(${1 + (1 - x) * 0.4})
  `;
});

/* ================= ROUTER ================= */
function goBlack(cb) {
  cinema.classList.add("active");

  setTimeout(() => {
    cb();
    cinema.classList.remove("active");
  }, 500);
}

function show(page) {
  goBlack(() => {
    main.style.display = "none";
    portfolio.classList.remove("active");
    resume.classList.remove("active");

    page.classList.add("active");

    history.pushState({ page: page.id }, "", `#${page.id}`);
  });
}

function showMain() {
  goBlack(() => {
    main.style.display = "flex";
    portfolio.classList.remove("active");
    resume.classList.remove("active");

    history.pushState({ page: "main" }, "", "#");
  });
}

/* buttons */
toPortfolio.onclick = () => show(portfolio);
toResume.onclick = () => show(resume);

backBtns.forEach(b => b.onclick = showMain);

/* browser back/forward */
window.addEventListener("popstate", (e) => {
  const state = e.state?.page;

  if (!state || state === "main") {
    showMain();
    return;
  }

  if (state === "portfolio") show(portfolio);
  if (state === "resume") show(resume);
});

/* init */
if (location.hash === "#portfolio") show(portfolio);
else if (location.hash === "#resume") show(resume);