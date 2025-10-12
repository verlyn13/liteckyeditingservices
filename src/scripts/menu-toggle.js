// Lightweight, dependency-free mobile menu toggle
(() => {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const menuLinks = document.querySelectorAll('[data-menu] a');

  if (!menuButton || !menu) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    menu.classList.remove('hidden');
    menuButton.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    isOpen = false;
    menu.classList.add('hidden');
    menuButton.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    isOpen ? closeMenu() : openMenu();
  }

  menuButton.addEventListener('click', toggleMenu);
  menuButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  // Close after navigating
  for (const link of menuLinks) {
    link.addEventListener('click', closeMenu);
  }
})();
