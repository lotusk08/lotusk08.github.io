const r180 = Math.PI;
const r90 = Math.PI / 2;
const r15 = Math.PI / 12;
const color = '#88888825';
const { random } = Math;
const MIN_BRANCH = 30;

let canvas, ctx, size, len = 6, stopped = false;
let steps = [], prevSteps = [];
let animationId = null;

function getWindowSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

function initCanvas(canvas, width = 400, height = 400, _dpi) {
  const context = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const bsr = context.webkitBackingStorePixelRatio ||
              context.mozBackingStorePixelRatio ||
              context.msBackingStorePixelRatio ||
              context.oBackingStorePixelRatio ||
              context.backingStorePixelRatio || 1;
  const dpi = _dpi || dpr / bsr;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = dpi * width;
  canvas.height = dpi * height;
  context.scale(dpi, dpi);

  return { ctx: context, dpi };
}

function polar2cart(x = 0, y = 0, r = 0, theta = 0) {
  const dx = r * Math.cos(theta);
  const dy = r * Math.sin(theta);
  return [x + dx, y + dy];
}

function step(x, y, rad, counter = { value: 0 }) {
  const length = random() * len;
  counter.value += 1;

  const [nx, ny] = polar2cart(x, y, length, rad);

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(nx, ny);
  ctx.stroke();

  const rad1 = rad + random() * r15;
  const rad2 = rad - random() * r15;

  if (nx < -100 || nx > size.width + 100 || ny < -100 || ny > size.height + 100)
    return;

  const rate = counter.value <= MIN_BRANCH ? 0.8 : 0.5;

  if (random() < rate)
    steps.push(() => step(nx, ny, rad1, counter));

  if (random() < rate)
    steps.push(() => step(nx, ny, rad2, counter));
}

let lastTime = performance.now();
const interval = 1000 / 40;
let isRunning = false;

function frame() {
  if (!isRunning) return;

  animationId = requestAnimationFrame(frame);

  if (performance.now() - lastTime < interval) {
    return;
  }

  prevSteps = steps;
  steps = [];
  lastTime = performance.now();

  if (!prevSteps.length) {
    isRunning = false;
    stopped = true;
    cancelAnimationFrame(animationId);
    return;
  }

  prevSteps.forEach((stepFn) => {

    if (random() < 0.5)
      steps.push(stepFn);
    else
      stepFn();
  });
}

function randomMiddle() {
  return random() * 0.6 + 0.2;
}

function startAnimation() {
  if (isRunning) {
    cancelAnimationFrame(animationId);
    isRunning = false;
  }

  if (!ctx) return;

  ctx.clearRect(0, 0, size.width, size.height);
  ctx.lineWidth = 1;
  ctx.strokeStyle = color;

  prevSteps = [];
  steps = [
    () => step(randomMiddle() * size.width, -5, r90),
    () => step(randomMiddle() * size.width, size.height + 5, -r90),
    () => step(-5, randomMiddle() * size.height, 0),
    () => step(size.width + 5, randomMiddle() * size.height, r180),
  ];

  if (size.width < 500)
    steps = steps.slice(0, 2);

  isRunning = true;
  stopped = false;
  animationId = requestAnimationFrame(frame);
}

function handleResize() {
  size = getWindowSize();
  const result = initCanvas(canvas, size.width, size.height);
  ctx = result.ctx;
  if (!stopped) {
    startAnimation();
  }
}

function init() {
  canvas = document.getElementById('plum-canvas');
  if (!canvas) return;

  size = getWindowSize();
  const result = initCanvas(canvas, size.width, size.height);
  ctx = result.ctx;

  window.addEventListener('resize', handleResize);

  startAnimation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.plumRestart = startAnimation;
