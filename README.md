# Eagle Structure — LifeOS

**One mission:** complete meaningful tasks, build consistency, and turn progress into a visible journey.

## Live app

https://coachtusharraut.com/life/

The active WordPress plugin is **Eagle Structure LifeOS v1.2.0**. The page is password-protected and remains outside the public site navigation.

## What the app does now

- One compact Eagle progress dashboard.
- Level 1: **Motivational Interviewing Book Study**, seeded with eight starter quests.
- Expandable tasks with their own progress indicators.
- Tickable subtasks; add, edit and remove subtasks.
- Add, edit and remove tasks.
- Overall completion, XP and rank.
- A story-driven Sahyadri fort map: completing each quest captures a fort and advances the campaign story.
- Mobile-first layout.

## What was deliberately removed

The older people/prospect pipeline, teams/wings, IBO tracking, activity logs, Eagle Council, assistant, history/undo, Field Guide and backup/restore screens are not part of this simplified app. The new saved state model contains only Level 1 and its tasks/subtasks.

On first load after the update, only Level 1 task text and completion checkmarks are migrated from the previous record. The app then saves the compact state for the current private browser session; other legacy records are not carried into the new app model.

## Release source and recovery

- Current source archive: [wordpress-plugin/source-v1.2.0](wordpress-plugin/source-v1.2.0/)
- Release notes: [v1.2.0 README](wordpress-plugin/v1.2.0/README.md)
- The branch `backup/eagle-structure-2026-11-13` preserves the previous v1.1.0 implementation before this simplification.
- Original React/Firebase experiments remain in repository history; they are not the live WordPress app.

## Storage note

The app stores its state in WordPress under a private browser-session identity and keeps a local browser copy. Different browsers/devices do not automatically share progress. The `/life/` page password should remain enabled and should be changed from any temporary password.

