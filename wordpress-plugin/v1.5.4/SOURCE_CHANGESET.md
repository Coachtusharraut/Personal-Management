# Source change record — v1.5.4

## Changed files in the installable package

- `assets/eagle.js`
- `assets/eagle.css`
- `eagle-structure-lifeos.php`
- `README.md`

## Main implementation areas

- State schema v9: four configurable prospect statuses, a separate Personal Assets collection and per-partner profile/update metadata.
- Separate full-width views: dashboard/tasks, LOS, Potential Partners and Personal Assets.
- One-time legacy migration: old `add` prospect status maps to Ready to start; old v1.5.3 `declined` status maps to No reply yet.
- Task and partner tree move controls, plus ID-based merge safeguards to avoid stale moved-node duplicates.
- Partner detail editor and basic label-driven update sorting.
- In-app PDF attachment preview and embedded webpage reader with external-open fallback.
- Curved SVG Sahyadri map that adapts to task order/count and shows one animated eagle marker.
- Compact dashboard controls and removal of the obsolete help/rank UI.

## Repository/source availability note

The complete installable v1.5.4 plugin source is contained in the versioned ZIP delivered with this release. This GitHub release folder records the notes, manifest and source-change summary; the raw plugin source files are not committed as individual files in this repository snapshot. This distinction is intentional and avoids claiming that the repository contains source files that are not present.
