const { chromium } = require('playwright');
(async () => {
  const file = process.argv[2];
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  // normal
  let p = await b.newPage({ viewport: { width: 390, height: 800 } }); const errs = [];
  p.on('pageerror', e => errs.push(String(e))); p.on('dialog', d => d.accept());
  await p.goto('file://' + file);
  const r = await p.evaluate(() => {
    const $ = id => document.getElementById(id), T = window.cpTest, out = {};
    document.querySelector('#drm button[data-d="0"]').click();
    for (let i = 0; i < 3; i++) { $('da').value = T.DR.q.ans; $('dck').click(); $('dnx').click(); }
    $('da').value = (T.DR.q.ans + 5) % 360; $('dck').click();
    out.text = $('dsc').textContent; out.prog = localStorage.getItem('cpProg');
    localStorage.setItem('cpTest', '{"best":1}');
    $('drr').click(); out.after = [localStorage.getItem('cpProg'), localStorage.getItem('cpTest'), $('dsc').textContent];
    return out;
  });
  console.log(JSON.stringify(r)); await p.close();
  // blocked storage
  p = await b.newPage(); const e2 = []; p.on('pageerror', e => e2.push(String(e))); p.on('dialog', d => d.accept());
  await p.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }); });
  await p.goto('file://' + file);
  await p.evaluate(() => { const $ = id => document.getElementById(id); $('da').value = window.cpTest.DR.q.ans; $('dck').click(); $('drr').click(); });
  console.log('blocked errs', JSON.stringify(e2), 'normal errs', JSON.stringify(errs)); await b.close();
})();
