(() => {
  if (new URLSearchParams(location.search).get('embedded') === '1') return;

  const widget = document.createElement('aside');
  widget.className = 'support-chat position-fixed bottom-0 start-0 m-3 z-3';
  widget.setAttribute('aria-label', 'Чат с поддержкой');
  widget.innerHTML = `
    <div class="collapse mb-3" id="support-chat-panel">
      <section class="card border-0 shadow rounded-4 overflow-hidden" aria-labelledby="support-chat-title">
        <div class="card-header bg-primary text-white d-flex align-items-center justify-content-between gap-3 p-3">
          <h2 class="h6 fw-bold mb-0" id="support-chat-title"><span aria-hidden="true">💬</span> Поддержка парка</h2>
          <button type="button" class="btn-close btn-close-white" data-bs-toggle="collapse" data-bs-target="#support-chat-panel" aria-label="Закрыть чат"></button>
        </div>
        <div class="card-body bg-body-tertiary p-3">
          <div class="bg-body border rounded-3 p-3 mb-4">
            <p class="small mb-0">Здравствуйте! Здесь вы сможете задать вопрос о парке, аттракционах и билетах.</p>
          </div>
        </div>
        <div class="card-footer bg-body p-3">
          <label class="visually-hidden" for="support-chat-message">Ваше сообщение</label>
          <textarea class="form-control mb-2" id="support-chat-message" rows="2" maxlength="1000" placeholder="Напишите сообщение…"></textarea>
          <button type="button" class="btn btn-secondary w-100" disabled>Отправить</button>
        </div>
      </section>
    </div>
    <button type="button" class="btn btn-primary rounded-circle shadow p-3 d-inline-flex align-items-center justify-content-center" id="support-chat-toggle" aria-label="Чат с поддержкой" title="Чат с поддержкой" data-bs-toggle="collapse" data-bs-target="#support-chat-panel" aria-expanded="false" aria-controls="support-chat-panel">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/><path d="M8 11h8M8 15h5"/></svg>
    </button>
  `;
  document.body.append(widget);

  const panel = widget.querySelector('#support-chat-panel');
  const toggle = widget.querySelector('#support-chat-toggle');
  panel.addEventListener('shown.bs.collapse', () => widget.querySelector('textarea').focus());
  panel.addEventListener('hidden.bs.collapse', () => toggle.focus({ preventScroll: true }));
  widget.addEventListener('keydown', event => {
    if (event.key === 'Escape' && panel.classList.contains('show')) {
      bootstrap.Collapse.getOrCreateInstance(panel).hide();
    }
  });
})();
