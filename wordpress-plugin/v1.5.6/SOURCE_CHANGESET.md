# Source change record — v1.5.6

## Changed files in the installable package

- `assets/eagle.js`
- `assets/eagle.css`
- `eagle-structure-lifeos.php`
- `README.md`

## Main implementation areas

- State schema v11 with optional local datetime schedule on each task.
- Dashboard reordered to put the Sahyadri map where the Eagle/Shivaji hero banner used to be; stats panel directly below map.
- Growth streak computed from consecutive daily full-completion snapshots.
- Full-size right-aligned daily-growth star with score and streak label; glow and scale based on 0–10 score.
- Simplified PV tier labels to a generic Pin label plus percentage.
- Root partner card action grid fixed to keep both icons within its boundary.
- Partner profile history items now open an edit form; save replaces the selected update and keeps its date.
- Touch drag threshold changed to 380 ms with movement tolerance, pointercancel safety and explicit drop target styles.
- Completion-driven task classes and progress bar colours (red/amber/green).
- Task date/time generates a Google Calendar event-template URL with title, start time, 30-minute duration and notes.

## Google Calendar scope

The current implementation is a user-confirmed one-way handoff via Google's event template. It does not store OAuth credentials, silently create events or synchronise updates in the background. Full sync requires Google OAuth consent and Calendar API access.

## Repository/source availability note

The complete installable v1.5.6 plugin source is contained in the versioned ZIP delivered with this release. This GitHub release folder records notes, manifest and source-change summary; the raw plugin source files are not committed individually in this repository snapshot.
