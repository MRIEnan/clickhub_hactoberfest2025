document.addEventListener("DOMContentLoaded", () => {
  const cyberBtn = document.querySelector(".cyber-btn");

  cyberBtn.addEventListener("click", (e) => {
    const wave = document.createElement("div");
    wave.classList.add("surge-wave");

    const rect = cyberBtn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    wave.style.width = wave.style.height = `${size}px`;
    wave.style.left = `${x}px`;
    wave.style.top = `${y}px`;

    cyberBtn.appendChild(wave);
    setTimeout(() => wave.remove(), 900);

    console.log("🚀 Cyber Flip Surge Button activated!");
  });
});
