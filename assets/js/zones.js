(function () {
  // --- "Everything runs off the same numbers" flow diagram ------------------
  // Three clickable zones (sources / hub / outcomes); the server-rendered
  // markup already shows the middle zone active for a visitor without JS.

  var ZONES = [
    { title: 'Wherever your numbers live', body: 'Everyone’s list looks different — four systems or forty, a warehouse or a folder of spreadsheets, your own records or public data you buy in. The examples here are just examples. We start by reading what you already run, whatever that is, rather than telling you to replace it.' },
    { title: 'Numbers everyone agrees on', body: 'We join those systems up and write down what each number actually means — what counts as a customer, when revenue lands, which date wins when two disagree. That written-down version becomes the thing every report and every AI tool reads from.' },
    { title: 'What you end up with', body: 'Reporting people stop arguing with, and AI that answers from your own numbers instead of guessing. Both sitting on the same source, so they can’t drift apart.' },
  ];

  var row = document.getElementById('flow-row');
  if (!row) return;

  var buttons = Array.prototype.slice.call(row.querySelectorAll('.flow-btn'));
  var stageEl = document.getElementById('flow-stage');
  var titleEl = document.getElementById('flow-title');
  var bodyEl = document.getElementById('flow-body');
  var active = 1;

  function render() {
    buttons.forEach(function (btn, i) {
      btn.classList.toggle('is-active', i === active);
      btn.setAttribute('aria-pressed', i === active ? 'true' : 'false');
    });
    var z = ZONES[active];
    stageEl.textContent = 'Stage ' + (active + 1) + ' of 3';
    titleEl.textContent = z.title;
    bodyEl.textContent = z.body;
  }

  buttons.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
      active = i;
      render();
    });
  });

  render();
})();
