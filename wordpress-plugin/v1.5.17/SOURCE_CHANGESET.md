# Source change record — v1.5.17

## Changed files
- `assets/eagle.js`
- `assets/eagle.css`
- `eagle-structure-lifeos.php`
- `README.md`

## Fix details
- Added an immediate cold-start app-shell render.
- Added a blocking restore state when no local cache exists, with a retry state if cloud retrieval fails.
- Added a guard preventing starter/default data from being saved over the cloud when the initial cloud read fails.
- Added recovery for unexpected errors in the asynchronous boot path.
- Added a PHP-side fallback message if the JS bundle does not start.
- Reduced cloud-read timeout to 8 seconds.
- Bumped plugin and service-worker cache version to 1.5.17.

## Validation limits
Syntax, archive integrity and static startup-path assertions passed. The isolated headless Chromium process did not terminate reliably, so no full browser-interaction pass is claimed.
