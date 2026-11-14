# Eagle Structure — LifeOS

**Live app:** https://coachtusharraut.com/life/  
**Currently deployed release:** Eagle Structure LifeOS v1.5.15  
**Canonical Git branch:** `main`

Eagle Structure LifeOS is a private, mobile-first dashboard for Sahyadri fort milestones, recursive tasks, archiving, LOS, potential partners, Personal Assets, the Life & Business logbook and daily growth.

## Current deployment — rollback to v1.5.15

On 14 November 2026, the live plugin was restored to the exact archived v1.5.15 installer after later v1.5.16–v1.5.18 startup changes continued to leave the mobile app on the eagle/restore screen.

- WordPress confirms Eagle Structure LifeOS **v1.5.15 active**.
- The restored archive was verified: correct plugin directory, v1.5.15 header, assets present and ZIP integrity passed.
- The rollback replaces plugin files only. It does not intentionally reset shared LifeOS state.
- Do not reinstall v1.5.16, v1.5.17 or v1.5.18 until the mobile cold-start issue is diagnosed and verified on-device.

See [rollback record](DEPLOYMENT_ROLLBACK.md), [v1.5.15 release notes](wordpress-plugin/v1.5.15/README.md), [v1.5.15 release manifest](wordpress-plugin/v1.5.15/RELEASE_MANIFEST.md) and [v1.5.15 source change record](wordpress-plugin/v1.5.15/SOURCE_CHANGESET.md).

## Repository note

The versioned installable plugin package is archived separately from this documentation tree. The GitHub release directories contain release notes, manifests and source-change records; they do not contain every raw PHP, JavaScript, CSS and image asset as individual files.
