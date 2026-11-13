# Eagle Structure LifeOS — v1.5.0

**Live app:** https://coachtusharraut.com/life/  
**Plugin:** Eagle Structure LifeOS v1.5.0  
**Page:** 900135

## Dashboard
- One scrollable dashboard; bottom navigation removed.
- Campaign map has a bottom-to-top Sahyadri route, with one fort per top-level mission.
- Partner Network and My Missions appear on the same dashboard.
- Logbook remains in the top-right menu.

## Recursive missions
- Tasks support unlimited practical nesting (parent → child → grandchild and deeper).
- Any node can be a task or a container with children.
- Leaf actions can be checked; parent progress is calculated from all descendant leaf actions.
- Mission progress is completed leaf actions / total leaf actions. Overall progress uses all leaf actions.
- Add/edit/remove works at every depth.
- Each node can store optional notes, one resource link and PDF attachments.
- PDFs are stored as private WordPress database options and served only through page-password-protected REST endpoints. Limit: 5 MB per PDF.

## Partner Network
Seeded from the supplied whiteboard and fully editable:
- Tushar
  - Dr. Surekha
  - Pratik → Nisha → Shadab; Pratibha → Reshma
  - Gurleen → Anjali → Kavita; Gopi
  - LN Dubai (M) → Shikha → Usha; Other Client
  - LN (F) → Bharti → Siddhi; Meena; Other Client
  - Aheri / Sakshi → Alisha → Uroosa

All Personal PV values start at zero. Each partner can be added, edited or removed at any depth. Group PV is calculated recursively as personal PV plus the full downline. Tushar's own Personal PV is included in total Group PV. Qualification-percentage rules are deliberately not invented and can be added once supplied.

## Migration and shared access
- Uses the existing single LifeOS page password across devices.
- Existing v1.4.4 task IDs, checkmarks and Logbook data are preserved.
- Legacy one-level subtasks convert to recursive children.
- A default partner network is seeded only when none exists.
- Each device merges available prior local backup data by stable IDs on first open.

## Installer
Exact installable ZIP attached in the current ChatGPT conversation: eagle-structure-lifeos-v1.5.0.zip.

SHA-256: 187d6f3a31c433d20708fada8c71b562d645ecb9ecb083ca43403cc63363df3c

The previous v1.4.4 implementation is preserved on backup/eagle-structure-2026-11-13-v1.4.4.
