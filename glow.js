// Subtle entrance animations + soft glow helpers

document.addEventListener('DOMContentLoaded', () => {
  // Fade-in on scroll for service cards
  const cards = document.querySelectorAll('.service-card');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });
  }

  // Soft logo pulse on load
  const logoMark = document.querySelector('.logo-mark');
  if (logoMark && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setTimeout(() => {
      logoMark.style.boxShadow = '0 0 20px rgba(201, 162, 39, 0.4)';
      setTimeout(() => {
        logoMark.style.boxShadow = '';
      }, 1200);
    }, 600);
  }
});