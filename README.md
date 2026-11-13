# Eagle Structure — LifeOS

**Live app:** https://coachtusharraut.com/life/  
**Current release:** Eagle Structure LifeOS v1.5.16  
**Canonical Git branch:** `main`

Eagle Structure LifeOS is a private, mobile-first dashboard for Sahyadri fort milestones, recursive tasks, archiving, LOS, potential partners, Personal Assets, the Life & Business logbook and daily growth.

## v1.5.16 startup and mobile launch improvements

- Returning launches now read and render the last saved local copy immediately, then reconcile the cloud state in the background.
- A slow/unavailable cloud read does not block opening a previously saved local copy or overwrite the shared cloud record.
- CSS and JavaScript are preloaded from the page head so the app shell can start loading sooner.
- Service-worker shell cache precaches only the app CSS, JS and icons; large hero artwork is no longer downloaded as part of initial shell installation.
- A responsive picture selects the mobile scene image on narrow screens and the desktop scene on wide screens instead of eagerly loading both.
- The install menu offers a guided way to install LifeOS as a standalone Android app, where Chrome's address bar is removed from the app window.

**Chrome note:** A website cannot hide Chrome's address bar while it is open in a normal browser tab. Install LifeOS from Chrome's install/Add to Home screen option, then launch the installed app icon. Chrome's official instructions: https://support.google.com/chrome/answer/9658361

See [v1.5.16 release notes](wordpress-plugin/v1.5.16/README.md), [release manifest](wordpress-plugin/v1.5.16/RELEASE_MANIFEST.md), [source change record](wordpress-plugin/v1.5.16/SOURCE_CHANGESET.md) and [Git release policy](GIT_RELEASE_POLICY.md).

## Previous release
See [v1.5.15 release notes](wordpress-plugin/v1.5.15/README.md) for blank LOS slots and menu customization.
