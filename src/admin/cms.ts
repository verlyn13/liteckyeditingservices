// NPM-delivered Decap CMS entry (decap-cms-app)
// Auto-init mode: Decap discovers config via <link rel="cms-config-url" href="/admin/config.yml">.
// Do not call CMS.init here; let Decap handle OAuth and store updates.

import CMS from 'decap-cms-app';

// Diagnostics: expose global reference for tests/inspections
const cms = CMS as unknown as DecapCMS;
(window as Window & { CMS?: unknown; __cmsApp?: unknown }).CMS = cms;
(window as Window & { CMS?: unknown; __cmsApp?: unknown }).__cmsApp = cms;
