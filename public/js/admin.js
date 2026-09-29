/* Watches Hub — admin panel (moderation) */
(function () {
  const $ = s => document.querySelector(s);

  function T() { return window.OrgLux; }

  async function checkSession() {
    try {
      const r = await fetch('/api/admin/session');
      const d = await r.json();
      return d.authenticated;
    } catch { return false; }
  }

  function renderLogin(root) {
    const { t, esc } = T();
    root.innerHTML = `
      <section class="section"><div class="auth-card">
        <span class="label">${t('admin.kicker')}</span>
        <h1 style="font-size:34px;margin-top:12px">${t('admin.title')}</h1>
        <form id="adminLoginForm" class="auth-form">
          <label>${t('admin.user')}<input name="username" required autocomplete="username"></label>
          <label>${t('admin.pass')}<input name="password" type="password" required autocomplete="current-password"></label>
          <button class="btn btn-solid" type="submit" style="justify-content:center">${t('admin.signin')}</button>
        </form>
      </div></section>`;
    $('#adminLoginForm').addEventListener('submit', async e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      try {
        const r = await fetch('/api/admin/login', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: fd.get('username'), password: fd.get('password') }),
        });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'Login failed');
        T().toast(t('admin.welcome'));
        renderPanel(root, 'listings');
      } catch (err) { T().toast(err.message, true); }
    });
  }

  const TABS = ['listings', 'users', 'offers', 'reports'];

  async function renderPanel(root, tab) {
    const { t, esc, api, fmtPrice, fmtDate, toast } = T();
    if (!TABS.includes(tab)) tab = 'listings';
    root.innerHTML = `
      <section class="section">
        <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:14px">
          <h1 style="font-size:clamp(28px,4vw,44px)">${t('admin.title')}</h1>
          <button class="btn btn-ghost btn-small" id="adminLogout">${t('auth.signout')}</button>
        </div>
        <nav class="account-tabs" style="margin-top:20px">
          ${TABS.map(tb => `<a href="#/admin/${tb}" class="${tb === tab ? 'active' : ''}">${t('admin.tab.' + tb)}</a>`).join('')}
        </nav>
        <div id="adminBody"></div>
      </section>`;
    $('#adminLogout').addEventListener('click', async () => {
      await fetch('/api/admin/logout', { method: 'POST' });
      toast(t('admin.bye'));
      renderLogin(root);
    });
    const body = $('#adminBody');

    if (tab === 'listings') {
      const rows = await api('/api/admin/listings').catch(() => []);
      if (!rows.length) { body.innerHTML = `<div class="empty-state"><span class="serif">—</span></div>`; return; }
      body.innerHTML = rows.map(l => `
        <div class="offer-card">
          <a href="#/listing/${l.id}"><img src="${esc(((Array.isArray(l.photos) ? l.photos : JSON.parse(l.photos || '[]'))[0]) || '/images/wh-logo.png')}" alt=""></a>
          <div>
            <a href="#/listing/${l.id}"><div class="oc-title">${esc(l.title)}</div></a>
            <div class="oc-meta">${esc(l.seller_name)} · ${esc(l.seller_email)} · ${fmtPrice(l.price, l.currency)} · ${fmtDate(l.created_at)}</div>
            <div style="margin-top:8px"><span class="status-pill status-offer-${l.status === 'active' ? 'accepted' : l.status === 'sold' ? 'withdrawn' : 'rejected'}">${l.status}</span></div>
          </div>
          <div class="offer-side">
            <div class="offer-actions">
              ${l.status !== 'removed'
                ? `<button class="btn btn-danger btn-small" data-remove="${l.id}">${t('admin.remove')}</button>`
                : `<button class="btn btn-ghost btn-small" data-restore="${l.id}">${t('admin.restore')}</button>`}
            </div>
          </div>
        </div>`).join('');
      body.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', async () => {
        if (!confirm(t('admin.confirmRemove'))) return;
        try { await api('/api/admin/listings/' + b.dataset.remove, { method: 'PATCH', body: JSON.stringify({ status: 'removed' }) }); toast(t('admin.removed')); renderPanel(root, 'listings'); } catch (e) { toast(e.message, true); }
      }));
      body.querySelectorAll('[data-restore]').forEach(b => b.addEventListener('click', async () => {
        try { await api('/api/admin/listings/' + b.dataset.restore, { method: 'PATCH', body: JSON.stringify({ status: 'active' }) }); toast(t('admin.restored')); renderPanel(root, 'listings'); } catch (e) { toast(e.message, true); }
      }));
    }

    if (tab === 'users') {
      const rows = await api('/api/admin/users').catch(() => []);
      body.innerHTML = `
        <div class="admin-table-wrap"><table class="admin-table">
          <thead><tr><th>${t('admin.th.name')}</th><th>${t('admin.th.email')}</th><th>${t('admin.th.phone')}</th><th>${t('admin.th.listings')}</th><th>${t('admin.th.joined')}</th></tr></thead>
          <tbody>${rows.map(u => `<tr>
            <td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${esc(u.phone || '—')}</td>
            <td>${u.listing_count}</td><td>${fmtDate(u.created_at)}</td>
          </tr>`).join('')}</tbody>
        </table></div>`;
    }

    if (tab === 'offers') {
      const rows = await api('/api/admin/offers').catch(() => []);
      if (!rows.length) { body.innerHTML = `<div class="empty-state"><span class="serif">—</span></div>`; return; }
      body.innerHTML = `
        <div class="admin-table-wrap"><table class="admin-table">
          <thead><tr><th>${t('admin.th.listing')}</th><th>${t('admin.th.buyer')}</th><th>${t('admin.th.seller')}</th><th>${t('admin.th.amount')}</th><th>${t('admin.th.status')}</th><th>${t('admin.th.date')}</th></tr></thead>
          <tbody>${rows.map(o => `<tr>
            <td><a href="#/listing/${o.listing_id}">${esc(o.listing_title)}</a></td>
            <td>${esc(o.buyer_name)}</td><td>${esc(o.seller_name)}</td>
            <td>${fmtPrice(o.amount, o.currency)}</td>
            <td><span class="status-pill status-offer-${o.status}">${o.status}</span></td>
            <td>${fmtDate(o.created_at)}</td>
          </tr>`).join('')}</tbody>
        </table></div>`;
    }

    if (tab === 'reports') {
      const rows = await api('/api/admin/reports').catch(() => []);
      if (!rows.length) { body.innerHTML = `<div class="empty-state"><span class="serif">—</span></div>`; return; }
      body.innerHTML = `
        <div class="admin-table-wrap"><table class="admin-table">
          <thead><tr><th>${t('admin.th.listing')}</th><th>${t('admin.th.reporter')}</th><th>${t('admin.th.reason')}</th><th>${t('admin.th.status')}</th><th>${t('admin.th.date')}</th><th></th></tr></thead>
          <tbody>${rows.map(r => `<tr>
            <td><a href="#/listing/${r.listing_id}">${esc(r.listing_title)}</a></td>
            <td>${esc(r.reporter_name)}</td>
            <td>${esc(r.reason)}</td>
            <td><span class="status-pill status-offer-${r.listing_status === 'active' ? 'accepted' : 'rejected'}">${r.listing_status}</span></td>
            <td>${fmtDate(r.created_at)}</td>
            <td><button class="btn btn-ghost btn-small" data-dismiss="${r.id}">${t('admin.dismiss')}</button></td>
          </tr>`).join('')}</tbody>
        </table></div>`;
      body.querySelectorAll('[data-dismiss]').forEach(b => b.addEventListener('click', async () => {
        try {
          await api('/api/admin/reports/' + b.dataset.dismiss, { method: 'DELETE' });
          toast(t('admin.dismissed'));
          renderPanel(root, 'reports');
        } catch (e) { toast(e.message, true); }
      }));
    }
  }

  window.Admin = {
    async render(root, parts) {
      const authed = await checkSession();
      if (!authed) { renderLogin(root); return; }
      renderPanel(root, parts[0] || 'listings');
    },
  };
})();
