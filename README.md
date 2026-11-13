# LifeOS · Eagle Structure

**The single mission:** Build six team legs, each with ten Core IBOs, with every leg reaching 3%+.

## Live WordPress edition

The currently installed app runs directly on the WordPress site at:

- https://coachtusharraut.com/life/
- WordPress page ID: `900135`
- Plugin: **Eagle Structure LifeOS v1.0.0**
- Storage: WordPress database (no Firebase required)
- Access: password-protected page

The WordPress plugin is in `wordpress-plugin/`. The exact installable ZIP is archived as base64 parts in `wordpress-plugin/installer-b64/`. Follow `wordpress-plugin/README.md` to reconstruct it and verify the SHA-256 before installing.

## What the app tracks

- Six team wings.
- Ten Core IBOs per wing.
- 3%+ qualification target per wing.
- Core IBO status requires all three: meeting attended, booking made and business active.
- Unlimited people / conversations, pipeline stages, bookings, meetings, follow-ups and business activities.
- Eagle progress, Eagle Council characters, celebration and setback feedback.
- JSON export and restore from Settings.

## Data and recovery

The WordPress edition stores data in the WordPress database under a private browser-session key. The session lasts up to 30 days. It does not automatically merge data between different browsers/devices, so export a JSON backup periodically and restore it on the other device when needed.

Two recovery locations are maintained in this repository:

- Working branch: `tushar-lifeos`
- Dated recovery branch: `backup/eagle-structure-2026-11-13`

Both contain the original React/Firebase project, the WordPress installer archive parts and the recovery instructions.

## Original React/Firebase edition

The React/Firebase code is retained for future development or an alternate deployment. Firebase is not used by the current WordPress edition. Its deployment workflow is manual-only because it requires a Firebase service-account secret.
