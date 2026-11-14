(() => {
  const get = id => document.getElementById(id);
  const money = value => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
  const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const moscowToday = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Moscow', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const today = new Date(moscowToday + 'T12:00:00');
  let selected = new Date(today);
  let month = new Date(today.getFullYear(), today.getMonth(), 1, 12);
  const tickets = [
    { id: 'standard', title: 'Билет Стандартный', guests: 1, count: 1 },
    { id: 'express', title: 'Экспресс-вход', guests: 1, count: 0 },
    { id: 'family3', title: 'Семейный 3', guests: 3, count: 0 },
    { id: 'family4', title: 'Семейный 4', guests: 4, count: 0 }
  ];
  const standardPrice = date => [3100, 2800, 3000, 3000, 3000, 2800, 3300][date.getDay()];
  const price = ticket => ({ standard: standardPrice(selected), express: 9000, family3: 9400, family4: 11800 })[ticket.id];
  const dateLabel = () => selected.toLocaleDateString('ru-RU') + ' · 12:00 – 22:00';
  const total = () => tickets.reduce((sum, ticket) => sum + price(ticket) * ticket.count, 0);
  const fillList = target => {
    target.replaceChildren();
    tickets.filter(ticket => ticket.count).forEach(ticket => {
      const li = document.createElement('li');
      li.className = 'mb-2';
      li.textContent = `${ticket.title} × ${ticket.count} · ${ticket.guests * ticket.count} гост. — ${money(price(ticket) * ticket.count)}`;
      target.append(li);
    });
    if (!target.children.length) target.textContent = 'Билеты не выбраны';
  };

  function updateSummary() {
    tickets.forEach(ticket => {
      const card = document.querySelector(`[data-ticket="${ticket.id}"]`);
      card.querySelector('[data-price]').textContent = money(price(ticket));
      card.querySelector('[data-count]').textContent = ticket.count;
      card.querySelector('[data-quantity="-1"]').disabled = ticket.count === 0;
      card.querySelector('[data-quantity="1"]').disabled = ticket.count === 10;
      card.classList.toggle('border-primary', ticket.count > 0);
    });
    get('selected-date').textContent = dateLabel();
    get('buyer-visit').textContent = dateLabel();
    fillList(get('selected-tickets'));
    get('booking-total').textContent = money(total());
    get('buyer-total').textContent = money(total());
    const checkout = get('booking-next');
    const isEmpty = total() === 0;
    checkout.disabled = isEmpty;
    checkout.classList.toggle('btn-secondary', isEmpty);
    checkout.classList.toggle('btn-primary', !isEmpty);
    get('booking-hint').classList.toggle('d-none', total() > 0);
  }

  function renderCalendar(focusKey) {
    get('calendar-month').textContent = month.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    get('previous-month').disabled = month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth();
    const days = get('calendar-days');
    days.replaceChildren();
    const offset = (month.getDay() + 6) % 7;
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cells = Math.ceil((offset + count) / 7) * 7;
    for (let i = 0; i < cells; i++) {
      const date = new Date(month.getFullYear(), month.getMonth(), i - offset + 1, 12);
      const key = dateKey(date);
      const currentMonth = date.getMonth() === month.getMonth();
      const past = key < dateKey(today);
      const button = document.createElement('button');
      const amount = standardPrice(date);
      const colors = { 2800: 'bg-primary-subtle', 3000: 'bg-warning-subtle', 3100: 'bg-warning', 3300: 'bg-primary-subtle' };
      button.type = 'button';
      button.className = 'btn ticket-day d-flex flex-column justify-content-between ' + (currentMonth && !past ? colors[amount] : 'bg-light text-body-secondary');
      button.disabled = past || !currentMonth;
      button.dataset.date = key;
      button.setAttribute('aria-pressed', String(key === dateKey(selected)));
      button.setAttribute('aria-label', date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) + ', ' + money(amount));
      if (key === dateKey(selected)) button.classList.add('border-primary', 'border-2', 'text-primary');
      const number = document.createElement('span');
      number.className = 'align-self-end';
      number.textContent = date.getDate();
      button.append(number);
      if (currentMonth && !past) {
        const cost = document.createElement('span');
        cost.className = 'fw-semibold text-nowrap';
        cost.textContent = amount + '₽';
        button.append(cost);
      }
      button.addEventListener('click', () => {
        selected = date;
        renderCalendar(key);
        updateSummary();
      });
      days.append(button);
    }
    if (focusKey) days.querySelector(`[data-date="${focusKey}"]`)?.focus();
  }

  get('previous-month').addEventListener('click', () => {
    month = new Date(month.getFullYear(), month.getMonth() - 1, 1, 12);
    renderCalendar();
  });
  get('next-month').addEventListener('click', () => {
    month = new Date(month.getFullYear(), month.getMonth() + 1, 1, 12);
    renderCalendar();
  });
  document.querySelectorAll('[data-ticket]').forEach(card => {
    card.querySelectorAll('[data-quantity]').forEach(button => button.addEventListener('click', () => {
      const ticket = tickets.find(item => item.id === card.dataset.ticket);
      ticket.count = Math.max(0, Math.min(10, ticket.count + Number(button.dataset.quantity)));
      updateSummary();
    }));
  });
  const showBuyerForm = () => {
    get('buyer-form').classList.remove('d-none');
    get('booking-review').classList.add('d-none');
    get('buyModalLabel').textContent = 'Данные покупателя · шаг 2 из 3';
  };
  get('buyModal').addEventListener('show.bs.modal', showBuyerForm);
  get('buyer-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!get('buyer-form').reportValidity() || !total()) return;
    get('review-date').textContent = dateLabel();
    fillList(get('review-tickets'));
    get('review-name').textContent = get('buyerName').value;
    get('review-email').textContent = get('buyerEmail').value;
    get('review-total').textContent = money(total());
    get('buyer-form').classList.add('d-none');
    get('booking-review').classList.remove('d-none');
    get('buyModalLabel').textContent = 'Проверка заказа · шаг 3 из 3';
    get('booking-review').focus();
  });
  get('edit-buyer').addEventListener('click', () => { showBuyerForm(); get('buyerName').focus(); });
  renderCalendar();
  updateSummary();
})();
