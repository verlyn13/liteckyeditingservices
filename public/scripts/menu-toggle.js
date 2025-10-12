// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (!menuToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.add('hidden');
      }
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.add('hidden');
        menuToggle.focus();
      }
    });
  }
});
