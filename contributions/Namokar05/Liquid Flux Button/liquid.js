const btn = document.getElementById('liquidBtn');

// Magnetic hover
btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.03)`;
});

btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
});

// Ripple explosion
btn.addEventListener("click", (e) => {
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
});
