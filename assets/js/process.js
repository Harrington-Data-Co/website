(function () {
  // --- Interactive "how the work runs" rail --------------------------------
  // The server-rendered markup already shows stage 1 (see index.html), so a
  // visitor without JS still gets the full first stage. This just adds the
  // click-to-jump behavior and keeps the fill bar / detail panel in sync.

  var STAGES = [
    { num: '01', stage: 'Conversation', duration: '45 minutes', summary: "A call with the people who'd use the work. We ask how you work now, where the hours go, and what you've already tried.", output: "You'll know whether we can help. Sometimes the answer is no." },
    { num: '02', stage: 'A scoped proposal', duration: 'Within a week', summary: "We write up what we'd do, what it costs and how long it takes. Nothing starts until you say yes.", output: 'A proposal in writing, thoughtful about your needs.' },
    { num: '03', stage: 'Audit or assessment', duration: 'A few weeks', summary: 'We sit with your team and go through the systems, the reports and the workarounds. We write up what we found, in language you can forward to anyone.', output: 'A written report that strategically tells you what\'s next.' },
    { num: '04', stage: 'The work itself', duration: 'Scoped upfront', summary: 'Fixed cost, fixed dates, agreed before we start. You see it as it lands rather than in one reveal at the end.', output: 'Pipelines and reports built, sessions run, or systems handed over.' },
    { num: '05', stage: 'Support', duration: 'Monthly', summary: 'Shifting from an initial build to a long-term relationship. Upkeep, refresher sessions, and changes as the business changes.', output: 'Upkeep, refreshers, and whatever comes next.' },
  ];

  var rail = document.getElementById('rail');
  if (!rail) return;

  var buttons = Array.prototype.slice.call(rail.querySelectorAll('.rail-stage'));
  var fill = document.getElementById('rail-fill');
  var numEl = document.getElementById('rail-stage-num');
  var titleEl = document.getElementById('rail-stage-title');
  var summaryEl = document.getElementById('rail-stage-summary');
  var outputEl = document.getElementById('rail-stage-output');
  var nextBtn = document.getElementById('rail-next');
  var active = 0;
  var last = STAGES.length - 1;

  function render() {
    buttons.forEach(function (btn, i) {
      btn.classList.toggle('is-active', i === active);
      btn.classList.toggle('is-done', i < active);
      btn.setAttribute('aria-pressed', i === active ? 'true' : 'false');
    });
    fill.style.width = (active / last) * 100 + '%';

    var s = STAGES[active];
    numEl.textContent = 'Stage ' + s.num + ' — ' + s.duration;
    titleEl.textContent = s.stage;
    summaryEl.textContent = s.summary;
    outputEl.textContent = s.output;

    if (active < last) {
      nextBtn.hidden = false;
      nextBtn.textContent = 'Next: ' + STAGES[active + 1].stage + ' →';
    } else {
      nextBtn.hidden = true;
    }
  }

  buttons.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
      active = i;
      render();
    });
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (active < last) {
        active += 1;
        render();
      }
    });
  }

  render();
})();
