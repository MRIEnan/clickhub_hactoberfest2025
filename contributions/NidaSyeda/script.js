const btn = document.getElementById('glowButton');
btn.addEventListener('click', () => {
  btn.innerText = "Clicked!";
  setTimeout(() => btn.innerText = "Click Me!", 1500);
});
