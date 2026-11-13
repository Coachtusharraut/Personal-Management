# Eagle Structure LifeOS — v1.5.2

**Live app:** https://coachtusharraut.com/life/  
**Plugin:** Eagle Structure LifeOS v1.5.2

## Partner visual tree
- Pinch with two fingers to zoom in/out.
- Drag with one finger to pan.
- Plus/minus/reset controls removed.
- The tree remains directly connected to the same live partner records.

## Cleaner dashboard
- Removed the decorative save tick and baked-in notification bell.
- Kept one functional hamburger menu button.
- "Add Task" is now a plus-only circular button.
- Missions use a warm peach/gold panel; Partner Network uses a cool blue panel.

## Install as an app
- Added a web app manifest with standalone display mode, portrait orientation and Eagle icons.
- Added a same-origin service worker scoped to /life/; it caches static CSS/JS/image assets only. It does not cache private state/API responses.
- On Android Chrome: open the protected LifeOS page → Chrome menu → Install app (or Add to Home screen if shown). Launch from the new icon for a standalone window without Chrome's address bar.
- A true interactive Android home-screen widget requires a native Android companion app and is not part of this PWA release.

## Preserved
Partner PV tree, PIN qualification, recursive missions and progress, attachments, YouTube embeds, single-page password sync and Logbook.

## Installer
Exact ZIP delivered in the current ChatGPT conversation: `eagle-structure-lifeos-v1.5.2.zip`.

SHA-256: `65d55c42370069added5eedda9ba15fb3db3b6d2b20cb36ad70c3cfeb7bfa744`

Previous release snapshot: `backup/eagle-structure-2026-11-13-v1.5.1`.
