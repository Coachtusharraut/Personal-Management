# Source change record — v1.5.7

## Changed files in the installable package

- `assets/eagle.js`
- `assets/eagle.css`
- `eagle-structure-lifeos.php`
- `README.md`

## Main implementation areas

- State schema v12: added `archivedTasks` records with archived date and source parent.
- Archive-aware state merge: archived task IDs and descendants are pruned from active trees and are not reintroduced from stale device copies.
- Completed task UI: archive action appears only when a task and all its leaf steps are complete.
- Archived Tasks page: view, restore to active task list, permanently delete.
- Sahyadri milestone helper groups top-level tasks into four-ish task blocks, capped at five named forts.
- Milestone map shows one stone-fort marker per group, group completion status and simple label chips; removed flying eagle decoration.
- Dashboard renders the Sahyadri map once at the top and no longer repeats it after the partner network.
- Stats-strip Forts count now matches completed map milestones.
- Partner list, root partner and visual tree cards receive PIN-tier CSS classes based on group PV.
- New Documentation page, accessible from the top-right menu, with simple usage guidance for each major area.

## Repository/source availability note

The complete installable v1.5.7 plugin source is in the versioned ZIP delivered with this release. This GitHub release folder records the notes, manifest and source-change summary; the raw plugin source files are not committed as individual files in this repository snapshot.
