# Source change record — v1.5.18

## Changed files
- `eagle-structure-lifeos.php`
- `assets/eagle.js`
- `assets/eagle.css`
- `README.md`

## Implementation
- Plugin and service-worker cache version bumped to 1.5.18.
- PHP shortcode boot markup is eagle-only; the premature timed fallback panel is not emitted.
- Essential CSS and JS are preloaded in the page head.
- Service worker no longer precaches the large hero image during installation.
- Initial state fetch increased to 120 seconds and retries transient failures three times.
- HTTP 401/403 refreshes the WordPress page nonce once, using sessionStorage to avoid loops.
- Added `cloudWriteAllowed` gate: local writes remain local until the first successful shared-state read.
- If the first cloud read fails with an existing local copy, LifeOS renders the local copy and remains usable offline.
- Periodic/online refresh reconciles local changes with the remote shared record before allowing cloud saves.
- If no local copy exists and all initial requests fail, the app offers a retry; it does not persist default state.
- Unexpected JS startup errors recover to local data when available.

## Test notes
- JavaScript and PHP syntax checks passed.
- ZIP integrity passed.
- Static assertions passed for the critical boot and data-safety branches.
- A full interactive headless-browser run was unavailable because Chromium did not terminate reliably in this environment.

## Source availability
The complete v1.5.18 plugin source and assets are contained in the versioned ZIP delivered with the release. This GitHub release folder contains documentation and source-change notes, not the individual raw application source files.
