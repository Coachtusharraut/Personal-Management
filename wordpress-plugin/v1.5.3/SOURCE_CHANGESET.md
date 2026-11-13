# v1.5.3 source change set

The corresponding installable package is `eagle-structure-lifeos-v1.5.3.zip`. Its source is based on the v1.5.2 package and includes the following modifications.

## Files changed

### `assets/eagle.js`
- Adds independent `prospects[]` records to the LifeOS state model.
- Preserves prospect records during normalisation and shared/local state merging.
- Implements add, edit, delete, status change and notes editing in the Potential Partners manager.
- Uses three status keys: `add` (green / ready to add to LOS), `contact` (yellow / needs contact), and `declined` (red / contacted and declined).
- Adds the people-list control next to the Partner Network header.
- Changes Add leg to a plus-only affordance.
- Adds a separate prospect rail to the full graph. Each name chip opens its editor.
- Keeps prospects independent of partner records and all partner calculations.

### `assets/eagle.css`
- Styles the separate prospects manager, status controls, coloured name chips and side rail.
- Keeps the real partner graph in its own viewport column.
- Adds compact mobile rail layout so prospect chips do not overlay the partner graph.

### `eagle-structure-lifeos.php`
- Advances plugin version to 1.5.3.
- Advances static asset/service-worker cache versions to ensure the new assets load.

## Data separation invariant

Prospects are stored in `state.prospects[]`; actual legs continue to be stored in `state.partners`. The prospect pipeline must never append prospects to `state.partners`, and must not change PV, GPV, partner count, PIN qualification, partner percentages, downline count or graph edges.

## Validation

- JavaScript syntax check passed.
- PHP syntax check passed.
- Installer ZIP integrity check passed.
- Live WordPress plugin inventory confirms Eagle Structure LifeOS 1.5.3 is active.

See `README.md` and `RELEASE_MANIFEST.md` in this release folder for package checksum and release details.
