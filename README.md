# Eagle Structure — LifeOS

**Live app:** https://coachtusharraut.com/life/  
**Current release:** Eagle Structure LifeOS v1.5.2  
**Canonical Git branch:** `main`

This repository is now the source of truth for the current LifeOS website. The older Personal Management prototype is retained in Git history for recovery, but it is no longer the current project at the head of `main`.

## Current product

Eagle Structure LifeOS is a private, cross-device dashboard for the Sahyadri campaign, recursive missions and subtasks, partner network/PV tracking, attachments, YouTube resources, and the Life & Business Logbook.

The live WordPress page is protected by its existing LifeOS password. The v1.5.2 release adds mobile pinch-to-zoom for the partner tree, a cleaner mobile dashboard, and installable PWA support.

## Repository map

- `src/` — LifeOS interface and feature modules.
- `public/` — PWA manifest, service worker, and app icons.
- `wordpress-plugin/` — WordPress integration notes and version history.
- `firebase.json`, `firestore.rules` — Firebase configuration and access rules.
- `GIT_RELEASE_POLICY.md` — mandatory versioning and backup process.

## Working rule

Every website change must be committed to this repository before it is treated as a completed version. Keep `main` as the canonical branch, preserve the previous versions in commit history, and create a version tag plus release notes for every stable release.

See [GIT_RELEASE_POLICY.md](GIT_RELEASE_POLICY.md) for the exact workflow.
