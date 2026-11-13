# Eagle Structure LifeOS — v1.5.8

**Live app:** https://coachtusharraut.com/life/  
**Plugin:** Eagle Structure LifeOS v1.5.8  
**Installed:** 13 November 2026  
**Package:** `eagle-structure-lifeos-v1.5.8.zip`

## Fort-name fit and contrast
- Each milestone label calculates its width from the fort name.
- The fort name is rendered with SVG text-length adjustment so the full name stays inside the label boundary, including longer names such as Sinhagad and Purandar.
- Label contrast is strengthened with a solid, high-contrast label surface.

## Top-right mobile menu
- Removed numeric badges from Life & Business and Archived Tasks menu items.
- Menu item labels are constrained to the available width and ellipsized rather than overflowing.

## Google Calendar status
- Existing optional time-based task Calendar handoff remains available.
- Automatic creation on task save is not active. It requires the user to authorize the correct Google account using OAuth and grant Calendar event write access.
- No Google email/account ID or OAuth grant is stored for LifeOS. Saving an email/ID in the app would not be a safe substitute for authorization.
- Non-time-based tasks remain excluded from the Calendar handoff.

## Data preservation
No shared-state schema or task/partner data model changes in this release.

## Validation
- JavaScript syntax: passed.
- PHP syntax: passed.
- ZIP integrity: passed.
- Fort label width and SVG text-fit checks: passed.
- Top-right menu count badges removed.
- Live WordPress plugin list: v1.5.8, active.
- Installer SHA-256: `dc031de2705cd3e4207c13f6ad939d66a678db4dd5703e6af598f1f1da29031f`
- Patch archive SHA-256: `86e135c56b542d9e4e2de59796b4bfe81c6bff9763c2284da1076afdba7e459d`
