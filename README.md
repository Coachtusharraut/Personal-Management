# Eagle Structure — LifeOS

**Live app:** https://coachtusharraut.com/life/  
**Current release:** Eagle Structure LifeOS v1.5.18  
**Canonical Git branch:** `main`

Eagle Structure LifeOS is a private, mobile-first dashboard for Sahyadri fort milestones, recursive tasks, archiving, LOS, potential partners, Personal Assets, the Life & Business logbook and daily growth.

## v1.5.18 — cold-start recovery

- Keep the loading screen eagle-only. No “Opening your saved LifeOS...” text while the app is loading.
- Remove the short timed fallback that could replace the eagle screen while a slow but valid cloud request was still running.
- Allow up to 120 seconds for the initial shared-state read and retry transient failures up to three times.
- If a local backup exists, render it immediately and keep LifeOS usable offline if the cloud is unavailable.
- Never write local/default data over the shared cloud record until a fresh cloud read succeeds.
- Reconcile offline local edits with the shared workspace before enabling cloud writes.
- Refresh a stale WordPress nonce once after an authorization failure, without creating a reload loop.
- Preload essential app CSS/JS and exclude the large hero image from service-worker installation precache.

See [v1.5.18 release notes](wordpress-plugin/v1.5.18/README.md), [release manifest](wordpress-plugin/v1.5.18/RELEASE_MANIFEST.md), [source change record](wordpress-plugin/v1.5.18/SOURCE_CHANGESET.md) and [Git release policy](GIT_RELEASE_POLICY.md).

## Previous release
See [v1.5.17 release notes](wordpress-plugin/v1.5.17/README.md) for the previous startup-recovery implementation.
