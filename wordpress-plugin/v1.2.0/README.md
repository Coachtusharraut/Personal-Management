# Eagle Structure LifeOS — v1.2.0

**Live page:** https://coachtusharraut.com/life/  
**WordPress page:** 900135  
**Plugin:** eagle-structure-lifeos

## Simplified scope

This release is deliberately one feature only: a gamified task journey.

- Dashboard for total progress, completed subtasks, XP, rank and forts captured.
- Level 1: Motivational Interviewing Book Study.
- Eight starter quests with checkable subtasks.
- Per-task progress bars.
- Add/edit/remove tasks.
- Add/edit/remove subtasks.
- Story map inspired by the Sahyadri forts. Completing all subtasks in a quest captures the next fort and changes the story.
- Responsive app-like layout.

## Removed

People/prospects, teams/wings, IBOs, activity log, Eagle Council, assistant, Field Guide, history/undo and backup/restore screens are removed from the user-facing app. The new state model stores only Level 1 and its tasks.

## Migration

On first load, the frontend migrates only the first legacy Level 1 task list and its completion checkmarks. It discards other legacy state fields and writes a compact task-only state for the current private browser session.

## Source

The complete source for this release is backed up under [source-v1.2.0](../source-v1.2.0/). See that folder's README for reconstruction instructions.

The active WordPress install was verified as version 1.2.0. The plugin code runs on the WordPress site; keep the page password protection enabled.
