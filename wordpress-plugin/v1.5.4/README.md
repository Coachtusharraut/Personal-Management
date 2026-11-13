# Eagle Structure LifeOS — v1.5.4

**Live app:** https://coachtusharraut.com/life/  
**Plugin:** Eagle Structure LifeOS v1.5.4  
**Installed:** 13 November 2026  
**Package:** `eagle-structure-lifeos-v1.5.4.zip`

## What changed

### Separate spaces
- LOS opens in its own full-width partner-tree view.
- Potential Partners opens in its own pipeline view, not as a rail or panel beside the real hierarchy.
- Personal Assets opens from its own icon-only control.

### Four configurable potential-partner stages
- Need to contact
- No reply yet
- Ready to start
- Said no

Each stage has an editable label and colour. Previous v1.5.3 red/declined entries migrate to “No reply yet”; “Said no” is now a separate fourth state. Prospects remain outside the actual partner tree and cannot affect partner counts, PV, GPV, PIN qualification or downlines.

### Personal Assets
- Self Talk text can be written, read and updated in the app.
- Personal notes can be added and edited.
- PDFs can be uploaded to the private attachment store and read in the app.

### Resources and documents
- Task PDF attachments open in a scrollable in-app preview.
- Task webpage links open in an embedded reader.
- An optional “Open outside” link is available. Some websites block embedding, so those pages may need the external option.

### LOS partner information
A small information icon on each real partner opens editable phone, email, occupation, city/place, family/kids and notes, plus a dated update history. Updates containing labels such as `Phone:`, `Work:`, `City:` or `Kids:` are automatically placed in the corresponding fields. The complete original update is retained. This is basic rule-based sorting, not AI interpretation.

### Custom order and levels
- Move tasks and subtasks up/down.
- Indent a task one level deeper or outdent it one level.
- Move LOS partners up/down and change their level.
- Merge logic uses stable IDs to avoid recreating a stale copy of a task or partner under an old parent after a level change.

### Dashboard and Sahyadri map
- Removed the “First Flight” rank label and dashboard rank badge.
- Reduced the dashboard progress-strip height.
- Removed the Partner Network eye/help control.
- Made Life & Business and add controls plus-only and compact.
- Rebuilt the map as a curved, rising route through simple Indian-fort markers, with one moving eagle marker. The path responds to task order and task count.

## Data preservation

The upgrade keeps existing task IDs, completed task states, attachments, partner IDs, PV values, prospect names/notes, journal entries and shared app data. The partner tree and prospects remain separate.

## Release validation

- JavaScript syntax check: passed.
- PHP syntax check: passed.
- Render smoke test: dashboard, LOS, Potential Partners, stage settings, Self Talk editor, partner profile and webpage reader rendered successfully.
- ZIP integrity test: passed.
- Live WordPress plugin list: v1.5.4, active.
- Installer SHA-256: `206c3a1f5bc4fc3bf17ab48d396d21ae6a5d47b2d00c0748d5df2d87f7f56300`
- Patch archive SHA-256: `f5e505cefb63ede286cac3cf93c6784dd70e58c5990d48deee9d500610155035`
