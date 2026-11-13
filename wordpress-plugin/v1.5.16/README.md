# Eagle Structure LifeOS — v1.5.16

**Live app:** https://coachtusharraut.com/life/  
**Plugin:** Eagle Structure LifeOS v1.5.16  
**Installed:** 14 November 2026  
**Package:** `eagle-structure-lifeos-v1.5.16.zip`

## Faster repeat launches

- The app reads its last localStorage snapshot before waiting for WordPress.
- When a local snapshot exists, LifeOS normalises it and renders the dashboard immediately; the remote shared state is then fetched and reconciled in the background.
- When the cloud is slow or unavailable, the saved device copy stays usable. A failed startup read does not overwrite the shared cloud record.
- If the remote record has newer data, the app reconciles it using update timestamps and stable record IDs.
- The initial cloud request has a 12-second abort limit; repeat launches with a local copy do not wait for that timeout before rendering.

A first-ever load on a device without a local snapshot still needs the initial shared-state request. The faster local-first behaviour applies after that device has saved its first local copy.

## Faster app shell delivery

- Added preload hints for the CSS and JavaScript in the page head.
- Service-worker cache now preloads the app CSS, JavaScript and app icons, but not the large desktop/mobile hero art.
- Updated the landing scene to a responsive `picture` element with a mobile source and desktop fallback, lazy loading and low fetch priority.
- Service-worker cache name and asset query versions updated to v1.5.16.

## Hide Chrome's website bar

The PWA manifest already uses `display: standalone`. This release adds an in-app **Install LifeOS · hide browser bar** menu action. When Chrome provides an install prompt, the button invokes it; otherwise it opens simple installation steps.

The Chrome address bar cannot be hidden by the website in an ordinary browser tab. On Android, install the web app via Chrome's menu (More → Install / Add to Home screen → Install app), then launch its home-screen icon. The installed standalone window does not show the normal Chrome address bar. The Android status bar/navigation bar may still remain, depending on the device settings.

Official Chrome Help: https://support.google.com/chrome/answer/9658361

## Validation

- JavaScript syntax check: passed.
- PHP syntax check: passed.
- ZIP integrity test: passed.
- Static checks: local-first cached-state render path, cloud merge/timeout path, CSS/JS preload hints, standalone manifest and reduced service-worker precache list verified.
- Live WordPress plugin list: v1.5.16, active.
- Installer SHA-256: `0598d0d762e0263e12bd85e33d12a7c017bfd9d872cd47db1f419f4dec1f8760`
- Patch archive SHA-256: `f6e56e4be1f2da1ee17e43bc09f34278482648a3654c80c8408a1e52432d66d4`

Note: Automated headless Chromium capture was unavailable in this environment, so no visual browser-speed benchmark is claimed.
