# Eagle Structure — LifeOS

**Live app:** https://coachtusharraut.com/tsr/  
**Currently deployed release:** Eagle Structure LifeOS v1.5.14  
**Canonical Git branch:** `main`

Eagle Structure LifeOS is a private, mobile-first dashboard for Sahyadri fort milestones, recursive tasks, archiving, LOS, potential partners, Personal Assets, the Life & Business logbook and daily growth.

## Current deployment — restored v1.5.14

On 14 November 2026, the live WordPress plugin was restored to the exact archived **v1.5.14** installer and the existing LifeOS page was moved to the new `/tsr/` address.

- WordPress confirms Eagle Structure LifeOS **v1.5.14 active**.
- The exact installer checksum matches the v1.5.14 release manifest.
- The original protected page ID `900135` was retained and its slug changed from `life` to `tsr`, preserving the page-password check used by v1.5.14.
- The temporary `/tar/` page was moved to Trash.
- No site reset or shared-state deletion was performed.

See [deployment restoration record](DEPLOYMENT_ROLLBACK.md), [v1.5.14 release notes](wordpress-plugin/v1.5.14/README.md), [release manifest](wordpress-plugin/v1.5.14/RELEASE_MANIFEST.md) and [source change record](wordpress-plugin/v1.5.14/SOURCE_CHANGESET.md).

## Repository note

The complete installable plugin source and assets are contained in the versioned v1.5.14 ZIP archived in the project Library. The GitHub release folder contains release notes, manifest and source-change record; the raw plugin source files are not committed individually in this repository snapshot.
