/* Stardust Bloom Button behavior
   - 3D tilt following pointer
   - ripple effect on click
   - particle burst on click
   - toggles aria-pressed
   - accessible: keyboard activation supported (Space/Enter)
*/

const btn = document.getElementById('stardust-btn');
const rippleLayer = btn.querySelector('.ripple-layer');

let pointerInside = false;

// Utility: create element with class
function make(tag, cls){ const el = document.createElement(tag); if (cls) el.className = cls; return el; }

// Pointer move => subtle tilt
btn.addEventListener('pointermove', (e) => {
  const rect = btn.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width;  // 0..1
  const py = (e.clientY - rect.top) / rect.height;
  const tiltY = (px - 0.5) * 12;  // degrees
  const tiltX = -(py - 0.5) * 8;
  btn.style.setProperty('--tiltX', tiltX.toFixed(2) + 'deg');
  btn.style.setProperty('--tiltY', tiltY.toFixed(2) + 'deg');
  pointerInside = true;
});

// Reset tilt when leaving
btn.addEventListener('pointerleave', () => {
  btn.style.setProperty('--tiltX', '0deg');
  btn.style.setProperty('--tiltY', '0deg');
  pointerInside = false;
});

// Create a ripple centered at (x,y) relative to button
function createRipple(x, y){
  const r = make('span','ripple');
  r.style.left = x + 'px';
  r.style.top = y + 'px';
  // gradient color picks
  r.style.background = `radial-gradient(circle at 30% 30%, rgba(122,252,255,0.92), rgba(155,123,255,0.64) 40%, rgba(255,123,176,0.18) 70%)`;
  rippleLayer.appendChild(r);
  // cleanup after animation
  r.addEventListener('animationend', () => r.remove());
}

// Particle burst
function burstParticles(x,y){
  const colors = ['#7afcff','#9b7bff','#ff7bb0'];
  const count = 18;
  const rect = btn.getBoundingClientRect();

  for(let i=0;i<count;i++){
    const p = make('span','particle');
    const size = (Math.random()*6)+4;
    p.style.width = p.style.height = size + 'px';
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    const col = colors[Math.floor(Math.random()*colors.length)];
    p.style.background = col;
    rippleLayer.appendChild(p);

    // random trajectory
    const angle = Math.random()*Math.PI*2;
    const distance = 30 + Math.random()*80;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - (Math.random()*20);

    // animate with requestAnimationFrame
    const duration = 450 + Math.random()*420;
    const start = performance.now();

    // initial style
    p.style.opacity = '1';
    p.style.transform = 'translate(0px,0px) scale(0.6)';

    function frame(t){
      const tnorm = Math.min(1, (t - start) / duration);
      // ease out cubic
      const e = 1 - Math.pow(1 - tnorm, 3);
      p.style.transform = `translate(${dx*e}px, ${dy*e}px) scale(${0.6 + 0.4*e})`;
      p.style.opacity = String(1 - e);
      if(tnorm < 1) requestAnimationFrame(frame);
      else p.remove();
    }
    requestAnimationFrame(frame);
  }
}

// Activation function (called on click or keyboard)
function activateAt(clientX, clientY){
  const rect = btn.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  createRipple(x,y);
  burstParticles(x,y);

  // toggle pressed
  const pressed = btn.getAttribute('aria-pressed') === 'true';
  btn.setAttribute('aria-pressed', String(!pressed));

  // tiny tactile feedback on supporting devices
  if (navigator.vibrate) navigator.vibrate(20);
}

// Mouse / touch click
btn.addEventListener('pointerdown', (ev) => {
  // only primary button
  if (ev.button !== 0) return;
  // prevent focusing by pointer to keep keyboard focus behavior consistent
  ev.preventDefault();
  activateAt(ev.clientX, ev.clientY);
});

// Keyboard activation (space/enter)
btn.addEventListener('keydown', (ev) => {
  if (ev.key === 'Enter' || ev.key === ' ') {
    ev.preventDefault();
    // center activation for keyboard
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    activateAt(cx, cy);
  }
});

// Clean up: remove any stray elements periodically (safety)
setInterval(() => {
  const nodes = rippleLayer.querySelectorAll('.ripple, .particle');
  if (nodes.length > 40) {
    nodes.forEach(n => n.remove());
  }
}, 2500);

