# Eagle Structure LifeOS — WordPress Edition v1.1.0

## One mission
Build six team legs. Each leg aims for ten Core IBOs and 3%+ performance.

The first learning/growth level currently seeded in the app is:

# Level 1 — Motivational Interviewing Book Study

The app includes eight small quests with tickable subtasks:
1. 🎒 Prepare your study space
2. 🧭 Understand the MI spirit
3. 🗣️ Learn OARS
4. 🔍 Recognise change talk
5. 🌱 Respond without arguing
6. 🎯 Guide a conversation
7. 🤝 Practise with real people
8. 🏆 Your MI field guide

The task structure is a starter framework. Add, rename, reorder or remove tasks and levels as your actual book edition and learning plan become clear. It deliberately does not assume a particular chapter order or page numbering.

## What's new in v1.1.0
- 🦁 🐯 🐺 🐘 🦚 🦅 Six emoji-labelled wings rather than generic Team 1–6 labels.
- Edit people and IBO records rather than only deleting them.
- Linked edits propagate across the people pipeline, team/IBO records and associated activity entries.
- Deleting a person or IBO removes its linked records and dependent activity log entries, avoiding stale duplicates on other screens.
- Level 1 quests and subtasks are tickable.
- XP and six visible ranks: Nestling, First Flight, Wing Builder, Sky Rider, Eagle Master, Sky Architect.
- Last-ten-change history with undo/redo.
- Field Guide documentation inside the app.
- Eagle Assistant command helper with preview/apply/undo for supported changes.

## Important AI limitation
The small Eagle Assistant is currently a local command helper, not a connected generative AI model. It recognises supported direct commands such as creating a level, adding a task/subtask, renaming a wing, removing a task, and undoing the last change. It previews the change before applying it. A model provider/API connection and securely stored server-side key are not configured yet, so do not treat it as an unrestricted chat-based AI agent.

## Data and device behaviour
- App records are stored by the WordPress plugin in the WordPress database.
- The application currently uses a private browser-session identity with an expiry of up to 30 days.
- This means data is not automatically merged between different browsers/devices.
- Use the app's Export Backup / Restore function regularly and when moving to another device.
- The page itself is password protected in WordPress. The currently configured page password is `admin`; change it to a strong password before sharing the URL.

## Live WordPress installation
- URL: https://coachtusharraut.com/life/
- WordPress page ID: `900135`
- Plugin: Eagle Structure LifeOS `1.1.0`
- Shortcode on the page: `[eagle_structure_lifeos]`
- Backend: WordPress REST + database. Firebase is not required for this edition.

## Exact installer archive and recovery
The complete installable ZIP is archived in ten base64 text parts:
`wordpress-plugin/installer-v1.1.0/part-00.txt` through `part-09.txt`.

Run from the repository root:

```bash
cat wordpress-plugin/installer-v1.1.0/part-*.txt | tr -d '\n' | base64 -d > eagle-structure-lifeos-v1.1.0.zip
sha256sum eagle-structure-lifeos-v1.1.0.zip
```

Expected SHA-256:
`0f9d0f49cd78eee56b4cf24c3008bd15ed34ad31e4431c19277017ac42f6246e`

Install or restore from WordPress Admin → Plugins → Add New Plugin → Upload Plugin. Upload the reconstructed ZIP. Keep the existing data option when replacing plugin code; do not delete the plugin's stored settings unless you intentionally want to reset data.

The ZIP includes the actual PHP plugin entry point, JavaScript application, CSS styles, and bundled README. It is a full source-and-installer recovery copy.

## GitHub recovery
- Working branch: `tushar-lifeos`
- Dated recovery branch: `backup/eagle-structure-2026-11-13`
- Original React/Firebase code is retained in the same repository as a separate future-development edition. The active live WordPress edition does not require Firebase.
