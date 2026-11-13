# Eagle Structure LifeOS — v1.5.6

**Live app:** https://coachtusharraut.com/life/  
**Plugin:** Eagle Structure LifeOS v1.5.6  
**Installed:** 13 November 2026  
**Package:** `eagle-structure-lifeos-v1.5.6.zip`

## Dashboard layout

- Removed the large Eagle/Shivaji hero banner.
- Moved the Sahyadri map into the banner's former position at the top of the dashboard.
- The stats panel now sits directly below the map.
- The map is capped at about 190 CSS pixels on typical phones (180 px on narrow phones).
- The Partner Network list remains below the dashboard.

## Stats and daily growth

- Stats use a two-row, three-column layout beside the progress ring and growth star.
- The daily-growth star stays at the far right and keeps its full-size base shape. Its brightness, glow and scale increase as the daily score rises.
- Today's 0–10 score appears below the star.
- A consecutive full-completion streak appears below the score, for example `🔥 3-day streak`.
- The streak remains alive during the current day when the previous day was fully completed; it increases when today's checklist is completed. A day counts toward the streak when all active daily checklist items are complete.

## Partner network and hierarchy

- Tushar's root partner card now reserves enough room for both action icons; the pencil remains inside the card.
- PV labels no longer say PIN 1/PIN 2 or “Not qualified”. They show `Pin 0%`, `Pin 3%`, `Pin 6%`, etc.
- Touch drag uses a 380 ms long press and tolerates ordinary finger drift before activation.
- Unexpected pointer cancellation no longer commits a stale move. Drag handles use `touch-action:none`.
- Dragging above/below an item reorders it; dropping inside another item changes its level.
- Existing ordering support remains for tasks, daily-growth tasks and partners.

## Task completion colours

Task cards now use completion-based colours: red for under 50%, amber for 50–99%, and green for fully completed. The progress bar uses the matching colour family.

## Partner update editing

Every saved partner update now has an edit control. Open it, change the text and save; the updated entry remains in the partner history and the partner profile stays open. The original date is retained. Labelled information in the edited text is also processed into the matching profile fields.

## Time-based tasks and Google Calendar

The task editor has an optional date/time field. Leave it empty for ordinary tasks. When a time is set, the expanded task shows **Add to Google Calendar**. It opens a prefilled Google Calendar event with the task title, selected start time, a 30-minute default duration and any notes/resource link.

This is a one-tap handoff: Google Calendar opens and the user confirms Save. It does not silently create calendar events and does not perform background two-way sync. Automatic sync would require a Google Cloud OAuth client and explicit Calendar permission.

## Data and compatibility

- Shared app data schema is now version 11.
- Task schedule time is an optional field; all previous tasks remain valid.
- Partner IDs, profiles, updates, prospects, Personal Assets, tasks, completion states and daily-growth history are retained.
- Drag-and-drop only changes parent/order relationships and preserves stable IDs.

## Validation

- JavaScript syntax check: passed.
- PHP syntax check: passed.
- UI smoke tests: map-first dashboard, map-before-stats ordering, restored Partner Network, star position, simplified Pin display, scheduled-task save and Calendar link, partner update edit/reopen, and touch drag reorder all passed.
- ZIP integrity check: passed.
- Live WordPress plugin list: v1.5.6, active.
- Installer SHA-256: `d55ab81bba75f10134e090e8d4859ee7c414ba6074fc0d9bbe5bedf17fe18eda`
- Patch archive SHA-256: `568233b7030f2f4d5d568b7e38c056ce3180c2f579fb9e92c24ce3741f41eaf9`
