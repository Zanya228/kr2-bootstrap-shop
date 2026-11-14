(() => {
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const subject = `Вопрос о парке: ${values.get('topic')}`;
    const body = `Имя: ${String(values.get('name')).trim()}\nE-mail: ${values.get('email')}\n\n${String(values.get('message')).trim()}`;
    window.location.href = `mailto:info@dreamisland.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.getElementById('contact-status').textContent = 'Письмо подготовлено. Отправьте его в открывшейся почтовой программе. Если она не открылась, напишите на info@dreamisland.ru.';
  });
})();
