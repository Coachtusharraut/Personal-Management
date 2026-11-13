# Source change record — v1.5.12

## Changed files
- `assets/eagle.js`: added an eye-icon button to the Partner Network heading, with `data-action="view-network"` before the existing plus/add-partner button.
- `assets/eagle.css`: compact 36px styling for the eye button and 17px outlined eye SVG.
- `eagle-structure-lifeos.php`: version and service-worker cache bumped to 1.5.12.
- `README.md`: added v1.5.12 release note.

## Behaviour
The eye control calls the existing full LOS view route; the plus control retains its existing add-partner behaviour. No other app data or partner logic is changed.

## Source availability
The complete installable plugin source is in the versioned ZIP delivered with this release. This record does not imply that the raw application source has been committed individually to GitHub.
