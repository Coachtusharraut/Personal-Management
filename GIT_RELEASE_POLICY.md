# LifeOS Git Release Policy

This repository is the long-term source of truth for Coach Tushar's LifeOS website.

## Branch rules

1. `main` is the canonical, deployable version.
2. `tushar-lifeos` is the working branch. Merge completed changes into `main` so both branches stay aligned.
3. Never force-push, reset, or overwrite history. Use ordinary commits and merges so previous versions remain recoverable.
4. Do not leave a completed website update only in Antigravity, a ZIP, WordPress, or a local folder. Commit the source changes to Git as part of completing the update.

## Every website update

1. Update the actual application source, styles, assets, and any required configuration.
2. Update the version and release notes where applicable.
3. Check that no passwords, API keys, Firebase service-account files, database exports, or private client attachments are included.
4. Build/test the changed app where the project supports it.
5. Commit with a clear message describing the version and the user-visible change.
6. Push/merge to `main`; keep `tushar-lifeos` synchronized.

## Stable releases

- Use semantic version tags such as `v1.5.3`, `v1.6.0`, and `v2.0.0`.
- Add a release note snapshot under `wordpress-plugin/vX.Y.Z/README.md` for each WordPress plugin release.
- Keep each installable plugin ZIP and its SHA-256 checksum with the corresponding release. Do not replace an older release with a newer ZIP.
- Verify the commit, tag, source files, and installer checksum before calling a release complete.

## Legacy project

The earlier Personal Management project remains in the repository's prior commit history. It should not be restored to the current working tree unless explicitly requested.
