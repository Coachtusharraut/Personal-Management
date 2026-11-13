# Eagle Structure — LifeOS

**Live app:** https://coachtusharraut.com/life/  
**Current release:** Eagle Structure LifeOS v1.5.3  
**Canonical Git branch:** `main`

This repository is the source of truth for the current LifeOS project. The previous Personal Management prototype remains recoverable in Git history.

## Current product

Eagle Structure LifeOS is a private dashboard for the Sahyadri campaign, recursive missions and subtasks, partner network/PV tracking, attachments, YouTube resources, potential-partner follow-up, and the Life & Business Logbook.

The live WordPress page is protected by its existing LifeOS password. The current v1.5.3 release adds an independent potential-partner pipeline without changing the actual partner tree.

## v1.5.3 potential-partner pipeline

- The Partner Network Add leg button is now plus-only.
- The people icon opens the Potential Partners manager.
- Each prospect has a name, notes and one follow-up state: green (Add to LOS), yellow (Need to contact), red (Contacted and declined).
- The full partner graph shows a separate prospect rail on the far left.
- Prospects remain outside the real partner hierarchy. They do not affect legs, partner count, PV, GPV, PIN qualification or downlines.
- Prospect data is stored in the shared LifeOS state and syncs across devices.

See [v1.5.3 release notes](wordpress-plugin/v1.5.3/README.md) and [GIT_RELEASE_POLICY.md](GIT_RELEASE_POLICY.md).
