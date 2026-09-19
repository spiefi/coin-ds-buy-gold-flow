# AccordionCheckbox final QA

Checked 19 September 2026 against the local preview at `http://127.0.0.1:4178/?component=accordioncheckbox#overview`. This is a read-only browser QA record; no production source was changed and the existing build was not rerun.

## Shared navigation

- Exact route checks passed for Button, Accordion Checkbox, HStack, VStack, Stack, and Breadcrumbs.
- Every route rendered its expected heading and exactly one matching desktop `aria-current="page"` item.
- The shared desktop registry rendered six distinct SVG icon definitions on every route.
- The mobile component nav rendered all six links, with one matching active item on every route.

## Responsive and anatomy evidence

- Default desktop: actual CSS viewport `1991 × 1127`; document `scrollWidth === clientWidth` (`1991`); console error/warn log query was empty. Five anatomy markers were present and inside the `560 × 380` anatomy frame.
- Intermediate: actual CSS viewport `1024 × 900` (viewport override `819 × 720`, DPR `0.8`); document/body width remained `1024`; all five markers were inside the `390.48 × 380` frame.
- Narrow mobile: actual CSS viewport `390 × 844` (viewport override `312 × 675`, DPR `0.8`); document/body width remained `390`; all six mobile links were visible in the horizontal component nav; all five markers, including Chevron marker 3, were inside the `320.76 × 243.20` frame. Mobile overview and anatomy screenshots were captured during QA.

## Interaction checks

- Playground header click expanded independently from the header checkbox; pointer selection, Dark mode, subtitle visibility, and disabled parent controls all updated the rendered state and were restored afterward.
- In-context select-all wiring worked by pointer: the parent selected all three child rows, an individual child diverged, and the example was restored to unchecked.

## Known public-package limitation

The local `jfs-components@0.1.60` React Native Web checkbox controls do not provide independent keyboard behavior: Space on the parent checkbox expanded the header without selecting it; Enter selected the parent and also expanded the header; Space on a nested child produced no state change, while pointer activation worked. This is classified as a demonstrated public component/event-routing limitation. No screen-level keyboard patch was added.

## Follow-up: shared principle-card radius

- The shared `.principle-card` radius was corrected to `26px` on all four corners. Browser QA rechecked all six guide routes at `1069 × 1002`, plus AccordionCheckbox at `438 × 948` and Button at an actual `390 × 845`; every corner resolved to `26px` and no route overflowed.
- `npm run build` passed after the CSS correction (`tsc --noEmit && vite build`). Vite retained its existing large-chunk warning; no build failure occurred.
