# Eagle Structure LifeOS — v1.5.13

**Live app:** https://coachtusharraut.com/life/  
**Plugin:** Eagle Structure LifeOS v1.5.13  
**Installed:** 13 November 2026  
**Package:** `eagle-structure-lifeos-v1.5.13.zip`

## In-app YouTube player controls

Task links that resolve to YouTube videos now render an in-app player with a visible **⛶ Full screen** control.

- Tap **Full screen** to expand the player over the available LifeOS app viewport.
- Tap **↙ Minimise** to return it to its original size in the task.
- Expanding/minimising toggles a CSS class on the existing player wrapper; it does not replace or reload the iframe, so playback can continue.
- The embed URL enables `playsinline=1` and fullscreen support. The iframe allows fullscreen and the YouTube player retains its playback controls.
- The fullscreen view uses the app screen and does not deliberately navigate to the YouTube app or website.

This feature applies to YouTube URLs added to task resources. Videos that block embedding at the creator's settings or by regional/network restrictions may still refuse playback, as before.

## Release validation

- JavaScript syntax check: passed.
- PHP syntax check: passed.
- ZIP integrity test: passed.
- Source assertions: expand/minimise action, inline-playback and fullscreen permissions present.
- Live WordPress plugin list: v1.5.13, active.
- Installer SHA-256: `0ab6ed6b9227f87ee2dc46ff1cde9a2a78a90b68630203e8337579d81abaa142`
- Patch archive SHA-256: `874babe94c3d03ea2a56d42ff9dd8bf50a1b5c2bf5b6350833d649338f6b78b6`
