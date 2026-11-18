(() => {
  const stats = document.querySelector('.park-stats');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!stats || reducedMotion.matches || !('IntersectionObserver' in window)) return;

  const counters = Array.from(stats.querySelectorAll('[data-count-up]'), element => ({
    element,
    target: Number(element.textContent)
  }));
  const duration = 1500;

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || entry.intersectionRatio < 0.25) return;
    observer.disconnect();
    if (reducedMotion.matches) return;

    for (const { element } of counters) element.textContent = '0';

    let startTime;
    function update(time) {
      startTime ??= time;
      const progress = reducedMotion.matches ? 1 : Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 2;

      for (const { element, target } of counters) {
        element.textContent = String(Math.floor(target * easedProgress));
      }

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }, { threshold: 0.25 });

  observer.observe(stats);
})();
