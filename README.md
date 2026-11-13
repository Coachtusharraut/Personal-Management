# Eagle Structure — LifeOS

**Live app:** https://coachtusharraut.com/life/  
**Current release:** Eagle Structure LifeOS v1.5.8  
**Canonical Git branch:** `main`

This repository is the source of truth for the current LifeOS project. The previous Personal Management prototype remains recoverable in Git history.

## Current product
Eagle Structure LifeOS is a private mobile-first dashboard for Sahyadri fort milestones, recursive tasks, archiving, LOS, potential partners, Personal Assets, the Life & Business logbook and daily growth.

## v1.5.8 mobile polish
- Fort names automatically size their label and shrink the text to stay inside the label on mobile.
- Improved fort-name contrast and label background.
- Removed the numeric badges from top-right menu items so counts no longer crowd or hide behind the menu control.
- Existing tasks, archives, milestones, partner records and other saved app data remain on the same state schema.

## Google Calendar
Optional time-based tasks retain their Google Calendar handoff link. Automatic background event creation is not enabled because Google account OAuth consent and Calendar write permission have not been granted. An email address alone cannot authorize calendar writes.

See [v1.5.8 release notes](wordpress-plugin/v1.5.8/README.md), [release manifest](wordpress-plugin/v1.5.8/RELEASE_MANIFEST.md), [source change record](wordpress-plugin/v1.5.8/SOURCE_CHANGESET.md) and [Git release policy](GIT_RELEASE_POLICY.md).
