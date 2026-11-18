(() => {
  const storageKey = 'park-theme';
  const root = document.documentElement;
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hoverCapability = window.matchMedia('(hover: hover)');
  function updateMotionPreferences() {
    root.classList.toggle('motion-enabled', !motionPreference.matches);
    root.classList.toggle('hover-enabled', hoverCapability.matches);
  }
  updateMotionPreferences();
  motionPreference.addEventListener('change', updateMotionPreferences);
  hoverCapability.addEventListener('change', updateMotionPreferences);
  let theme = 'light';
  let transitionTimer;

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'dark' || saved === 'light') theme = saved;
  } catch {
  }

  function applyTheme(value, animate = false) {
    if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      clearTimeout(transitionTimer);
      root.classList.add('theme-changing');
      transitionTimer = setTimeout(() => root.classList.remove('theme-changing'), 500);
    }
    root.setAttribute('data-bs-theme', value);
    const dark = value === 'dark';
    for (const button of document.querySelectorAll('[data-theme-toggle]')) {
      const label = dark ? 'Включить светлую тему' : 'Включить тёмную тему';
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
      button.setAttribute('aria-pressed', String(dark));
    }
  }

  applyTheme(theme);

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(root.getAttribute('data-bs-theme'));
    for (const button of document.querySelectorAll('[data-theme-toggle]')) {
      button.addEventListener('click', () => {
        const next = root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
        try {
          localStorage.setItem(storageKey, next);
        } catch {
        }
      });
    }
  });

  window.addEventListener('storage', event => {
    if (event.key === storageKey) applyTheme(event.newValue === 'dark' ? 'dark' : 'light', true);
  });
})();
