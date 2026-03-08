
/* ─── LOADER ─────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hide');
    launchConfetti();
    spawnFloatingElements();
  }, 2200);
});

/* ─── CONFETTI ───────────────────────────────────────── */
const canvas  = document.getElementById('confetti-canvas');
const ctx     = canvas.getContext('2d');
let pieces    = [];
let animFrame = null;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const COLORS = ['#f5c6cb','#e8d08a','#d5c9e8','#fde5cc','#c9a84c','#e8909a','#c96070'];
const SHAPES = ['circle','rect','heart'];

function randomRange(a, b) { return a + Math.random() * (b - a); }

function createPiece() {
  return {
    x:      randomRange(0, canvas.width),
    y:      randomRange(-20, -80),
    size:   randomRange(6, 14),
    color:  COLORS[Math.floor(Math.random() * COLORS.length)],
    shape:  SHAPES[Math.floor(Math.random() * SHAPES.length)],
    speedY: randomRange(2.5, 5),
    speedX: randomRange(-1.5, 1.5),
    rot:    randomRange(0, Math.PI * 2),
    rotSpd: randomRange(-.05, .05),
    alpha:  1,
  };
}

function drawHeart(cx, cy, r) {
  ctx.beginPath();
  ctx.moveTo(cx, cy + r * .3);
  ctx.bezierCurveTo(cx, cy - r * .4, cx - r * 1.1, cy - r * .4, cx - r * 1.1, cy + r * .2);
  ctx.bezierCurveTo(cx - r * 1.1, cy + r * .8, cx, cy + r * 1.2, cx, cy + r * 1.5);
  ctx.bezierCurveTo(cx, cy + r * 1.2, cx + r * 1.1, cy + r * .8, cx + r * 1.1, cy + r * .2);
  ctx.bezierCurveTo(cx + r * 1.1, cy - r * .4, cx, cy - r * .4, cx, cy + r * .3);
  ctx.fill();
}

function drawPiece(p) {
  ctx.save();
  ctx.globalAlpha = p.alpha;
  ctx.fillStyle   = p.color;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  if (p.shape === 'circle') {
    ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill();
  } else if (p.shape === 'rect') {
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
  } else {
    drawHeart(0, -p.size / 2, p.size / 3);
  }
  ctx.restore();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach((p, i) => {
    p.y    += p.speedY;
    p.x    += p.speedX;
    p.rot  += p.rotSpd;
    if (p.y > canvas.height + 20) p.alpha -= .015;
    drawPiece(p);
    if (p.alpha <= 0) pieces.splice(i, 1);
  });
  if (pieces.length > 0) animFrame = requestAnimationFrame(animateConfetti);
  else { cancelAnimationFrame(animFrame); ctx.clearRect(0, 0, canvas.width, canvas.height); }
}

function launchConfetti() {
  pieces = [];
  for (let i = 0; i < 180; i++) pieces.push(createPiece());
  cancelAnimationFrame(animFrame);
  animateConfetti();
}

function triggerCelebration() {
  launchConfetti();
}

/* ─── FLOATING ELEMENTS ─────────────────────────────── */
function spawnFloatingElements() {
  const emojis = ['🌸','✨','💛','🌹','🦋','💖','🌺','⭐','💫'];
  const count  = 14;
  for (let i = 0; i < count; i++) {
    const el   = document.createElement('div');
    el.classList.add('float-el');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.cssText = `
      left: ${Math.random() * 100}vw;
      bottom: -60px;
      font-size: ${10 + Math.random() * 16}px;
      animation-duration: ${8 + Math.random() * 12}s;
      animation-delay: ${Math.random() * 8}s;
    `;
    document.body.appendChild(el);
  }
}

/* ─── SCROLL REVEAL ─────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }});
}, { threshold: .12 });
revealEls.forEach(el => io.observe(el));

/* ─── MUSIC PLAYER ──────────────────────────────────── */
const musicBtn = document.getElementById('musicBtn');
const bgMusic  = document.getElementById('bgMusic');
let   playing  = false;

musicBtn.addEventListener('click', () => {
  if (playing) {
    bgMusic.pause();
    musicBtn.textContent = '🎵';
    musicBtn.classList.remove('playing');
  } else {
    bgMusic.volume = 0.3;
    bgMusic.play().catch(() => {});
    musicBtn.textContent = '🎶';
    musicBtn.classList.add('playing');
  }
  playing = !playing;
});

/* ─── SMOOTH SCROLL for hero CTA ───────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});