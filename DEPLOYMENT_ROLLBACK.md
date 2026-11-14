# Live deployment rollback — 14 November 2026

## Result

The live WordPress site `https://coachtusharraut.com` was rolled back from Eagle Structure LifeOS v1.5.18 to the exact archived **v1.5.15** installer.

## Exact installer used

- Archive: `eagle-structure-lifeos-v1.5.15.zip`
- Archive SHA-256: `157f1388d5442ef50bc7e1ae939373d20c7a9766d7d266a23c223dee4c8eb6b8`
- Archive size: 776,079 bytes
- Plugin header verified: `1.5.15`
- ZIP test: passed
- Plugin directory: `eagle-structure-lifeos/`
- WordPress post-install check: version `1.5.15`, status `active`, no update available.

## Reason

The user's Android phone continued to show the eagle-only loading screen for approximately 30 seconds, then displayed the startup recovery panel. The later startup releases (v1.5.16–v1.5.18) did not resolve the observed on-device cold-start failure. The user explicitly requested a restoration of v1.5.15.

The precise failing HTTP request or JavaScript exception from the phone has not been captured, so the root cause is still undiagnosed. This rollback restores the known earlier plugin build; it is not a claim that the original cold-start issue has been conclusively root-caused.

## Data safety

The plugin files were overwritten through the WordPress plugin installer. The shared LifeOS workspace is stored separately from the plugin package; no site reset, database reset or shared-state deletion was performed.

## Verification limits

WordPress plugin listing confirmed v1.5.15 active. A fresh WordPress screenshot capture returned ready, but it did not test the user's authenticated mobile session. The final functional check must be performed by opening the app on the user's Android device.

## Source availability

The exact archived v1.5.15 installer remains in the user's project Library and is checksum-identified above. This repository contains deployment/release documentation; it does not store the complete raw plugin source as individual tracked files.
