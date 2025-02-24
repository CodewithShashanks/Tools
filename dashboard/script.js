// GSAP Animations
gsap.from("header", { opacity: 0, y: -50, duration: 1 });
gsap.from(".tool-card", { opacity: 0, y: 50, stagger: 0.2, duration: 1 });

// Tool Navigation
const toolCards = document.querySelectorAll('.tool-card');
toolCards.forEach(card => {
  card.addEventListener('click', () => {
    const tool = card.getAttribute('data-tool');
    window.location.href = `tools/${tool}.html`;
  });
});

