const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  async function run(blockStore, failId) {
    const p = await b.newPage({ viewport: { width: 390, height: 800 } }); const errs = [];
    p.on('pageerror', e => errs.push(String(e))); p.on('dialog', d => d.accept());
    if (blockStore) await p.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }); });
    await p.goto('file://' + process.argv[2]);
    const r = await p.evaluate((failId) => {
      const $ = id => document.getElementById(id), T = window.cpTest, out = { cnt: [], leak: 0, ids: [] };
      document.querySelector('#dmode button[data-m="t"]').click();
      out.idle = $('tinfo').textContent; $('tgo').click();
      for (let i = 0; i < 10; i++) {
        out.cnt.push($('tcnt').textContent);
        if ($('plh').textContent || $('df').textContent) out.leak++;
        const d = T.DR, q = d.q, k = d.m; out.ids.push(k);
        const wrong = failId !== null && k === failId;
        if (q.k === 'choice') { d.ch = wrong ? q.opts.find(o => o !== q.ans) : q.ans; } else if (q.tol) { d.tap = wrong ? [0.2, 0.2] : q.ans.slice(); } else $('da').value = wrong ? (q.ans + 9) % 360 : q.ans;
        $('dck').click();
      }
      out.res = $('tres').textContent.slice(0, 120); out.prs = [...document.querySelectorAll('#tres .pr')].map(x => x.dataset.p);
      try{out.save = localStorage.getItem('cpTest');}catch(e){out.save='blocked';}
      const pr = document.querySelector('#tres .pr'); if (pr) { pr.click(); out.after = [T.DR.m, $('qbox').style.display, $('tres').style.display]; }
      return out;
    }, failId);
    console.log(blockStore ? 'BLOCKED' : 'normal', JSON.stringify(r), 'errs', JSON.stringify(errs)); await p.close();
  }
  await run(false, 5);   // fail resection
  await run(false, null); // perfect
  await run(true, 5);
  await b.close();
})();
