# Avatar and Avatar Group source evidence

Package, Figma, Storybook, API, and verification evidence for this guide. Split from the former `docs/SOURCE_EVIDENCE.md` on 26 September 2026; implementation notes about anatomy markup predate the guide-kit migration.

## Avatar and Avatar Group

Checked 23 September 2026 for the Avatar and Avatar Group guides. The declared and installed package is `jfs-components@0.1.60`. The earlier registry lookup on 23 September returned `0.1.60`; a fresh lookup during recovery failed with `ENOTFOUND registry.npmjs.org`, so current registry `latest` could not be reconfirmed. No dependency change was made.

### Figma and Storybook

- [Avatar Group](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=1366-15672) — public Coin Components Library master `1366:15672`. The `Avatars` slot contains nested Avatar instances; its render shows overlapping circular portraits.
- [Avatar](https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=1-37658) — public master `1:37658`, with Image and Monogram styles and monogram text.
- [Avatar Group Storybook](https://jfs-components-storybook.vercel.app/?path=/docs/components-avatargroup--docs) documents the default, large-size, and custom-gap stories. The custom-gap story exposes `modes` and `style`; it does not expose a gap control.
- [Avatar Storybook](https://jfs-components-storybook.vercel.app/?path=/docs/components-avatar--docs) documents Image, Monogram, sizes, and remote-image examples.

### Public package contract

- `AvatarGroup` is a public default export from the `jfs-components` barrel. Its implementation accepts `modes`, React `children`, and `style` (plus native View props). Figma exposes the Avatar Size mode; it resolves to L 42 px, M 36 px, S 29 px, and XS 14 px. The group derives member count from its children, with no count property. Installed group tokens provide a `-6 px` overlap and `0` padding, with no public gap property. The last child is rendered in front. The implementation cuts out the next circle's area from earlier children with web CSS masks and an SVG native mask.
- `AvatarGroup` clones each child with its modes merged over the group modes. Explicit child modes therefore override the owner mode. Keep child Avatar modes unset when the group should control their common size.
- `Avatar` is a public default export with `style` (`Image` or `Monogram`, default `Image`), `monogram` (default `MS`), `imageSource`, `modes`, `loading`, `onPress`, `disabled`, and View props. Its Avatar Size modes resolve to the same 42/36/29/14 px values. With no `imageSource`, the implementation displays a bundled fallback image; use a supplied person-specific source for identity rather than treating the fallback as a person record.
- `loading` is part of the Avatar type, but in the checked web runtime a direct `loading={true}` outside an active `SkeletonGroup` renders no placeholder: Avatar returns Skeleton, and Skeleton returns `null` when its context is inactive. The guides demonstrate loading through the public `SkeletonGroup`; the group example wraps the full AvatarGroup so child mode cloning still works, then marks only the loading Avatar. This is a limitation of the checked package, not a reason to patch its internals.
- The component type accepts `accessibilityLabel`, but the implementation discards it, hides inner image/text from accessibility, and renders the pressable wrapper with role `image`. The guides do not present it as an accessible action or rely on Avatar to announce its content.
- Public `AmountInput` exposes `moneyValueSlot`, `noteInputSlot`, `modes`, and style. It clones the owner modes into supplied `MoneyValue` and `NoteInput` children and falls back to those public children when slots are falsy. `MoneyValue` owns editable, hidden, focused, currency, and value behavior; `NoteInput` owns its focus and controlled text behavior.
- The `NoteInput` implementation accepts a `state` prop but destructures it without using it; the guide demonstrates focus and filled text rather than a manually selected state. The guide passes `Color Mode=Light` and `Context3=Amount Input` to the owner and does not override child typography or colors.
