# Source evidence

One file per guide. Read only the file for the component you are working on.
A new guide also gets `<slug>.brief.md`: the planner's brief with the page's
final copy (format in the `coin-component-docs` skill, `references/brief.md`).

| Guide slug | Evidence |
| --- | --- |
| accordion | [accordion.md](accordion.md) |
| accordioncheckbox | [accordioncheckbox.md](accordioncheckbox.md) |
| actionfooter | [actionfooter.md](actionfooter.md) |
| actiontile | [actiontile.md](actiontile.md) |
| additem | [additem.md](additem.md) |
| allocationcomparisonchart | [allocationcomparisonchart.md](allocationcomparisonchart.md) |
| amountinput | [amountinput.md](amountinput.md) |
| appbar | [appbar.md](appbar.md) |
| arealinechart | [arealinechart.md](arealinechart.md) |
| attached | [attached.md](attached.md) |
| autoplaycontrol | [autoplaycontrol.md](autoplaycontrol.md) |
| avatar, avatargroup | [avatar-and-avatargroup.md](avatar-and-avatargroup.md) |
| badge | [badge.md](badge.md) |
| bottomnavitem | [bottomnavitem.md](bottomnavitem.md) |
| brandchip | [brandchip.md](brandchip.md) |
| button, hstack, vstack, stack, breadcrumbs | [button-and-layout.md](button-and-layout.md) |
| buttongroup | [buttongroup.md](buttongroup.md) |
| checkbox | [checkbox.md](checkbox.md) |
| checkboxitem | [checkboxitem.md](checkboxitem.md) |

## New guides

Add `docs/evidence/<slug>.md` with these sections, and a row above:

```md
# <Display name> source evidence

## Checked
Date; declared, installed, and registry `latest` jfs-components versions.

## Sources
Figma node link and id; Storybook docs URL and the story ids used on the page.

## Contract
Public props, variants, slots, and owning modes; defaults; what is
designer-configurable, system-driven, or developer-only.

## Limits
Package/Figma/Storybook discrepancies and accessibility findings the page
must not contradict.

## Verification
Build, self-check result at 1280 and 390 px, interactions checked.
```
