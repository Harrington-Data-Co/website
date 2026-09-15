(function () {
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
