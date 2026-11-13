# Source change record — v1.5.13

## Changed files
- `assets/eagle.js`
  - Adds the in-app Full screen / Minimise toggle for embedded YouTube task resources.
  - Enables `playsinline=1` and `fs=1` in the nocookie embed URL.
  - Adds delegated click handling that toggles the existing player wrapper without rerendering/recreating the iframe.
- `assets/eagle.css`
  - Adds normal player toolbar and 16:9 frame styling.
  - Adds an app-viewport fullscreen overlay with safe-area padding and a Minimise control.
- `eagle-structure-lifeos.php`
  - Bumps plugin and service-worker/cache asset version to 1.5.13.
- `README.md`
  - Adds v1.5.13 feature notes.

No task data, partner hierarchy, PV calculations, prospect state or other saved LifeOS data structures are changed.

## Source availability
The complete installable plugin source is in the versioned ZIP delivered with this release. The GitHub release folder contains documentation and a change summary rather than each raw plugin source file individually.
