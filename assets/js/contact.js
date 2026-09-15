(function () {
  // --- HubSpot config -------------------------------------------------
  // Portal ID for Harrington Data Co.'s HubSpot account.
  var HUBSPOT_PORTAL_ID = '247125978';
  // TODO: replace with the Form GUID from the HubSpot form you create.
  // Marketing > Lead Capture > Forms > Create form, add fields for:
  // First name (firstname), Last name (lastname), Email (email),
  // Phone number (phone), Number of Employees (numemployees),
  // Budget range (budget_range), Lead Source (lead_source),
  // Message (message) — all already exist as contact properties.
  // Then copy the Form GUID from the embed/share code and paste it here.
  var HUBSPOT_FORM_GUID = 'b350f7a1-7f54-4d93-a9ec-60956b591ad5';

  var form = document.getElementById('contact-form');
  var confirmCard = document.getElementById('contact-confirm');
  var errorBox = document.getElementById('contact-error');
  var submitBtn = form ? form.querySelector('.submit-btn') : null;
  var messageLabel = document.getElementById('message-label');

  // --- Which side: Data / AI / Both / Not sure yet ------------------------

  var practiceButtons = document.querySelectorAll('.practice-btn');
  var panelData = document.getElementById('panel-data');
  var aiInterestBlock = document.getElementById('ai-interest-block');
  var panelUnsure = document.getElementById('panel-unsure');
  var dataButtons = document.querySelectorAll('.data-btn');
  var aiButtons = document.querySelectorAll('.ai-btn');
  var aiPanels = {
    Train: document.getElementById('panel-train'),
    Strategize: document.getElementById('panel-strategize'),
    Build: document.getElementById('panel-build'),
  };

  var practice = '';
  var dataWork = [];
  var aiInterests = [];

  function hasData(label) { return dataWork.indexOf(label) !== -1; }
  function hasAi(label) { return aiInterests.indexOf(label) !== -1; }

  function render() {
    practiceButtons.forEach(function (btn) {
      btn.classList.toggle('active', practice === btn.dataset.practice);
    });

    var showData = practice === 'Data' || practice === 'Both';
    var showAi = practice === 'AI' || practice === 'Both';
    var showUnsure = practice === 'Not sure yet';

    panelData.hidden = !showData;
    aiInterestBlock.hidden = !showAi;
    panelUnsure.hidden = !showUnsure;

    dataButtons.forEach(function (btn) {
      btn.classList.toggle('active', hasData(btn.dataset.data));
    });
    aiButtons.forEach(function (btn) {
      btn.classList.toggle('active', hasAi(btn.dataset.label));
    });

    Object.keys(aiPanels).forEach(function (label) {
      var panel = aiPanels[label];
      if (!panel) return;
      panel.hidden = !(showAi && hasAi(label));
    });

    if (showUnsure) {
      messageLabel.textContent = 'What is the thing that prompted you to write?';
    } else if (showData && hasData('Reporting & dashboards')) {
      messageLabel.textContent = 'Which report is causing the most trouble?';
    } else if (showData && hasData('Advanced analytics')) {
      messageLabel.textContent = 'What question are you trying to answer?';
    } else if (showData) {
      messageLabel.textContent = 'Where does the data get stuck today?';
    } else if (showAi && hasAi('Build')) {
      messageLabel.textContent = "What's the work that keeps piling up?";
    } else if (showAi && hasAi('Train')) {
      messageLabel.textContent = 'What does your team spend too long on today?';
    } else if (showAi && hasAi('Strategize')) {
      messageLabel.textContent = 'What decision are you trying to make?';
    } else {
      messageLabel.textContent = 'Anything else we should know?';
    }
  }

  function pickPractice(value) {
    practice = practice === value ? '' : value;
    render();
  }

  function toggleData(value) {
    dataWork = hasData(value) ? dataWork.filter(function (l) { return l !== value; }) : dataWork.concat(value);
    render();
  }

  function toggleAi(value) {
    aiInterests = hasAi(value) ? aiInterests.filter(function (l) { return l !== value; }) : aiInterests.concat(value);
    render();
  }

  practiceButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { pickPractice(btn.dataset.practice); });
  });
  dataButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { toggleData(btn.dataset.data); });
  });
  aiButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { toggleAi(btn.dataset.label); });
  });

  // --- Build panel: show agent/knowledge-base follow-ups based on kind ----

  var buKind = document.getElementById('bu-kind');
  var buKindFields = document.querySelectorAll('[data-build-kind]');

  function syncBuildKind() {
    if (!buKind) return;
    var val = buKind.value;
    var showAgent = val === 'An agent that handles a task' || val === 'Both';
    var showKb = val === 'A knowledge base the team can ask' || val === 'Both';
    buKindFields.forEach(function (el) {
      if (el.dataset.buildKind === 'agent') el.hidden = !showAgent;
      if (el.dataset.buildKind === 'kb') el.hidden = !showKb;
    });
  }

  if (buKind) buKind.addEventListener('change', syncBuildKind);
  syncBuildKind();

  // --- "Other" tool checkbox: reveal a fill-in field when checked ---------

  var toolOtherCheck = document.getElementById('tr-tool-other-check');
  var toolOtherText = document.getElementById('tr-tool-other-text');

  if (toolOtherCheck) {
    toolOtherCheck.addEventListener('change', function () {
      toolOtherText.hidden = !toolOtherCheck.checked;
      if (!toolOtherCheck.checked) toolOtherText.value = '';
    });
  }

  // --- Build the HubSpot submission payload ---------------------------

  function collectPanelNotes(panel) {
    var lines = [];
    panel.querySelectorAll('.field, .span-all').forEach(function (wrap) {
      if (wrap.hidden) return;
      var label = wrap.querySelector('label');
      var noteText = label ? label.textContent.trim() : '';
      var input = wrap.querySelector('select, textarea, input[type="text"]:not([data-inline-detail]), input[type="tel"]');
      if (input && input.value.trim()) {
        lines.push(noteText + ': ' + input.value.trim());
      }
      var checkboxes = wrap.querySelectorAll('input[type="checkbox"]');
      if (checkboxes.length) {
        var checked = Array.prototype.filter.call(checkboxes, function (c) { return c.checked; })
          .map(function (c) {
            var text = c.parentElement.textContent.trim();
            if (c === toolOtherCheck && toolOtherText.value.trim()) {
              text = 'Other (' + toolOtherText.value.trim() + ')';
            }
            return text;
          });
        if (checked.length) lines.push(noteText + ': ' + checked.join(', '));
      }
    });
    return lines;
  }

  function buildMessage() {
    var lines = [];
    if (practice) lines.push('Which side: ' + practice);

    var showData = practice === 'Data' || practice === 'Both';
    var showAi = practice === 'AI' || practice === 'Both';

    if (showData) {
      if (dataWork.length) lines.push('Data work: ' + dataWork.join(', '));
      lines = lines.concat(collectPanelNotes(panelData));
    }

    if (showAi) {
      if (aiInterests.length) lines.push('Interested in: ' + aiInterests.join(', '));
      Object.keys(aiPanels).forEach(function (label) {
        var panel = aiPanels[label];
        if (panel && !panel.hidden) lines = lines.concat(collectPanelNotes(panel));
      });
    }

    if (practice === 'Not sure yet') {
      lines = lines.concat(collectPanelNotes(panelUnsure));
    }

    var freeText = document.getElementById('f-message').value.trim();
    if (freeText) lines.push(messageLabel.textContent + ' ' + freeText);
    return lines.join('\n');
  }

  function getHubspotCookie() {
    var match = document.cookie.match(/(?:^|; )hubspotutk=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : undefined;
  }

  function buildFields() {
    var fields = [];
    form.querySelectorAll('[data-hs-prop]').forEach(function (el) {
      var value = el.value;
      if (value) fields.push({ name: el.dataset.hsProp, value: value });
    });
    fields.push({ name: 'message', value: buildMessage() });
    return fields;
  }

  function setLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? 'Sending…' : 'Send enquiry';
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errorBox.hidden = true;

      var payload = {
        fields: buildFields(),
        context: {
          pageUri: window.location.href,
          pageName: document.title,
        },
      };
      var hutk = getHubspotCookie();
      if (hutk) payload.context.hutk = hutk;

      var endpoint = 'https://api.hsforms.com/submissions/v3/integration/submit/'
        + HUBSPOT_PORTAL_ID + '/' + HUBSPOT_FORM_GUID;

      setLoading(true);
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HubSpot submission failed: ' + res.status);
          form.hidden = true;
          confirmCard.hidden = false;
        })
        .catch(function (err) {
          console.error(err);
          errorBox.hidden = false;
        })
        .finally(function () {
          setLoading(false);
        });
    });
  }

  render();
})();
