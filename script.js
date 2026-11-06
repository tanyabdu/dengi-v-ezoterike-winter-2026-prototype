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

document.querySelectorAll('[data-payment-gate]').forEach((gate) => {
  const checks = [...gate.querySelectorAll('[data-required-consent]')];
  const button = gate.querySelector('.payment-button');
  const widget = gate.querySelector('[data-payment-widget]');

  const updateButton = () => {
    button.disabled = !checks.every((check) => check.checked);
  };

  checks.forEach((check) => check.addEventListener('change', updateButton));
  updateButton();

  button.addEventListener('click', () => {
    if (button.disabled || gate.classList.contains('is-open')) return;

    const scriptId = gate.dataset.scriptId;
    const widgetId = gate.dataset.widgetId;
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://katiklimova.ru/pl/lite/widget/script?id=${widgetId}`;
    script.async = true;
    script.addEventListener('load', () => {
      document.dispatchEvent(new CustomEvent(`StartWidget${scriptId}`));
    }, { once: true });
    script.addEventListener('error', () => {
      widget.innerHTML = '<p class="payment-error">Форма оплаты не загрузилась. Обновите страницу или напишите <a href="https://t.me/klimona" target="_blank" rel="noopener">Кате в Telegram</a>.</p>';
    }, { once: true });

    gate.classList.add('is-open');
    document.body.classList.add('payment-is-open');
    widget.appendChild(script);
  });
});
