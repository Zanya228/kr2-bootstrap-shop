(() => {
  const form = document.getElementById('attraction-filters');
  if (!form) return;

  const age = form.elements.namedItem('age');
  const height = form.elements.namedItem('height');
  const category = form.elements.namedItem('cat');
  const attractions = Array.from(document.querySelectorAll('[data-attraction]'));
  const summary = document.getElementById('filter-summary');
  const empty = document.getElementById('filter-empty');

  function updateResults() {
    let visibleCount = 0;

    for (const attraction of attractions) {
      const { minAge, minHeight, maxHeight, category: attractionCategory } = attraction.dataset;
      const matchesAge = age.value === 'all' || Number(age.value) >= Number(minAge);
      const matchesHeight = height.value === 'all' || (
        Number(height.value) >= Number(minHeight) &&
        (!maxHeight || Number(height.value) <= Number(maxHeight))
      );
      const matchesCategory = category.value === 'all' || category.value === attractionCategory;
      const visible = matchesAge && matchesHeight && matchesCategory;

      attraction.classList.toggle('d-none', !visible);
      if (visible) visibleCount += 1;
    }

    summary.textContent = `Показано ${visibleCount} из ${attractions.length} аттракционов`;
    empty.classList.toggle('d-none', visibleCount > 0);
  }

  form.addEventListener('change', updateResults);
  form.addEventListener('submit', event => {
    event.preventDefault();
    updateResults();
  });
  form.addEventListener('reset', () => {
    queueMicrotask(updateResults);
  });

  updateResults();
})();
