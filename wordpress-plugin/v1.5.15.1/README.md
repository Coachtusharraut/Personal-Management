# Eagle Structure LifeOS — v1.5.15.1

**Live app:** https://coachtusharraut.com/tsr/  
**Plugin:** Eagle Structure LifeOS v1.5.15.1  
**Installed:** 14 November 2026  
**Base:** exact archived v1.5.15 installer, with a dashboard-order patch.

## Dashboard order

The dashboard now renders sections in this order:

1. Sahyadri map and stats.
2. **Tasks**.
3. **Partner Network / Partner Management**.

No other dashboard section or task/partner data structure is changed.

## LOS blank partner reminder slots

- Add a blank slot from the Partner Network heading or beside an existing real partner.
- The placeholder has no name and is visibly labelled as a reminder to fill later.
- Use its plus button to enter the next partner's name and PV.
- A blank slot cannot contain children and cannot be selected as a parent in drag-and-drop.
- Blank slots are excluded from real partner counts, branch people counts, group PV, GPV and Pin totals.

## Customizable LOS colours

Defaults:
- **Pin 3% and above:** green (#2EAA67).
- **Below 3%:** blue (#4296D5).
- **Blank slot:** amber (#E5B83F).

Open the 🎨 control in Partner Network to change all three colour values and labels. The 3%+ group is determined by the partner's calculated Pin tier.

## Customizable menu

Open the top-right menu and choose **Customize menu**. For each menu item, you can:
- Rename the item.
- Change its emoji/icon.
- Show or hide it.
- Move it up or down.

The menu item IDs and their destination actions remain stable, so customization does not break navigation.

## Page, password and shared data

- Uses the existing LifeOS page ID 900135, now at /tsr/.
- The page password check remains tied to the same page ID.
- Uses the existing shared WordPress option tr_eagle_shared_state.
- No second app database or duplicate workspace was created.
- Existing Tasks, partners, prospects, Personal Assets, attachments, Daily Growth and journal records remain in the shared state.

## Release validation

- JavaScript syntax check: passed.
- PHP syntax check: passed.
- ZIP integrity test: passed.
- Static assertions passed for dashboard order, blank-slot logic, PV/count exclusions, default colours, menu controls, page ID and shared-state option.
- WordPress plugin list: v1.5.15.1, active.
- /tsr/: published, password-protected, page ID 900135.
- Installer SHA-256: e41b7bf62f2ce949133834dedaca862482b064d64bc4b4541cd96725508370da
- Patch archive SHA-256: 44b2eb20a1e3ee8c3a8a54f843cdc3a3f0c4742a03bd8f6a57bd7ff9ac73baa2
