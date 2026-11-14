# Source change record — v1.5.15.1

## Base
Exact archived v1.5.15 package (SHA-256 157f1388d5442ef50bc7e1ae939373d20c7a9766d7d266a23c223dee4c8eb6b8).

## Changed files
- assets/eagle.js: change the dashboard composition from dashboard → Partner Network → Tasks to dashboard → Tasks → Partner Network.
- eagle-structure-lifeos.php: bump plugin/runtime version and service-worker cache/asset version to 1.5.15.1.
- README.md: release summary.

## Retained from base v1.5.15

### Blank LOS partner slots
- normalisePartner supports isBlank placeholders at non-root levels.
- Blank reminders have no name and can be filled later.
- partnerGroupPV, partnerCount and branchPeople exclude blank entries.
- Blank entries cannot host children or become a drag/drop parent.

### LOS colour settings
- Qualified Pin colour default: #2EAA67.
- Below-threshold colour default: #4296D5.
- Blank-slot colour default: #E5B83F.
- Three labels and three colours are editable in LOS settings.

### Menu settings
- Rename each supported menu label.
- Change emoji/icon.
- Toggle visibility.
- Reorder with up/down controls.
- Existing menu IDs and destinations are retained.

No changes were made to the data storage option, access page ID, task hierarchy schema, partner hierarchy schema, attachments or REST endpoints.
