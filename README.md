# Eagle Structure — LifeOS

**Live app:** https://coachtusharraut.com/life/  
**Current release:** Eagle Structure LifeOS v1.5.6  
**Canonical Git branch:** `main`

This repository is the source of truth for the current LifeOS project. The previous Personal Management prototype remains recoverable in Git history.

## Current product

Eagle Structure LifeOS is a private mobile-first dashboard for the Sahyadri campaign, recursive tasks, partner hierarchy/PV tracking, potential-partner follow-up, personal assets, task resources, the Life & Business logbook, daily growth and streak tracking.

The live WordPress page remains password-protected.

## v1.5.6 highlights

- Removed the large Eagle/Shivaji hero banner; the Sahyadri map now leads the dashboard, with stats directly below it.
- Put XP, forts, steps, partners, GPV and Pin percentage into a roomier compact stats panel.
- Placed a full-size daily-growth star on the right. Its glow grows with today's score; a consecutive-day streak is shown below.
- Simplified Pin text to `Pin 0%`, `Pin 3%`, `Pin 6%` and so on.
- Fixed the root partner action area so the edit pencil stays within the card.
- Fixed long-press touch drag-and-drop for tasks, daily-growth tasks and partners.
- Task cards change from red to amber to green as completion increases.
- Partner updates can be reopened and edited after saving.
- Optional date/time on a task adds a prefilled Google Calendar event link. This is a user-confirmed one-way handoff, not background sync.

See [v1.5.6 release notes](wordpress-plugin/v1.5.6/README.md), [release manifest](wordpress-plugin/v1.5.6/RELEASE_MANIFEST.md), [source change record](wordpress-plugin/v1.5.6/SOURCE_CHANGESET.md) and [Git release policy](GIT_RELEASE_POLICY.md).

## Previous release

See [v1.5.5 release notes](wordpress-plugin/v1.5.5/README.md) for the earlier daily-growth tracker and mobile dashboard.
