(function () {
  // --- Mobile nav toggle ---------------------------------------------------
  // Below the nav breakpoint, links collapse into a panel behind a
  // hamburger button. Closes on Escape, outside click, or navigating away.

  var navToggle = document.getElementById('nav-toggle');
  var navPanel = document.getElementById('nav-panel');

  if (navToggle && navPanel) {
    function setNavOpen(open) {
      navPanel.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    navToggle.addEventListener('click', function () {
      setNavOpen(!navPanel.classList.contains('is-open'));
    });

    document.addEventListener('click', function (e) {
      if (!navPanel.contains(e.target) && e.target !== navToggle && !navToggle.contains(e.target)) {
        setNavOpen(false);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navPanel.classList.contains('is-open')) {
        setNavOpen(false);
        navToggle.focus();
      }
    });

    navPanel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setNavOpen(false); });
    });
  }

  // --- Services dropdown --------------------------------------------------
  // Opens on hover for mouse users, on click/tap for everyone, and closes on
  // Escape, on an outside click, or when focus moves out of the dropdown.

  document.querySelectorAll('.nav-dropdown').forEach(function (dropdown) {
    var trigger = dropdown.querySelector('.nav-trigger');
    var menu = dropdown.querySelector('.nav-menu');
    if (!trigger || !menu) return;

    function setOpen(open) {
      menu.hidden = !open;
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    trigger.addEventListener('click', function () {
      setOpen(menu.hidden);
    });

    // Only wire hover where a real pointer can hover; on touch screens the
    // emulated mouseenter would open the menu and the click would close it.
    if (window.matchMedia('(hover: hover)').matches) {
      dropdown.addEventListener('mouseenter', function () { setOpen(true); });
      dropdown.addEventListener('mouseleave', function () { setOpen(false); });
    }

    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) setOpen(false);
    });

    dropdown.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) {
        setOpen(false);
        trigger.focus();
      }
    });

    dropdown.addEventListener('focusout', function (e) {
      if (!dropdown.contains(e.relatedTarget)) setOpen(false);
    });
  });
})();
