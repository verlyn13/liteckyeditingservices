(() => {
  try {
    const host = location.hostname;
    const isProd = host === 'www.liteckyeditingservices.com' || host === 'liteckyeditingservices.com';
    const isPages = /\.pages\.dev$/i.test(host);
    if (isProd) return;

    const banner = document.createElement('div');
    banner.setAttribute('data-admin-preview-banner', '');
    banner.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'right:0',
      'z-index:2147483647',
      'background:#0b5fff',
      'color:#fff',
      'font:600 14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Arial',
      'padding:10px 12px',
      'box-shadow:0 2px 6px rgba(0,0,0,.2)'
    ].join(';');
    banner.innerHTML = [
      isPages ? 'Preview environment' : 'Non-production environment',
      ' — GitHub login may be disabled or use separate credentials.'
    ].join('');

    // Push content down so it doesn't hide under the banner
    const spacer = document.createElement('div');
    spacer.style.height = '42px';

    document.addEventListener('DOMContentLoaded', () => {
      document.body.prepend(spacer);
      document.body.prepend(banner);
    });
  } catch (_) {
    // no-op
  }
})();

