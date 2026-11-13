# Source change record — v1.5.15

## Changed files in the installable plugin

- `assets/eagle.js`
- `assets/eagle.css`
- `eagle-structure-lifeos.php`
- `README.md`

## Implementation summary

- Shared state schema incremented to v14.
- Added the `isBlank` partner-node property and blank-slot rendering/fill/remove actions.
- Updated partner normalization, merge behavior, PV calculations, partner counts and branch people counts to exclude blank placeholders.
- Prevented blank placeholders from being used as a parent in drag-and-drop.
- Added `partnerStyles` defaults, normalization and editor for the qualified, below-threshold and blank categories.
- Replaced hard-coded hamburger menu items with `menuItems` state and configurable label, icon, visibility and ordering controls.
- Added fallback merging for local colour/menu settings when a remote state predates those fields.
- Updated in-app Documentation for blank slots, LOS colours and menu customization.
- Bumped plugin, asset and service-worker cache versions to 1.5.15.

## Source availability note

The complete installable v1.5.15 plugin source is contained in the versioned ZIP delivered with this release. The GitHub folder records release notes, manifest and source-change summary; the raw plugin files are not committed individually in this snapshot.
