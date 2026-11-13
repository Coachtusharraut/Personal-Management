# Source change record — v1.5.14

## Files changed in the installable package

- `assets/eagle.js`
- `assets/eagle.css`
- `eagle-structure-lifeos.php`
- `README.md`

## Implementation summary

### Daily Growth
- Extended `normaliseGrowthTask` with `notes`, `resourceUrl`, `attachments[]` and `resourceExpanded`.
- Added the same notes / link / multiple-file fields used by normal task editing.
- Daily task row shows a compact 📎 resources toggle when resource content exists.
- Reused the normal task `nodeDetails` renderer for YouTube, webpage, note and attachment previews.
- Reused the private attachment upload / preview / delete endpoints and scoped attachment removal to Growth task IDs.
- Extended Growth merge logic to retain notes, links and union attachment IDs across device-state merges.

### Instant Assets
- Expanded the Personal Asset schema to support `self-talk`, `note`, `file`, `youtube` and `link`, retaining attachment MIME/kind metadata.
- Replaced separate Self Talk, My PDFs and My Notes panels with one unified Instant Assets list.
- Added one add/edit form with type selection, text, URL and file input.
- Added in-app YouTube preview and reused attachment / webpage previews for saved items.
- Kept previous Self Talk, notes and PDF asset records in the existing shared `assets` collection.

### Versioning
- State schema version 13.
- Plugin header, runtime constant, asset URLs and service-worker cache set to 1.5.14.

## Repository/source availability

The complete installable v1.5.14 source is in the versioned ZIP delivered with this release. This GitHub folder records the notes, manifest and source-change summary; raw plugin source files are not committed here as individual files.
