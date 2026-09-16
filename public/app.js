const form = document.querySelector('#application-form');
const list = document.querySelector('#application-list');
const filter = document.querySelector('#filter');
const message = document.querySelector('#form-message');
const matchForm = document.querySelector('#match-form');
const matchResult = document.querySelector('#match-result');
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
matchForm.addEventListener('submit', async event => {
  event.preventDefault();
  matchResult.innerHTML = '<div class="empty">Analyzing against your resume profile...</div>';
  const response = await fetch('/match', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({description:document.querySelector('#job-description').value})});
  const result = await response.json();
  if (!response.ok) { matchResult.innerHTML = `<div class="empty">${escapeHtml(result.error)}</div>`; return; }
  const visaNote = result.flags.sponsorshipMentioned ? 'Sponsorship language found — review eligibility carefully.' : result.flags.cptOrOptMentioned ? 'CPT/OPT-friendly language found.' : 'No CPT/OPT or sponsorship language detected.';
  matchResult.innerHTML = `<div class="match-card"><div class="match-score">${result.score}%<small>resume match</small></div><div><strong>${visaNote}</strong><p>Matched: ${result.matchedSkills.length ? result.matchedSkills.map(escapeHtml).join(' · ') : 'No tracked keywords yet'}</p><p class="muted">Review the full posting before applying. Submission always requires your approval.</p></div></div>`;
});
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char])); }
loadApplications().catch(() => { list.innerHTML = '<div class="empty">Could not load applications. Is the API running?</div>'; });
