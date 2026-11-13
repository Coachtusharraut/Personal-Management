# Source change record — v1.5.16

## Changed files

- `assets/eagle.js`
- `assets/eagle.css`
- `eagle-structure-lifeos.php`
- `README.md`

## Implementation summary

- Startup now reads `tr-eagle-local-backup-v5-shared` and legacy local keys synchronously before the first render.
- A local snapshot is rendered immediately; the shared WordPress record is fetched and merged afterward.
- A 12-second AbortController timeout is applied to the initial remote state read.
- Offline/local fallback is retained when the initial remote read fails; it does not automatically POST a possibly stale local snapshot.
- Timestamp-aware reconciliation is used for remote refreshes.
- Added preload links for app CSS and JS from the WordPress head.
- Service-worker shell cache changed to v1.5.16 and only precaches CSS, JS and icons; large hero images are excluded.
- Replaced simultaneous desktop/mobile hero image tags with one responsive `picture` resource selection and lazy/low-priority loading.
- Added an install menu action/help flow for standalone PWA use.

## Source and test notes

- JavaScript syntax: passed.
- PHP syntax: passed.
- ZIP integrity: passed.
- Automated visual browser test was not available in this runtime; the release note does not claim a measured load-time benchmark.
- Chrome's browser chrome remains outside website control in normal tabs. Standalone PWA mode hides the browser address bar.

The complete v1.5.16 plugin source is delivered in the installable ZIP. This GitHub record does not claim the raw application files are committed individually.
