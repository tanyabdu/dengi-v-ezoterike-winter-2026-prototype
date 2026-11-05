const heroCurtain = document.querySelector('[data-hero-curtain]');

if (heroCurtain) {
  const removeCurtain = () => heroCurtain.remove();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canAnimate = typeof Element.prototype.animate === 'function';

  if (reduceMotion || !canAnimate) {
    removeCurtain();
  } else {
    heroCurtain.hidden = false;
    const leftPanel = heroCurtain.querySelector('.hero-curtain-intro__panel--left');
    const rightPanel = heroCurtain.querySelector('.hero-curtain-intro__panel--right');
    const timing = { duration: 1450, delay: 180, easing: 'cubic-bezier(.62,.02,.2,1)', fill: 'forwards' };

    const animations = [
      leftPanel.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-101%)' }], timing),
      rightPanel.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(101%)' }], timing),
    ];

    Promise.allSettled(animations.map((animation) => animation.finished)).then(removeCurtain);
    window.setTimeout(removeCurtain, 2100);
  }
}

const tabButtons = document.querySelectorAll('[data-day]');
const dayPanels = document.querySelectorAll('.day-panel');

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const day = button.dataset.day;

    tabButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });

    dayPanels.forEach((panel) => {
      const active = panel.id === `day-${day}`;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((node) => revealObserver.observe(node));

const paymentDialog = document.querySelector('#payment-dialog');
const closeDialog = () => paymentDialog?.close();

document.querySelectorAll('.payment-button').forEach((button) => {
  button.addEventListener('click', () => paymentDialog?.showModal());
});

document.querySelector('.payment-dialog__close')?.addEventListener('click', closeDialog);
document.querySelector('[data-close-dialog]')?.addEventListener('click', closeDialog);
paymentDialog?.addEventListener('click', (event) => {
  if (event.target === paymentDialog) closeDialog();
});
