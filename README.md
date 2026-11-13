# LifeOS · Eagle Structure

**One mission:** six team legs · ten Core IBOs in each · 3%+ per leg.

## Live app
https://coachtusharraut.com/life/

The active WordPress plugin is **Eagle Structure LifeOS v1.1.0** on WordPress page `900135`. The page is password protected and does not appear in the public site navigation.

The live WordPress edition stores app records in the WordPress database. It does not require Firebase.

## Level 1
**Motivational Interviewing Book Study**

Eight bite-sized quests with tickable subtasks, XP and ranks. The quest outline is an editable starter; future levels and learning content are intentionally left for Coach Tushar to define rather than guessed.

## v1.1.0
- Emoji-labelled six wings.
- Edit and delete people/IBO entries.
- Cascade linked edits and deletes across pipeline, IBO and related activity records.
- Level 1 quest/subtask board.
- XP and six visible ranks.
- Last-ten-change undo/redo.
- In-app Field Guide.
- Eagle Assistant local command helper with preview/apply/undo for supported structural changes.

**AI status:** the assistant is not connected to a generative model yet. It currently parses a limited set of explicit local commands. No AI-provider API key is configured.

## WordPress plugin recovery
The exact v1.1.0 installable ZIP is archived as ten base64 text parts in:

`wordpress-plugin/installer-v1.1.0/`

See [the v1.1.0 recovery guide](wordpress-plugin/installer-v1.1.0/README.md). Reconstruct it with the command there and verify the supplied SHA-256 before reinstalling.

The original React/Firebase implementation remains in this repository for future development. It is not the live WordPress edition.

## Data/device note
The current WordPress version uses a per-browser private session identity (up to 30 days). It does not auto-sync records between separate browsers/devices. Use the app's Export Backup / Restore to move records between devices and keep a separate copy.
