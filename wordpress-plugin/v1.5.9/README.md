# Eagle Structure LifeOS — v1.5.9

**Live app:** https://coachtusharraut.com/life/  
**Plugin:** Eagle Structure LifeOS v1.5.9  
**Installed:** 13 November 2026  
**Package:** `eagle-structure-lifeos-v1.5.9.zip`

## Fixes

### Fort labels
- Kept the existing fort-name font size unchanged.
- Retained the existing fit-to-width behaviour for fort names.
- Increased only the label rectangle's height so the fort name and completed/total count (for example, `0/4`) sit together inside the same bordered label.
- The progress count no longer hangs below the label.

### Sahyadri map header
- Removed the redundant completed/total fort count from the right side of the Sahyadri Map heading.
- This clears the space underneath the floating top-right hamburger menu on mobile; no hidden count is rendered behind it.

### Cache
- Updated plugin version, service-worker cache name and asset query version to v1.5.9.

## Validation
- JavaScript syntax check: passed.
- PHP syntax check: passed.
- ZIP integrity test: passed.
- Live WordPress plugin listing: v1.5.9, active.

## Artifact checksums
- Installer SHA-256: `bf4822a68f6e850cc51528551bb4d5ec9ed5b0b9cd8f529ec5f2e0b2ac3d8f3a`
- Source-patch ZIP SHA-256: `a5fecd7b39fc6675b05bc544ae32596bec52c1e5a411d2fbb9753bdac4b1c380`

The complete plugin source is in the installable ZIP delivered with this release. This GitHub release folder contains the release notes, manifest and change summary.
