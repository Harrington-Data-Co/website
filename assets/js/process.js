(function () {
  // --- Interactive "how the work runs" rail --------------------------------
  // The server-rendered markup already shows stage 1 (see index.html), so a
  // visitor without JS still gets the full first stage. This just adds the
  // click-to-jump behavior and keeps the fill bar / detail panel in sync.

  var STAGES = [
    { num: '01', stage: 'Conversation', duration: '45 minutes', summary: "A call with the people who'd use the work. We ask how you work now, where the hours go, and what you've already tried.", output: "We decide whether working together is a good fit." },
    { num: '02', stage: 'A scoped proposal', duration: 'Within a week', summary: "We write up what we'd do, what it costs and how long it takes. Just as importantly, you understand the level of effort required of your team to make the work happen.", output: 'A clear proposal outlining your costs and the commitment we need from your team.' },
    { num: '03', stage: 'Audit or assessment', duration: 'A few weeks', summary: 'We sit with your team and go through the processes, the reports, and your systems. We write up our findings in accessible language.', output: 'The opportunities in front of you and a roadmap for how to address them.' },
    { num: '04', stage: 'Implementation', duration: 'Fit to the project', summary: 'Staged development of the solution that your team needs. You get a clear picture of the work during check-ins along the way.', output: 'Agents, Knowledge Bases, Pipelines, Analysis - whatever we agreed to.' },
    { num: '05', stage: 'Support', duration: 'Monthly', summary: 'We build ongoing relationships with our partners to help with education, maintenance, or additional build out.', output: 'Tools and services that work for you everyday, without fail.' },
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
  var contactCta = document.getElementById('rail-contact-cta');
  var mobileDot = document.getElementById('rail-mobile-dot');
  var mobileStep = document.getElementById('rail-mobile-step');
  var mobilePrev = document.getElementById('rail-prev');
  var mobileNext = document.getElementById('rail-mobile-next');
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
      contactCta.hidden = true;
    } else {
      nextBtn.hidden = true;
      contactCta.hidden = false;
    }

    mobileDot.textContent = s.num;
    mobileStep.textContent = 'Step ' + (active + 1) + ' of ' + STAGES.length;
    mobilePrev.disabled = active === 0;
    mobileNext.disabled = active === last;
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

  mobilePrev.addEventListener('click', function () {
    if (active > 0) {
      active -= 1;
      render();
    }
  });

  mobileNext.addEventListener('click', function () {
    if (active < last) {
      active += 1;
      render();
    }
  });

  render();
})();
