# Eagle Structure LifeOS — v1.5.15

**Live app:** https://coachtusharraut.com/life/  
**Plugin:** Eagle Structure LifeOS v1.5.15  
**Installed:** 14 November 2026  
**Package:** `eagle-structure-lifeos-v1.5.15.zip`

## Blank partner reminder slots

- Added a compact blank-slot control in the Partner Network header and beside each real partner's actions.
- A blank slot appears in the partner hierarchy as a visible reminder: “Blank partner slot — Fill this space later”.
- Tap ＋ on the placeholder to enter a partner name and Personal PV. Saving it converts the same stable slot into a normal partner.
- Blank slots have no PV and cannot contain children.
- Blank slots are excluded from partner counts, group PV, GPV, PIN levels, branch people totals and downline counts.
- Drag-and-drop can reorder a blank slot, but cannot drop a partner inside a blank slot and make the placeholder a parent.

## Customizable LOS colours

The 🎨 control opens LOS colour settings. The defaults are:
- **Pin 3% and above:** green (`#2EAA67`)
- **Below 3%:** blue (`#4296D5`)
- **Blank slot:** amber (`#E5B83F`)

You can change the colour and the label for all three categories at any time. The new colours apply to dashboard partner cards and the full LOS hierarchy. The PIN thresholds and all PV calculations remain unchanged.

## Customizable top-right menu

Choose **Customize menu** at the bottom of the hamburger menu to:
- Rename each built-in menu item.
- Change its emoji/icon.
- Show or hide it.
- Move it up or down to change its order.

These controls change the menu presentation only. Each item keeps its original destination and function. A dedicated Customize menu action remains available even when menu items are hidden.

## Data safety

- New fields are additive: partner placeholders, LOS colour preferences and menu preferences.
- Existing partner IDs, names, Personal PV, profiles and update histories are preserved.
- Blank placeholders never enter PV or partner-count formulas.
- Offline/local custom LOS colours and menu preferences are merged into shared state if the remote copy has not received these fields yet.
- The release does not change task, prospect, Daily Growth, Personal Assets or journal features.

## Validation

- JavaScript syntax check: passed.
- PHP syntax check: passed.
- Focused Node tests: passed for blank-slot normalization, blank exclusion from PV/counts, menu rename/icon/visibility/order normalization, and parent-drop protection.
- ZIP integrity test: passed.
- Live WordPress plugin list: v1.5.15, active.

## Artifacts

- Installer: `eagle-structure-lifeos-v1.5.15.zip`
- Installer SHA-256: `157f1388d5442ef50bc7e1ae939373d20c7a9766d7d266a23c223dee4c8eb6b8`
- Source patches: `eagle-structure-lifeos-v1.5.15-patches.zip`
- Patches SHA-256: `4590f62e3b3dc5950d21bf1820ba43357d8764f27c5f774bad9c7b20ad43d8e2`

The installable ZIP contains the complete plugin source. The GitHub release folder contains release documentation and the source-change record, not each raw plugin source file individually.
