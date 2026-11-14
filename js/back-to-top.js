(() => {
  const button = document.getElementById('back-to-top');
  if (!button) return;
  const updateVisibility = () => {
    button.classList.toggle('d-none', window.scrollY < 400);
  };
  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('pageshow', updateVisibility);
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    });
    const heading = document.querySelector('main h1, main h2');
    if (heading) {
      const hadTabindex = heading.hasAttribute('tabindex');
      if (!hadTabindex) heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
      if (!hadTabindex) heading.addEventListener('blur', () => heading.removeAttribute('tabindex'), { once: true });
    }
  });
  updateVisibility();
})();
