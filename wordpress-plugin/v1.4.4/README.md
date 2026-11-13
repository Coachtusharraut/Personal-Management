# Eagle Structure LifeOS — v1.4.4

**Live app:** https://coachtusharraut.com/life/  
**Plugin:** Eagle Structure LifeOS v1.4.4

## Access
The WordPress `/life/` page password is the only credential. Enter that same password on every device. No WordPress username, email or account password is needed. The shortcode now opens the dashboard directly after the page password is accepted.

REST API access checks the WordPress page-password cookie, a per-page anonymous WordPress nonce, and same-site request origin. The shared server record is stored under the single WordPress option `tr_eagle_shared_state`.

Anyone who knows the page password can access and modify the shared app state. Keep the page private and use a strong, unique passphrase.

## Cross-device data migration
- Imports the v1.4.3 site-owner state once, when present.
- Imports each browser's previous v1.4.2 session state once.
- Merges older browser local backups by stable task, subtask and journal IDs.
- Preserves completed checkmarks and journal records.
- Polls for changes from other devices while open.

## Preserved
All v1.4.3 campaign visuals, mobile layout, dynamic fort map, missions, checkmarks, XP, capture effects and Logbook functionality.

## Installer
Exact plugin package delivered in the current ChatGPT conversation: `eagle-structure-lifeos-v1.4.4.zip`.

SHA-256: `a7f3a1b3b8d008b425b460529d605a2c4980c92c137cc95cdd5f534777e1ed43`

The v1.4.3 code remains preserved on `backup/eagle-structure-2026-11-13-v1.4.3`.
