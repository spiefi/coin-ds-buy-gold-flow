# Flow Directory QA

## Included flows

- Zgredek Bank — `?flow=zgredek&route=explore`
- Credit Cards — `?flow=credit-cards&route=credit-cards`

The root URL renders a Coin-based flow directory. Selecting a flow updates the
browser URL and history without adding preview chrome to the approved product
screens.

## Navigation

- Directory → Zgredek Bank: pass
- Zgredek Home tab → Directory: pass
- Directory → Credit Cards: pass
- Credit Cards root back action → Directory: pass
- Credit Cards Home tab → Directory: pass
- Browser history across directory/flow selections: supported through
  `pushState` and `popstate`

## Backward compatibility

- `?route=bank-new-user` resolves to the Zgredek Bank state: pass
- `?route=pre-qualified` resolves to the Credit Cards results state: pass
- All existing Zgredek and Credit Cards route names remain valid

## Architecture

- The directory uses public Coin `Screen`, `AppBar`, `HeroSection`, `Title`,
  `VStack`, `ListItem`, and `ScrollArea` components.
- Flow switching changes behavior only. No switcher overlay or additional
  product-screen styling was added, so existing matching-dimension QA captures
  remain valid.
