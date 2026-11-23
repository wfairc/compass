const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 390, height: 800 } }); const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + process.argv[2]);
  const r = await p.evaluate(() => [...document.querySelectorAll('.pr')].map(b => { b.click(); const T = window.cpTest; return [b.dataset.p, T.DR.m, document.getElementById('drl').open, document.querySelectorAll('#drm .on,#drp .on,#drg .on').length]; }));
  console.log(JSON.stringify(r), 'errs', JSON.stringify(errs)); await b.close();
})();
