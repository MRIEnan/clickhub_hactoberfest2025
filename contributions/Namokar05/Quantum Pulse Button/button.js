const btn = document.getElementById('uniqueBtn');

const onMove = (e) => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const tiltX = Math.max(Math.min((-dy / rect.height) * 6, 6), -6);
    const tiltY = Math.max(Math.min((dx / rect.width) * 12, 12), -12);
    btn.style.setProperty('--tiltX', tiltX + 'deg');
    btn.style.setProperty('--tiltY', tiltY + 'deg');
};

const onLeave = () => {
    btn.style.setProperty('--tiltX', '0deg');
    btn.style.setProperty('--tiltY', '0deg');
};

btn.addEventListener('pointerenter', () => {
    document.addEventListener('pointermove', onMove);
});

btn.addEventListener('pointerleave', () => {
    document.removeEventListener('pointermove', onMove);
    onLeave();
});

const createRipple = (x, y) => {
    const circle = document.createElement('span');
    circle.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    circle.style.left = (x - rect.left) + 'px';
    circle.style.top = (y - rect.top) + 'px';
    const maxDim = Math.max(rect.width, rect.height) * 1.2;
    circle.style.width = circle.style.height = maxDim + 'px';
    btn.appendChild(circle);
    circle.addEventListener('animationend', () => circle.remove(), { once: true });
};

btn.addEventListener('pointerdown', (ev) => {
    if (ev.button !== 0 && ev.pointerType === 'mouse') return;
    createRipple(ev.clientX, ev.clientY);
});

const performAction = async () => {
    if (btn.classList.contains('success')) return;
    btn.setAttribute('aria-busy', 'true');
    btn.style.pointerEvents = 'none';
    await new Promise(r => setTimeout(r, 650));
    btn.classList.add('success');
    btn.removeAttribute('aria-busy');
    setTimeout(() => {
        btn.classList.remove('success');
        btn.style.pointerEvents = '';
    }, 1400);
};

btn.addEventListener('click', () => performAction());

btn.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
        if (e.key === ' ') e.preventDefault();
        const rect = btn.getBoundingClientRect();
        createRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
        performAction();
    }
});

btn.setAttribute('role', 'button');
btn.setAttribute('tabindex', '0');

window.addEventListener('pagehide', () => {
    document.removeEventListener('pointermove', onMove);
});
