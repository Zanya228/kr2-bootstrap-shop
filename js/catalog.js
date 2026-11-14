(() => {
  const form = document.getElementById('attraction-filters');
  const cards = [...document.querySelectorAll('[data-attraction]')];
  const summary = document.getElementById('filter-summary');
  const empty = document.getElementById('filter-empty');

  function applyFilters() {
    const values = new FormData(form);
    const age = values.get('age');
    const height = values.get('height');
    const category = values.get('cat');
    let count = 0;

    cards.forEach(card => {
      const matches = (age === 'all' || Number(age) >= Number(card.dataset.minAge))
        && (height === 'all' || Number(height) >= Number(card.dataset.minHeight))
        && (category === 'all' || category === card.dataset.category);
      card.classList.toggle('d-none', !matches);
      if (matches) count++;
    });

    summary.textContent = `Показано ${count} из ${cards.length} аттракционов`;
    empty.classList.toggle('d-none', count !== 0);
  }

  form.addEventListener('change', applyFilters);
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('reset', () => setTimeout(applyFilters, 0));
  applyFilters();
})();
