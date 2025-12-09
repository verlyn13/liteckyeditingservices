// Mobile menu toggle with smooth animations
(() => {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const menuLinks = menu?.querySelectorAll('a');

  if (!menuButton || !menu) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    menu.classList.remove('hidden');
    // Trigger reflow for animation
    menu.offsetHeight;
    menu.classList.add('open');
    menuButton.setAttribute('aria-expanded', 'true');
    // Focus first menu item for accessibility
    menuLinks?.[0]?.focus();
  }

  function closeMenu() {
    isOpen = false;
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    // Wait for animation to complete before hiding
    setTimeout(() => {
      if (!isOpen) {
        menu.classList.add('hidden');
      }
    }, 300);
  }

  function toggleMenu() {
    isOpen ? closeMenu() : openMenu();
  }

  // Toggle on button click
  menuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Keyboard support for button
  menuButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
      menuButton.focus();
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (isOpen && !menu.contains(e.target) && !menuButton.contains(e.target)) {
      closeMenu();
    }
  });

  // Close after navigating (for SPA-like behavior)
  menuLinks?.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on resize to desktop
  const mediaQuery = window.matchMedia('(min-width: 768px)');
  mediaQuery.addEventListener('change', (e) => {
    if (e.matches && isOpen) {
      closeMenu();
    }
  });
})();
