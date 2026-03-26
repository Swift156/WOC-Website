// ========== DATA STORE ==========
let members   = JSON.parse(localStorage.getItem('woc_members')   || '[]');
let community = JSON.parse(localStorage.getItem('woc_community') || '[]');

// Portal access codes
const MEMBER_CODE = '12345';
const LEADER_CODE = '23456';

// ========== COOKIE CONSENT ==========
let currentState = 'main';
const cookieConsent = document.getElementById('cookieConsent');
const mainState = document.getElementById('cookieMain');
const privacyState = document.getElementById('cookiePrivacy');
const prefsState = document.getElementById('cookiePrefs');

function showMainState() {
  if (mainState) mainState.style.display = 'flex';
  if (privacyState) privacyState.style.display = 'none';
  if (prefsState) prefsState.style.display = 'none';
  currentState = 'main';
}
function showPrivacyState() {
  if (mainState) mainState.style.display = 'none';
  if (privacyState) privacyState.style.display = 'flex';
  if (prefsState) prefsState.style.display = 'none';
  currentState = 'privacy';
}
function showPrefsState() {
  if (mainState) mainState.style.display = 'none';
  if (privacyState) privacyState.style.display = 'none';
  if (prefsState) prefsState.style.display = 'flex';
  currentState = 'prefs';
}

function acceptAllCookies() {
  const prefs = { essential: true, analytics: true, marketing: true };
  localStorage.setItem('cookie_preferences', JSON.stringify(prefs));
  dismissConsent();
}
function rejectAllCookies() {
  const prefs = { essential: true, analytics: false, marketing: false };
  localStorage.setItem('cookie_preferences', JSON.stringify(prefs));
  dismissConsent();
}
function savePreferences() {
  const analytics = document.getElementById('prefAnalytics')?.checked || false;
  const marketing = document.getElementById('prefMarketing')?.checked || false;
  const prefs = { essential: true, analytics, marketing };
  localStorage.setItem('cookie_preferences', JSON.stringify(prefs));
  dismissConsent();
}
function dismissConsent() {
  if (!cookieConsent) return;
  cookieConsent.classList.remove('visible');
  cookieConsent.classList.add('hiding');
  setTimeout(() => {
    if (cookieConsent.parentNode) cookieConsent.parentNode.removeChild(cookieConsent);
  }, 400);
}
const cookiePref = localStorage.getItem('cookie_preferences');
if (!cookiePref) {
  setTimeout(() => {
    if (cookieConsent) {
      cookieConsent.style.display = 'block';
      cookieConsent.offsetHeight;
      cookieConsent.classList.add('visible');
      showMainState();
    }
  }, 2000);
} else {
  if (cookieConsent) cookieConsent.remove();
}
document.addEventListener('DOMContentLoaded', () => {
  const showPrivacy = document.getElementById('showPrivacyBtn');
  if (showPrivacy) showPrivacy.addEventListener('click', showPrivacyState);
  const showPrefs = document.getElementById('showPrefsBtn');
  if (showPrefs) showPrefs.addEventListener('click', showPrefsState);
});

// ========== NAVIGATION ==========
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  if (window.scrollY > window.innerHeight * 0.75) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});
function toggleNav() {
  const nl   = document.getElementById('navLinks');
  const open = nl.style.display === 'flex';
  nl.style.display = open ? 'none' : 'flex';
  if (!open) {
    Object.assign(nl.style, {
      flexDirection: 'column',
      position: 'absolute',
      top: '62px',
      left: '0',
      right: '0',
      background: 'rgba(0,0,0,0.97)',
      padding: '12px 16px',
      borderBottom: '1px solid rgba(255,255,255,0.08)'
    });
  }
}
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => {
    if (window.innerWidth <= 860) document.getElementById('navLinks').style.display = 'none';
  })
);

// ========== FAQ ACCORDION ==========
function toggleFaq(el) {
  const item    = el.parentElement;
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

// ========== EVENTS TABS ==========
function initEventsTabs() {
  document.querySelectorAll('.events-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      const id = this.getAttribute('data-tab');
      document.querySelectorAll('.events-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.events-content').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      document.getElementById('tab-' + id).classList.add('active');
    });
  });
}

// ========== MEMBERSHIP FORM ==========
function submitMembership() {
  const ids  = ['f-name','f-surname','f-residence','f-marital','f-ministry','f-church'];
  const vals = ids.map(id => document.getElementById(id).value.trim());
  const [name, surname, residence, marital, ministry, church] = vals;

  if (vals.some(v => !v)) { alert('Please complete all fields.'); return; }

  members.push({ name, surname, residence, marital, ministry, church, date: new Date().toLocaleDateString() });
  localStorage.setItem('woc_members', JSON.stringify(members));

  ids.forEach(id => document.getElementById(id).value = '');
  const msg = document.getElementById('successMsg');
  msg.style.display = 'block';
  setTimeout(() => msg.style.display = 'none', 6000);
}

// ========== CONTACT FORM ==========
function submitContact() {
  const name  = document.getElementById('c-name').value.trim();
  const email = document.getElementById('c-email').value.trim();
  const msg   = document.getElementById('c-msg').value.trim();
  if (!name || !email || !msg) { alert('Please fill in all fields.'); return; }
  ['c-name','c-email','c-msg'].forEach(id => document.getElementById(id).value = '');
  alert("Thank you for reaching out — we'll be in touch soon.");
}

// ========== MEMBER PORTAL ==========
function openPortal() {
  document.getElementById('portal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closePortal() {
  document.getElementById('portal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePortal(); });

function portalLogin() {
  const code = document.getElementById('member-code').value;
  if (code === MEMBER_CODE) {
    document.getElementById('adminGate').style.display        = 'none';
    document.getElementById('portal-content').style.display   = 'block';
    document.getElementById('leader-area').style.display      = 'none';
    loadCommunityPosts();
    setupPortalTabs();
  } else if (code === LEADER_CODE) {
    document.getElementById('adminGate').style.display        = 'none';
    document.getElementById('portal-content').style.display   = 'block';
    document.getElementById('leader-area').style.display      = 'block';
    loadMembersTable();
    loadAllCommunityPosts();
    setupPortalTabs();
  } else {
    const err = document.getElementById('portalError');
    err.style.display = 'block';
    setTimeout(() => err.style.display = 'none', 3000);
  }
}

function loadCommunityPosts() {
  const testimonyDiv = document.getElementById('testimony-list');
  const prayerDiv     = document.getElementById('prayer-list');
  const enquiryDiv    = document.getElementById('enquiry-list');
  [testimonyDiv, prayerDiv, enquiryDiv].forEach(el => el.innerHTML = '');
  community.forEach(post => {
    const html = `<div class="community-post"><strong>${escapeHtml(post.name)}</strong><p>${escapeHtml(post.body)}</p><small>${post.date}</small></div>`;
    if (post.type === 'testimony') testimonyDiv.innerHTML += html;
    else if (post.type === 'prayer') prayerDiv.innerHTML += html;
    else if (post.type === 'enquiry') enquiryDiv.innerHTML += html;
  });
}

function loadAllCommunityPosts() {
  const container = document.getElementById('all-posts');
  container.innerHTML = community.length === 0 ? '<p style="color:var(--muted); font-style:italic;">No posts yet.</p>' : community.map(post => `<div class="community-post"><strong>[${post.type.toUpperCase()}] ${escapeHtml(post.name)}</strong><p>${escapeHtml(post.body)}</p><small>${post.date}</small></div>`).join('');
}

function loadMembersTable() {
  document.getElementById('memberCount').textContent = members.length;
  const tbody = document.getElementById('membersBody');
  if (members.length === 0) {
    tbody.innerHTML = '\\n      <td colspan="6" style="color:var(--muted);padding:24px;text-align:center;font-style:italic;">No members yet. \\n    ';
  } else {
    tbody.innerHTML = members.map(m => `
      <tr>
        <td>${escapeHtml(m.name)}</td
        <td>${escapeHtml(m.surname)}</td
        <td>${escapeHtml(m.residence)}</td
        <td>${escapeHtml(m.marital)}</td
        <td>${escapeHtml(m.ministry)}</td
        <td>${escapeHtml(m.church)}</td
      </tr>
    `).join('');
  }
}

function submitCommunity(type) {
  const nameMap = { testimony:'t-name', prayer:'p-name', enquiry:'e-name' };
  const bodyMap = { testimony:'t-body', prayer:'p-body', enquiry:'e-body' };
  const name = document.getElementById(nameMap[type])?.value.trim() || 'Anonymous';
  const body = document.getElementById(bodyMap[type])?.value.trim();
  if (!body) { alert('Please write something.'); return; }
  community.push({ type, name, body, email: type === 'enquiry' ? document.getElementById('e-email').value : '', date: new Date().toLocaleString() });
  localStorage.setItem('woc_community', JSON.stringify(community));
  document.getElementById(nameMap[type]).value = '';
  document.getElementById(bodyMap[type]).value = '';
  if (type === 'enquiry') document.getElementById('e-email').value = '';
  alert({ testimony:'Thank you — glory to God!', prayer:'Received. We stand with you.', enquiry:'Received. A leader will be in touch.' }[type]);
  if (document.getElementById('leader-area').style.display === 'block') loadAllCommunityPosts();
  else loadCommunityPosts();
}

function setupPortalTabs() {
  document.querySelectorAll('#portalTabs .c-tab').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-tab');
      document.querySelectorAll('#portal-content .c-panel').forEach(p => p.classList.remove('on'));
      document.getElementById('tab-' + id).classList.add('on');
      document.querySelectorAll('#portalTabs .c-tab').forEach(b => b.classList.remove('on'));
      this.classList.add('on');
    });
  });
}

// ========== STAT COUNTER ANIMATION (modern stat bar) ==========
function animateStats() {
  const statElements = document.querySelectorAll('.stat-num-modern[data-target]');
  statElements.forEach(el => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    let current = 0;
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    let count = 0;
    const timer = setInterval(() => {
      count += increment;
      if (count >= target) {
        clearInterval(timer);
        el.innerText = target;
      } else {
        el.innerText = Math.floor(count);
      }
    }, stepTime);
  });
}

const statBarModern = document.querySelector('.stat-bar-modern');
if (statBarModern && !window.statsAnimated) {
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !window.statsAnimated) {
        window.statsAnimated = true;
        animateStats();
        statObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  statObserver.observe(statBarModern);
}

// ========== SCROLL REVEAL ==========
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) setTimeout(() => e.target.classList.add('in'), +e.target.dataset.d || 0); });
}, { threshold: 0.1 });
document.querySelectorAll('.act-row').forEach((el, i) => { el.dataset.d = i * 90; revealObserver.observe(el); });
document.querySelectorAll('.p-cell').forEach((el, i) => { el.dataset.d = i * 50; revealObserver.observe(el); });
document.querySelectorAll('.l-card').forEach((el, i) => { el.dataset.d = i * 110; revealObserver.observe(el); });

// ========== UTILITY ==========
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  initEventsTabs();
});