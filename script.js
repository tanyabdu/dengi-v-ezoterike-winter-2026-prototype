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

const paymentModal = document.querySelector('[data-payment-modal]');

if (paymentModal) {
  const dialog = paymentModal.querySelector('.payment-modal__dialog');
  const modalTitle = paymentModal.querySelector('[data-payment-modal-title]');
  const widgetSlots = [...paymentModal.querySelectorAll('[data-widget-slot]')];
  let lastPaymentTrigger = null;

  const closePaymentModal = () => {
    paymentModal.classList.remove('is-open');
    document.body.classList.remove('payment-is-open');
    window.setTimeout(() => {
      paymentModal.hidden = true;
      lastPaymentTrigger?.focus();
    }, 180);
  };

  const loadWidget = (slot, widgetId, scriptId) => {
    if (slot.dataset.loaded === 'true') return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://katiklimova.ru/pl/lite/widget/script?id=${widgetId}`;
    script.async = true;
    script.addEventListener('load', () => {
      slot.dataset.loaded = 'true';
      document.dispatchEvent(new CustomEvent(`StartWidget${scriptId}`));
    }, { once: true });
    script.addEventListener('error', () => {
      slot.innerHTML = '<p class="payment-error">Форма заказа не загрузилась. Обновите страницу или воспользуйтесь ссылкой поддержки ниже.</p>';
    }, { once: true });
    slot.appendChild(script);
  };

  document.querySelectorAll('[data-payment-launch]').forEach((button) => {
    button.addEventListener('click', () => {
      const { widgetId, scriptId, paymentTitle } = button.dataset;
      const activeSlot = widgetSlots.find((slot) => slot.dataset.widgetSlot === widgetId);
      if (!activeSlot) return;

      lastPaymentTrigger = button;
      modalTitle.textContent = paymentTitle;
      widgetSlots.forEach((slot) => { slot.hidden = slot !== activeSlot; });
      paymentModal.hidden = false;
      requestAnimationFrame(() => paymentModal.classList.add('is-open'));
      document.body.classList.add('payment-is-open');
      loadWidget(activeSlot, widgetId, scriptId);
      dialog.focus();
    });
  });

  paymentModal.querySelectorAll('[data-payment-close]').forEach((button) => {
    button.addEventListener('click', closePaymentModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !paymentModal.hidden) closePaymentModal();
  });
}
