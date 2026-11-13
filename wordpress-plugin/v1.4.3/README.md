# Eagle Structure LifeOS — v1.4.3

**Live app:** https://coachtusharraut.com/life/  
**Plugin:** Eagle Structure LifeOS v1.4.3

## Cross-device sync
- WordPress database state is keyed to the signed-in WordPress administrator account, not a random browser session.
- The same WordPress administrator account must be used on every device.
- The page password remains a separate privacy lock; each device also signs in to WordPress.
- Existing per-browser v1.4.2 server records are imported/merged once as each browser signs in. Tasks, checkmarks and Logbook entries are merged by stable IDs.
- The browser polls for updates every 15 seconds and refreshes on focus.
- Sync status shows Syncing, Synced or Not synced.
- Each administrator has a separate state record; REST access requires administrator capability and a WordPress REST nonce.

## Mobile UI
- Full-width portrait hero based on the supplied Eagle Structure reference.
- Golden progress panel with progress ring, XP, captured forts, completed steps and rank.
- Full-width responsive Sahyadri map and mission cards.
- Fixed bottom navigation: Home, Tasks, Eagle, Logbook and Progress.
- Safe-area-aware mobile layout and larger touch controls.

## Preserved
All current tasks, subtasks, checkmarks, the Kavita learning entry, Emotional Mastery mission, dynamic fort map, animations and Logbook structure.

## AI status
This release synchronizes structured data between devices. It does not automatically ingest ChatGPT chats or call recordings, and it does not add a connected generative AI provider.

## Installer
Exact WordPress plugin ZIP: `eagle-structure-lifeos-v1.4.3.zip` (delivered in the current ChatGPT conversation).

SHA-256: `899d33f3b5df157e472f05810cfa32de5aa0027d548a89b3c2477c8ce2008c19`

Previous v1.4.2 source state is preserved on `backup/eagle-structure-2026-11-13-v1.4.2`.
