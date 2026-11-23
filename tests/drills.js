// usage: node drills.js <index.html> [out.json]  -- seeded snapshot of every drill + sanity checks
const { chromium } = require('playwright');
(async () => {
  const file = process.argv[2], out = process.argv[3];
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 390, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.addInitScript(() => { let s = 12345; Math.random = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; });
  await p.goto('file://' + file);
  const snap = await p.evaluate(() => {
    const $ = id => document.getElementById(id), R = [], T = window.cpTest;
    const clickCheck = () => $('dck').click();
    const tapBtns = [...document.querySelectorAll('#drm button,#drp button,#drg button')];
    const state = () => ({ q: $('dq').textContent, h: $('plh').textContent, f: $('df').textContent, c: $('df').style.color, s: $('dsc').textContent, svg: $('pls').innerHTML, vb: $('pls').getAttribute('viewBox'), arHid: $('dar').style.display, plwHid: $('plw').hidden, on: tapBtns.map(x => x.classList.contains('on')).join('') });
    for (const m of [0, 1, 3, 2, 4, 5, 6, 7, 8, 9]) {
      const btn = tapBtns.find(x => +x.dataset.d === m);
      for (let round = 0; round < (m >= 8 ? 40 : 6); round++) {
        if (round === 0) btn.click(); else $('dnx').click();
        const rec = { m, round, a: state() };
        const q = T.DR.q, wrong = round % 2 === 1;
        if (m === 2) { clickCheck(); rec.pre = state(); const d = $('demo'); d.value = wrong ? (q.ans + 90) % 360 : q.ans; d.dispatchEvent(new Event('input')); clickCheck(); }
        else if (q.k === 'choice') { if (round % 5 === 2) { clickCheck(); rec.nochoice = state(); } T.DR.ch = wrong ? q.opts.find(o => o !== q.ans) : q.ans; clickCheck(); }
        else if (m >= 4) { if (round === 2) { clickCheck(); rec.notap = state(); } T.DR.tap = wrong ? [0.2, 0.2] : q.ans.slice(); clickCheck(); }
        else { if (round === 2) { clickCheck(); rec.nonum = state(); } $('da').value = wrong ? (q.ans + 7) % 360 : q.ans; clickCheck(); }
        rec.b = state(); R.push(rec);
      }
    }
    return R;
  });
  const bad = snap.filter(r => r.round % 2 === 0 && !/^Right/.test(r.b.f)).length;
  const wrongNoMiss = snap.filter(r => r.round % 2 === 1 && /^Right/.test(r.b.f)).length;
  const nan = snap.filter(r => /NaN|undefined/.test(r.a.q + r.b.f + r.b.svg)).length;
  const sw = await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  console.log('records', snap.length, 'rightFail', bad, 'wrongShowedRight', wrongNoMiss, 'nan/undef', nan, 'noHScroll', sw, 'errs', JSON.stringify(errs));
  if (out) require('fs').writeFileSync(out, JSON.stringify(snap, null, 1));
  await b.close();
})();
