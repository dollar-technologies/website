const btn = document.querySelector('.menu-btn');
const links = document.getElementById('nav-links');
btn.addEventListener('click', () => btn.setAttribute('aria-expanded', links.classList.toggle('open')));

const form = document.getElementById('contact-form');
if (form) {
  // Pre-select the service / model when arriving from a service or engagement page.
  const q = new URLSearchParams(location.search);
  for (const [param, field] of [['service', 'service'], ['model', 'model']]) {
    const v = q.get(param), sel = form.elements[field];
    if (v && [...sel.options].some((o) => o.text === v)) sel.value = v;
  }

  // Posts to a Formspree-style endpoint when content.mjs sets one; otherwise (or if the post fails) opens the email app.
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = form.querySelector('.form-error');
    const ok = form.querySelector('.form-ok');
    const invalid = [...form.querySelectorAll('[required]')].filter((el) => !el.checkValidity());
    for (const el of form.querySelectorAll('[required]')) {
      if (invalid.includes(el)) { el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', err.id); }
      else { el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); }
    }
    if (invalid.length) { err.textContent = 'Fill in your name, a valid email and a few words about your project.'; err.hidden = false; invalid[0].focus(); return; }
    err.hidden = true;
    const f = new FormData(form);
    if (f.get('_gotcha')) return; // bot filled the hidden field
    const btnSend = form.querySelector('button[type="submit"]');
    if (form.dataset.endpoint) {
      btnSend.disabled = true;
      try {
        const res = await fetch(form.dataset.endpoint, { method: 'POST', body: f, headers: { Accept: 'application/json' } });
        if (res.ok) {
          form.reset();
          ok.textContent = 'Thank you. Your enquiry has reached us and we will reply soon.';
          ok.hidden = false; ok.focus?.();
          return;
        }
      } catch { /* fall through to email */ } finally { btnSend.disabled = false; }
    }
    const to = form.dataset.email;
    if (!to) { err.textContent = 'Our email address is being set up. Please try again soon.'; err.hidden = false; return; }
    const lines = [f.get('message'), '', ...[
      `Name: ${f.get('name')}`, `Email: ${f.get('email')}`,
      f.get('phone') && `Phone: ${f.get('phone')}`, f.get('company') && `Company: ${f.get('company')}`,
      `Service: ${f.get('service')}`, `Budget: ${f.get('budget')}`, `Start: ${f.get('timeline')}`, `Model: ${f.get('model')}`,
      f.get('nda') && 'NDA requested before sharing details',
    ].filter(Boolean)];
    const subject = `Project enquiry: ${f.get('service')} — ${f.get('name')}`;
    location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  });
}
