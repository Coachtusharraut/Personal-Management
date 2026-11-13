# Eagle Structure LifeOS — v1.5.7

**Live app:** https://coachtusharraut.com/life/  
**Plugin:** Eagle Structure LifeOS v1.5.7  
**Installed:** 13 November 2026  
**Package:** `eagle-structure-lifeos-v1.5.7.zip`

## Sahyadri map and milestones

- Removed the extra middle Sahyadri map. There is now exactly one map at the top of the dashboard.
- Tasks are grouped into up to five fort milestones, aiming for roughly four tasks per fort. For example, 16 tasks form four groups of four; 17–20 tasks form five groups.
- Milestones use simple real fort names: Rajgad, Torna, Sinhagad, Purandar and Raigad.
- The map shows one fort marker per group, not one marker per task. A milestone is complete when every task in its group is complete.
- The stats-strip Forts value counts completed milestones.
- Removed the eagle marker from the path so it cannot obscure labels or clutter the small screen.

## Completed task archive

- Every completed task card displays a compact archive icon.
- Archiving moves the task and its nested steps to a separate Archived Tasks page.
- Archived tasks can be restored to the active task list or permanently deleted.
- The task header and top-right menu both provide access to Archived Tasks.
- The shared-state merge treats archived IDs as archived tombstones. If an older device still has an active copy, that stale copy does not recreate the archived task.

## PIN-coloured partner cards

Partner cards automatically use a tier colour based on current group PV:
- 0%: neutral grey
- 3%: blue
- 6%: purple
- 9%: green
- 12%: gold
- 15%: orange
- 18%: red
- 21%: teal

Colour is recalculated when partner PV changes. This is a visual cue only; it does not change qualification rules.

## Documentation

Added a Documentation page to the top-right menu. It explains:
- Dashboard and Sahyadri milestones
- Tasks, subtasks, drag-and-drop and archiving
- LOS, partner PIN colours and partner profiles
- Potential Partners and its editable stages
- Daily Growth and streak tracking
- Personal Assets and reading PDFs
- Time-based task reminders and the Google Calendar handoff
- Life & Business logbook and cloud sync

## Data preservation and validation

- Existing active task IDs, nested subtasks, completion state, notes, links and attachments are retained.
- Existing partner IDs, hierarchy, PV, prospects, personal assets, growth checklist and daily scores are retained.
- Archived IDs are respected during state merges to avoid resurrection from old device copies.
- JavaScript syntax check passed.
- PHP syntax check passed.
- Render test: exactly one map; 16 tasks grouped into four fort milestones.
- Archive, restore, documentation and PIN-colour tests passed.
- Stale-device archive merge test passed.
- ZIP integrity test passed.
- Live WordPress plugin list: v1.5.7, active.
- Installer SHA-256: `cf2e13f088a6cdecece9152c5c39a1daecefb0d9b8f60f795de1027036c2f4f0`
- Patch archive SHA-256: `329f14eecdae8f028b52b6643aaafa28be26d739d4f71621f4fad296be298326`
