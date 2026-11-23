const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  for (const blocked of [false, true]) {
    const p = await b.newPage({ viewport: { width: 390, height: 800 } }); const errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    if (blocked) await p.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }); });
    await p.goto('file://' + process.argv[2]);
    const r = await p.evaluate((blocked) => {
      const $ = id => document.getElementById(id), T = window.cpTest, o = {}, vis = () => ['dial', 'hd', 'demov'].map(i => $(i).style.visibility).join(',');
      const go = id => document.querySelector('.pr[data-p="' + id + '"]').click();
      // SHOOT
      go('shoot'); let q = T.DR.q; o.s0 = [$('dq').textContent.slice(0, 22), vis(), $('dar').style.display];
      $('dck').click(); o.s1 = [$('df').textContent, $('demow').hidden];
      const d = $('demo'); d.value = (q.t + 4) % 360; d.dispatchEvent(new Event('input'));
      $('dck').click(); o.s2 = [$('dq').textContent.slice(0, 40), vis(), $('dar').style.display];
      $('da').value = q.ans; $('dck').click(); o.s3 = $('df').textContent;
      go('shoot'); q = T.DR.q; d.value = (q.t + 40) % 360; d.dispatchEvent(new Event('input')); $('dck').click(); $('da').value = q.ans; $('dck').click(); o.s4 = $('df').textContent;
      go('shoot'); o.hid = vis(); $('dnx').click(); o.restored = vis();
      go('shoot'); document.querySelector('#dmode button[data-m="t"]').click(); o.modeRestore = vis();
      document.querySelector('#dmode button[data-m="d"]').click();
      // PACE
      go('pace'); o.p0 = $('dq').textContent.slice(0, 20); $('da').value = 20; $('dck').click(); o.p1 = $('df').textContent;
      $('da').value = 62; $('dck').click(); o.p2 = $('df').textContent; $('dnx').click(); q = T.DR.q; o.p3 = [$('dq').textContent, q.ans, $('prcp').style.display];
      $('da').value = q.ans; $('dck').click(); o.p4 = $('df').textContent.slice(0, 120);
      $('da').value = q.ans + 40; $('dck').click(); o.p5 = $('df').textContent.slice(0, 30);
      $('da').value = Math.round(q.ans * 1.04); $('dck').click(); o.p6 = $('df').textContent.slice(0, 8);
      $('prc').click(); o.p7 = $('dq').textContent.slice(0, 20);
      // test mode excludes sensors
      document.querySelector('#dmode button[data-m="t"]').click(); $('tgo').click(); const ids = [];
      for (let i = 0; i < 10; i++) { ids.push(T.DR.m); const q2 = T.DR.q; if (q2.k === 'choice') T.DR.ch = q2.ans; else if (q2.tol) T.DR.tap = q2.ans.slice(); else $('da').value = q2.ans; $('dck').click(); }
      o.noSensorInTest = !ids.some(m => m === 2 || m === 10 || m === 11);
      return o;
    }, blocked);
    console.log(blocked ? 'BLOCKED' : 'normal', JSON.stringify(r, null, 0), 'errs', JSON.stringify(errs)); await p.close();
  }
  await b.close();
})();
