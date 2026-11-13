# Eagle Structure LifeOS — v1.5.14

**Live app:** https://coachtusharraut.com/life/  
**Plugin:** Eagle Structure LifeOS v1.5.14  
**Installed:** 13 November 2026  
**Package:** `eagle-structure-lifeos-v1.5.14.zip`

## Daily Growth task resources

Daily Growth tasks now have the same resource fields and preview capability as normal tasks.

When adding or editing a daily task, you can include:
- Notes / instructions.
- A YouTube or webpage URL.
- Multiple file attachments: PDFs, images, audio, video and other supported files (10 MB per file).

After saving, a small 📎 button appears on that daily task. Tap it to show or hide its resource panel:
- YouTube links play in the embedded LifeOS player, with Full screen / Minimise.
- PDFs open in the in-app scrollable PDF preview.
- Supported image, audio and video files open in the in-app preview.
- Web links open in the in-app reader. Some websites block embedding; those can use the Open outside option.

Attachments are stored through the same private WordPress attachment endpoint used by normal tasks. Daily task notes, links and attachment IDs are preserved in the shared LifeOS state. Removing a daily-task attachment removes it from that specific task and its private attachment record.

## One combined Personal Assets library

The previous separate Self Talk, My PDFs and My Notes panels have been replaced by one **Instant Assets** section.

Use its single plus button to add one of:
- Self Talk.
- A personal note.
- A YouTube video.
- A webpage link.
- A file (PDF, supported video, audio or image).

Every item appears in the same library with an icon and type label. Open/edit/delete actions are available on each item. YouTube opens in the embedded player; web links open in the in-app reader; PDFs and supported media use the attachment preview.

### Existing data preservation

Older saved entries remain in the same `assets` collection:
- Existing Self Talk remains a Self Talk item.
- Existing notes remain Note items.
- Existing PDFs remain file items and retain their attachment IDs.

Nothing is split into new collections or intentionally discarded. The library is now a single combined view. State normalization was extended to retain resource URLs and attachment MIME/kind metadata for new item types.

## Release validation

- JavaScript syntax check: passed.
- PHP syntax check: passed.
- ZIP integrity test: passed.
- Focused unit smoke checks: Daily Growth notes / YouTube link / PDF fields; legacy Self Talk and PDF normalization; YouTube player markup; Growth attachment-removal scope.
- Live WordPress plugin list: v1.5.14, active.
- Installer SHA-256: `a696e2998623adc3b176944239e4b687ffa6f7f451ceebdd1b24ec8accd897a2`
- Patch archive SHA-256: `dffc810e0ab60b7d0a2fbefdefb655ca0bd980bd6d931c00d0efbcf333d368f8`
