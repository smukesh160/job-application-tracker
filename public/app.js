const form = document.querySelector('#application-form');
const list = document.querySelector('#application-list');
const filter = document.querySelector('#filter');
const message = document.querySelector('#form-message');
const stages = ['applied', 'screening', 'interview', 'offer', 'rejected'];
let applications = [];

async function loadApplications() {
  const response = await fetch('/applications');
  applications = await response.json();
  render();
}

function render() {
  const visible = filter.value === 'all' ? applications : applications.filter(item => item.stage === filter.value);
  list.innerHTML = visible.length ? visible.map(item => `<article class="application"><div><div class="company">${escapeHtml(item.company)}</div><div class="role">${escapeHtml(item.role)}</div><div class="date">Applied ${item.appliedOn}</div></div><span class="badge ${item.stage}">${item.stage}</span></article>`).join('') : '<div class="empty"><strong>No applications here yet</strong>Add your next opportunity using the form.</div>';
  document.querySelector('#total-count').textContent = applications.length;
  document.querySelector('#active-count').textContent = applications.filter(item => ['applied','screening','interview'].includes(item.stage)).length;
  document.querySelector('#interview-count').textContent = applications.filter(item => item.stage === 'interview').length;
  document.querySelector('#offer-count').textContent = applications.filter(item => item.stage === 'offer').length;
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const response = await fetch('/applications', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) });
  if (!response.ok) { message.textContent = 'Please enter a company and role.'; return; }
  form.reset(); message.textContent = 'Application added to your pipeline.'; await loadApplications();
});
filter.addEventListener('change', render);
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char])); }
loadApplications().catch(() => { list.innerHTML = '<div class="empty">Could not load applications. Is the API running?</div>'; });
