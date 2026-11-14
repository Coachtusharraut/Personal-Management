# Eagle Structure — LifeOS

**Live app:** https://coachtusharraut.com/tsr/  
**Currently deployed release:** Eagle Structure LifeOS v1.5.15.1  
**Canonical Git branch:** main

Eagle Structure LifeOS is a private, mobile-first dashboard for Sahyadri fort milestones, tasks, a partner PV hierarchy, Potential Partners, Personal Assets, the Life & Business logbook and Daily Growth.

## Current deployment — v1.5.15.1

- Tasks now appear before Partner Network on the dashboard: **Sahyadri map/stats → Tasks → Partner Network**.
- The existing v1.5.15 LOS features are restored: add blank partner reminder slots, fill them later, customize partner-tier colours and labels, and customize menu labels/icons/visibility/order.
- Partners at 3% or above default to green. Below-3% partners and blank reminder slots have separate customizable colours.
- Blank slots do not contribute to partner counts, PV, GPV or PIN qualification.
- The app remains on the existing /tsr/ page (WordPress page ID 900135) and uses the same shared LifeOS state.

See [v1.5.15.1 release notes](wordpress-plugin/v1.5.15.1/README.md), [release manifest](wordpress-plugin/v1.5.15.1/RELEASE_MANIFEST.md), [source change record](wordpress-plugin/v1.5.15.1/SOURCE_CHANGESET.md) and [deployment record](DEPLOYMENT_2026-11-14_v1.5.15.1.md).

## Baseline and data

This release is based on the archived v1.5.15 installer, with only the dashboard section order changed and the plugin/cache version bumped. Existing shared WordPress state is retained; the plugin continues using the tr_eagle_shared_state option and access page ID 900135.

The complete installable plugin source and assets are in the versioned ZIP archived in the Project Library and delivered with the release. GitHub contains the release documentation and change record; the individual raw plugin files are not committed separately in this repository snapshot.
