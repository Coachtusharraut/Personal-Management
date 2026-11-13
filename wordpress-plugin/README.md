# Eagle Structure LifeOS — Recovery Package

This folder contains the exact installable WordPress plugin ZIP used on:

- Live page: https://coachtusharraut.com/life/
- WordPress plugin: Eagle Structure LifeOS v1.0.0
- WordPress page password: set in WordPress (currently `admin`)

## Reconstruct the plugin ZIP

The archive was split into base64 text parts to preserve it safely in GitHub's text-file storage.

Run this from the repository root:

```bash
cat \
  wordpress-plugin/installer-b64/part-00.txt \
  wordpress-plugin/installer-b64/part-01.txt \
  wordpress-plugin/installer-b64/part-02.txt \
  wordpress-plugin/installer-b64/part-03.txt \
  wordpress-plugin/installer-b64/part-04-00.txt \
  wordpress-plugin/installer-b64/part-04-01.txt \
  wordpress-plugin/installer-b64/part-04-02.txt \
  wordpress-plugin/installer-b64/part-04-03.txt \
  wordpress-plugin/installer-b64/part-04-04.txt \
  wordpress-plugin/installer-b64/part-04-05.txt \
  wordpress-plugin/installer-b64/part-04-06.txt \
  wordpress-plugin/installer-b64/part-04-07.txt \
  wordpress-plugin/installer-b64/part-04-08.txt \
  wordpress-plugin/installer-b64/part-04-09.txt \
  wordpress-plugin/installer-b64/part-04-10.txt \
  wordpress-plugin/installer-b64/part-04-11.txt \
  wordpress-plugin/installer-b64/part-04-12.txt \
  wordpress-plugin/installer-b64/part-04-13.txt \
  wordpress-plugin/installer-b64/part-04-14.txt \
  wordpress-plugin/installer-b64/part-04-15.txt \
  wordpress-plugin/installer-b64/part-04-16.txt \
  wordpress-plugin/installer-b64/part-04-17.txt \
  wordpress-plugin/installer-b64/part-04-18.txt \
  wordpress-plugin/installer-b64/part-04-19.txt \
  wordpress-plugin/installer-b64/part-05.txt \
  wordpress-plugin/installer-b64/part-06.txt \
  | tr -d '\n' | base64 -d > eagle-structure-lifeos.zip
```

Verify the recovered ZIP:

```bash
sha256sum eagle-structure-lifeos.zip
```

Expected SHA-256:

`7a5d5f44ed74f19d388401267c95d60a3b0af79e1afb782801fd1431782c5225`

Then install it in WordPress:
**Plugins → Add New Plugin → Upload Plugin → choose eagle-structure-lifeos.zip**.

## What is in the live WordPress edition

- Six team wings, each targeting 10 Core IBOs.
- A Core IBO counts only after meeting attended, booking made and business activity are all checked.
- 3%+ target recorded per leg.
- People / conversation pipeline, meeting and follow-up stages.
- Daily business-action log.
- Eagle progress board, visual character cards and win/setback feedback.
- WordPress REST + database storage. No Firebase project is required for this edition.

The page remains password protected and is not in the public navigation. The current page password is `admin`; change it to a strong private password from WordPress before sharing the URL.

## Source project

The original React/Firebase implementation is preserved on the `tushar-lifeos` branch. The WordPress plugin ZIP in this folder is the standalone no-Firebase live edition.
