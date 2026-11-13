# Eagle Structure — LifeOS

**Live app:** https://coachtusharraut.com/life/  
**Current release:** Eagle Structure LifeOS v1.5.17  
**Canonical Git branch:** `main`

Eagle Structure LifeOS is a private, mobile-first dashboard for Sahyadri fort milestones, recursive tasks, archiving, LOS, potential partners, Personal Assets, the Life & Business logbook and daily growth.

## v1.5.17 startup recovery

- Cold starts immediately render the app shell instead of leaving only the flying eagle visible while the first cloud request is pending.
- A local backup is rendered immediately when available, then reconciled with the shared cloud state.
- If there is no local backup, a visible restore screen appears while the app fetches the cloud workspace.
- If cloud loading fails on a cold start, LifeOS shows a retry screen instead of an endless animation.
- Starter/default data is never posted over the shared cloud state merely because the initial cloud read failed.
- Unexpected startup exceptions recover to the local backup when possible.
- Cloud read timeout is eight seconds.
- A PHP-rendered fallback provides a reload action if the application JavaScript fails to start at all.

See [v1.5.17 release notes](wordpress-plugin/v1.5.17/README.md), [release manifest](wordpress-plugin/v1.5.17/RELEASE_MANIFEST.md), [source change record](wordpress-plugin/v1.5.17/SOURCE_CHANGESET.md) and [Git release policy](GIT_RELEASE_POLICY.md).

## Previous release
See [v1.5.16 release notes](wordpress-plugin/v1.5.16/README.md) for the local-first loading and PWA improvements.
