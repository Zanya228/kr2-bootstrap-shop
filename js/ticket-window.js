(() => {
  const embedded = new URLSearchParams(location.search).get('embedded') === '1';

  if (embedded) {
    document.body.classList.add('ticket-window-page');
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !document.querySelector('.modal.show')) {
        parent.postMessage('close-ticket-window', '*');
      }
    }, true);
    return;
  }

  if (!window.HTMLDialogElement || location.pathname.endsWith('/order.html')) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'ticket-window text-body bg-body border-0 rounded-4 shadow p-0';
  dialog.setAttribute('aria-labelledby', 'ticket-window-title');
  dialog.innerHTML = `
    <div class="d-flex align-items-center justify-content-between border-bottom px-3 py-2">
      <h2 class="h5 mb-0" id="ticket-window-title">Билеты</h2>
      <form method="dialog">
        <button type="submit" class="btn-close" aria-label="Закрыть" autofocus></button>
      </form>
    </div>
    <iframe class="d-block w-100 border-0" title="Оформление билетов"></iframe>
  `;
  const frame = dialog.querySelector('iframe');
  let opener;
  dialog.addEventListener('close', () => {
    frame.removeAttribute('src');
    opener?.focus({ preventScroll: true });
  });
  window.addEventListener('message', event => {
    if (dialog.open && event.source === frame.contentWindow && event.data === 'close-ticket-window') {
      dialog.close();
    }
  });

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href="order.html"]');
    if (!link || event.defaultPrevented || event.button !== 0 ||
        event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    opener = link;
    const container = link.closest('.modal.show') || document.body;
    if (dialog.parentElement !== container) container.append(dialog);
    frame.src = 'order.html?embedded=1';
    dialog.showModal();
  });
})();
