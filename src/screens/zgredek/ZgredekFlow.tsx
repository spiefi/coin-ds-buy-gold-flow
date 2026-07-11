import React, { useState } from 'react'
import { BankScreen, type BankScreenVariant } from './BankScreen'
import { ExploreScreen } from './ExploreScreen'
import { ProductDetailScreen } from './ProductDetailScreen'

export type ZgredekRoute =
  | 'explore'
  | 'bank-new-user'
  | 'bank-wallet-account'
  | 'bank-found-ntb'
  | 'bank-linked'
  | 'wallet'
  | 'saving-account'

export const ZGREDEK_ROUTES: readonly ZgredekRoute[] = [
  'explore',
  'bank-new-user',
  'bank-wallet-account',
  'bank-found-ntb',
  'bank-linked',
  'wallet',
  'saving-account',
] as const

export interface ZgredekFlowProps {
  initialRoute?: ZgredekRoute
  onExitFlow?: () => void
}

const BANK_VARIANTS: Record<
  Exclude<ZgredekRoute, 'explore' | 'wallet' | 'saving-account'>,
  BankScreenVariant
> = {
  'bank-new-user': 'new-user',
  'bank-wallet-account': 'wallet-account',
  'bank-found-ntb': 'found-ntb',
  'bank-linked': 'linked',
}

export function ZgredekFlow({
  initialRoute = 'explore',
  onExitFlow,
}: ZgredekFlowProps) {
  const [history, setHistory] = useState<ZgredekRoute[]>([initialRoute])
  const [consentChecked, setConsentChecked] = useState(true)
  const [consentExpanded, setConsentExpanded] = useState(false)
  const route = history[history.length - 1]

  const navigate = (next: ZgredekRoute) =>
    setHistory((current) => [...current, next])

  const goBack = () =>
    setHistory((current) =>
      current.length > 1 ? current.slice(0, -1) : ['explore'],
    )

  if (route === 'explore') {
    return (
      <ExploreScreen
        onOpenBank={() => navigate('bank-new-user')}
        onExitFlow={onExitFlow}
      />
    )
  }

  if (route === 'wallet' || route === 'saving-account') {
    return (
      <ProductDetailScreen
        product={route}
        consentChecked={consentChecked}
        consentExpanded={consentExpanded}
        onBack={goBack}
        onConsentChange={setConsentChecked}
        onReadMorePress={setConsentExpanded}
      />
    )
  }

  return (
    <BankScreen
      variant={BANK_VARIANTS[route]}
      onBack={goBack}
      onConnect={() =>
        navigate(route === 'bank-wallet-account' ? 'bank-found-ntb' : 'bank-linked')
      }
      onOpenWallet={() => navigate('wallet')}
      onOpenSavings={() => navigate('saving-account')}
      onExitFlow={onExitFlow}
    />
  )
}

export default ZgredekFlow
