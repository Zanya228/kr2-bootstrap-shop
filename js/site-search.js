(() => {
  const forms = [...document.querySelectorAll('[data-header-search]')];
  if (!forms.length) return;

  const popup = document.createElement('div');
  popup.className = 'site-search-window position-fixed overflow-y-auto text-body bg-body border rounded-4 shadow p-0';
  popup.id = 'site-search-popup';
  popup.hidden = true;
  popup.setAttribute('role', 'region');
  popup.setAttribute('aria-labelledby', 'site-search-title');
  popup.innerHTML = `
    <div class="d-flex align-items-center justify-content-between gap-3 px-3 py-2 border-bottom">
      <h2 class="h6 mb-0" id="site-search-title">Результаты поиска</h2>
      <button type="button" class="btn-close" data-search-close aria-label="Закрыть поиск"></button>
    </div>
    <p class="small text-body-secondary px-3 my-2" role="status" aria-live="polite" aria-atomic="true"></p>
    <div id="site-search-results" class="list-group list-group-flush overflow-y-auto"></div>
  `;
  document.body.append(popup);

  const status = popup.querySelector('[role="status"]');
  const results = popup.querySelector('#site-search-results');
  const normalize = value => value.toLocaleLowerCase('ru').replace(/ё/g, 'е');
  const pages = (window.siteSearchPages || []).map(page => ({
    ...page,
    normalizedTitle: normalize(page.title),
    normalizedText: normalize(page.text)
  }));
  let activeInput;

  function positionPopup() {
    if (popup.hidden || !activeInput) return;
    const anchor = activeInput.closest('form').getBoundingClientRect();
    const top = Math.max(8, Math.min(anchor.bottom + 32, window.innerHeight - 160));
    const left = Math.max(16, Math.min(anchor.left,
      window.innerWidth - popup.offsetWidth - 16));
    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
    popup.style.maxHeight = `${Math.max(0, window.innerHeight - top - 16)}px`;
  }

  function closePopup(restoreFocus = false) {
    popup.hidden = true;
    for (const form of forms) {
      form.querySelector('input').setAttribute('aria-expanded', 'false');
      form.querySelector('[data-site-search]').setAttribute('aria-expanded', 'false');
    }
    if (restoreFocus) activeInput?.focus();
  }

  function search(input) {
    activeInput = input;
    results.replaceChildren();
    const query = normalize(input.value.trim());
    if (!query) {
      closePopup();
      return;
    }
    const words = query.split(/\s+/);
    const matches = pages.filter(page => words.every(word =>
      page.normalizedTitle.includes(word) || page.normalizedText.includes(word)
    ));
    const score = page => words.filter(word => page.normalizedTitle.includes(word)).length;
    matches.sort((a, b) => score(b) - score(a));
    status.textContent = matches.length
      ? `Найдено страниц: ${matches.length}`
      : 'Ничего не найдено. Попробуйте другой запрос.';

    for (const page of matches) {
      const link = document.createElement('a');
      link.className = 'list-group-item list-group-item-action px-3 py-2';
      link.href = page.url;
      const title = document.createElement('h3');
      title.className = 'h6 text-primary mb-1';
      title.textContent = page.title;
      const snippet = document.createElement('p');
      snippet.className = 'site-search-snippet overflow-hidden small text-body-secondary mb-0';
      const start = Math.max(0, page.normalizedText.indexOf(words[0]) - 60);
      const excerpt = page.text.slice(start, start + 140);
      snippet.textContent = `${start ? '…' : ''}${excerpt}${start + 140 < page.text.length ? '…' : ''}`;
      link.append(title, snippet);
      results.append(link);
    }
    popup.hidden = false;
    for (const form of forms) {
      const expanded = String(form.querySelector('input') === input);
      form.querySelector('input').setAttribute('aria-expanded', expanded);
      form.querySelector('[data-site-search]').setAttribute('aria-expanded', expanded);
    }
    positionPopup();
  }

  for (const form of forms) {
    const input = form.querySelector('input');
    const button = form.querySelector('[data-site-search]');
    input.setAttribute('aria-controls', popup.id);
    input.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', popup.id);
    button.setAttribute('aria-expanded', 'false');
    input.addEventListener('input', () => search(input));
    input.addEventListener('search', () => search(input));
    button.addEventListener('click', () => search(input));
    form.addEventListener('submit', event => {
      event.preventDefault();
      search(input);
      results.querySelector('a')?.focus();
    });
    input.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' && !popup.hidden) {
        event.preventDefault();
        results.querySelector('a')?.focus();
      }
    });
  }

  popup.querySelector('[data-search-close]').addEventListener('click', () => closePopup(true));
  document.addEventListener('click', event => {
    if (!popup.hidden && !popup.contains(event.target) &&
        !event.target.closest('[data-header-search]')) closePopup();
  });
  document.addEventListener('focusin', event => {
    if (!popup.hidden && !popup.contains(event.target) &&
        !event.target.closest('[data-header-search]')) closePopup();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !popup.hidden) {
      event.preventDefault();
      closePopup(true);
    }
  });
  window.addEventListener('resize', positionPopup);
  window.addEventListener('scroll', positionPopup, { passive: true });
})();
