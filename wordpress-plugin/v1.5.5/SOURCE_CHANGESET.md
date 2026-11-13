# Source change record — v1.5.5

## Changed files in the installable package

- `assets/eagle.js`
- `assets/eagle.css`
- `eagle-structure-lifeos.php`
- `README.md`

## Main implementation areas

- State schema v10: independent `growthTasks` tree and date-keyed `growthDays` score snapshots.
- Five default daily completion leaves: three affirmation check-ins, exercise and 10-minute meditation.
- Daily score scaled to 0–10; date snapshots preserve a month of daily results and are merged by latest update time.
- Star shortcut on the dashboard, opening a dedicated Growth view with editable nested checklist and month grid.
- Drag-and-drop ordering/level changes extended to growth tasks, in addition to existing task and partner trees.
- Restored Partner Network section directly below the dashboard hero.
- Compact mobile stats layout with retained XP, forts, steps, partners, GPV and PIN fields.
- Mobile map layout reduced to a short responsive height; compact plus controls; constrained progress-ring text.
- Removed the unused header shortcut controls.

## Repository/source availability note

The complete installable v1.5.5 plugin source is contained in the versioned ZIP delivered with this release. This GitHub release folder records the notes, manifest and source-change summary; the raw plugin source files are not committed as individual files in this repository snapshot.
