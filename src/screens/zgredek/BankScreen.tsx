import React from 'react'
import {
  AppBar,
  Avatar,
  BottomNav,
  Button,
  Carousel,
  CcCard,
  HeroSection,
  Icon,
  ListItem,
  Nudge,
  ProductMerchandisingCard,
  Screen,
  ScrollArea,
  Title,
  VStack,
} from 'jfs-components'
import bankHero from '../../assets/bank-hero.png'
import jioLogo from '../../assets/jio-logo.png'
import savingsAvatar from '../../assets/savings-avatar.png'
import walletAvatar from '../../assets/wallet-avatar.png'

export type BankScreenVariant =
  | 'new-user'
  | 'wallet-account'
  | 'found-ntb'
  | 'linked'

export interface BankScreenProps {
  variant: BankScreenVariant
  onBack?: () => void
  onConnect?: () => void
  onOpenWallet?: () => void
  onOpenSavings?: () => void
  onSectionPress?: () => void
  onExitFlow?: () => void
}

const SCREEN_MODES = {
  'Color Mode': 'Light',
  'Page type': 'MainPage',
} as const

const CARD_MODES = {
  context7: 'Card',
} as const

const FEATURE_ICON_MODES = {
  Emphasis: 'Low',
  'Icon Capsule Size': 'S',
  AppearanceBrand: 'Secondary',
} as const

const CONNECT_NUDGE_MODES = {
  Context: 'Nudge&Alert',
  Emphasis: 'High',
  AppearanceBrand: 'Tertiary',
} as const

function FeatureIcon({ iconName }: { iconName: string }) {
  return <Icon iconName={iconName} modes={FEATURE_ICON_MODES} />
}

function BankPromotion({ configured = false }: { configured?: boolean }) {
  return (
    <ProductMerchandisingCard
      imageSource={bankHero}
      avatarSource={jioLogo}
      title={configured ? 'Savings account' : 'Title'}
      subtitle={configured ? 'Paperless & secure' : 'Subtitle'}
      ctaLabel={configured ? 'Upgrade' : 'CTA'}
      showAvatar
      height={223}
      accessibilityLabel={
        configured
          ? 'Savings account, paperless and secure'
          : 'Additional banking promotion'
      }
    />
  )
}

function BankCarousel() {
  return (
    <Carousel
      type="Default"
      showPagination
      loop={false}
      itemWidth={328}
      gap={8}
      paddingHorizontal={0}
      paddingVertical={8}
    >
      <BankPromotion key="bank-featured" configured />
      <BankPromotion key="bank-side-1" />
      <BankPromotion key="bank-side-2" />
      <BankPromotion key="bank-side-3" />
      <BankPromotion key="bank-side-4" />
    </Carousel>
  )
}

function ProductButton({
  label,
  onPress,
}: {
  label: string
  onPress?: () => void
}) {
  return (
    <Button
      label={label}
      onPress={onPress}
      modes={{
        'Button / Size': 'S',
        Emphasis: 'High',
        AppearanceBrand: 'Secondary',
      }}
    />
  )
}

function WalletCard({
  title,
  onOpen,
}: {
  title: string
  onOpen?: () => void
}) {
  return (
    <CcCard
      width="100%"
      compact={false}
      showHeader={false}
      media={
        <Avatar
          imageSource={walletAvatar}
          modes={{ 'Avatar Size': 'M' }}
          accessibilityLabel="Wallet"
        />
      }
      title={title}
      subtitle="Jio Payments Bank"
      items={[
        { leading: <FeatureIcon iconName="ic_flash" />, title: 'Instant digital setup' },
        { leading: <FeatureIcon iconName="ic_graph_increasing" />, title: 'Auto sweep account' },
        { leading: <FeatureIcon iconName="ic_forms" />, title: '100% digital onboarding' },
      ]}
      showNudge={false}
      headline="Savings interest up to"
      description="6.5%"
      footerSubtitle="p.a."
      button={<ProductButton label="Open" onPress={onOpen} />}
      modes={CARD_MODES}
      accessibilityLabel={title + ', Jio Payments Bank, savings interest up to 6.5 percent per annum'}
    />
  )
}

function SavingsCard({ onOpen }: { onOpen?: () => void }) {
  return (
    <CcCard
      width="100%"
      compact={false}
      showHeader={false}
      media={
        <Avatar
          imageSource={savingsAvatar}
          modes={{ 'Avatar Size': 'M' }}
          accessibilityLabel="Savings Account"
        />
      }
      title="Savings Account"
      subtitle="Jio Payments Bank"
      items={[
        { leading: <FeatureIcon iconName="ic_4g_bar_three" />, title: 'Smooth, paperless onboarding' },
        { leading: <FeatureIcon iconName="ic_jewellery_diamond" />, title: 'Instant disbursal in minutes' },
      ]}
      showNudge={false}
      headline="Setup time"
      description="6.5%"
      footerSubtitle="p.a."
      button={<ProductButton label="Open" onPress={onOpen} />}
      modes={CARD_MODES}
      accessibilityLabel="Savings Account, Jio Payments Bank, setup time 6.5 percent"
    />
  )
}

function SavingsProCard() {
  return (
    <CcCard
      width="100%"
      compact={false}
      showHeader={false}
      media={
        <Avatar
          imageSource={savingsAvatar}
          modes={{ 'Avatar Size': 'M' }}
          accessibilityLabel="Savings Pro"
        />
      }
      title="Savings Pro"
      subtitle="Jio Payments Bank"
      items={[
        { leading: <FeatureIcon iconName="ic_flash" />, title: 'Instant digital setup' },
        { leading: <FeatureIcon iconName="ic_graph_increasing" />, title: 'Auto sweep account' },
        { leading: <FeatureIcon iconName="ic_forms" />, title: '100% digital onboarding' },
      ]}
      showNudge={false}
      headline="Savings interest up to"
      description="4.00%*"
      footerSubtitle="p.a."
      button={<ProductButton label="Upgrade" />}
      modes={CARD_MODES}
      accessibilityLabel="Savings Pro, Jio Payments Bank, savings interest up to 4 percent per annum"
    />
  )
}

function ConnectNudge({ onConnect }: { onConnect?: () => void }) {
  return (
    <Nudge
      type="stacked-prominent"
      title="Have an account with us already?"
      body="Tap to link your JioBank account with us."
      buttonLabel="Connect"
      onPressButton={onConnect}
      startSlot={<Icon iconName="ic_link" modes={CONNECT_NUDGE_MODES} />}
      modes={CONNECT_NUDGE_MODES}
    />
  )
}

export function BankScreen({
  variant,
  onBack,
  onConnect,
  onOpenWallet,
  onOpenSavings,
  onSectionPress,
  onExitFlow,
}: BankScreenProps) {
  const showConnect = variant === 'new-user' || variant === 'wallet-account'
  const isLinked = variant === 'linked'
  const walletTitle = variant === 'wallet-account' ? 'Wallet account' : 'Wallet'

  return (
    <Screen modes={SCREEN_MODES}>
      <ScrollArea direction="vertical" style={{ flex: 1 }} paddingBottom={96}>
        <AppBar
          type="SubPage"
          onLeadingPress={onBack}
          modes={{ Context2: 'AppBar' }}
        />
        <HeroSection
          titleSlot={
            <Title
              title="Bank"
              subtitle="Powered by Jio Payments Bank"
              modes={{ context7: 'Page Hero' }}
            />
          }
          showSearch={false}
          showFilter={false}
        >
          <VStack
            modes={{
              'Slot gap': 'XL',
              Background: 'True',
              Padding: 'None',
              'context 9': 'Stack',
            }}
          >
            <BankCarousel />
          </VStack>
        </HeroSection>

        {showConnect ? (
          <VStack modes={{ 'Slot gap': 'XL', Background: 'True', 'context 9': 'Stack' }}>
            <ConnectNudge onConnect={onConnect} />
          </VStack>
        ) : null}

        <VStack modes={{ 'Slot gap': 'S', Padding: 'Default', 'context 9': 'Stack' }}>
          {isLinked ? (
            <SavingsProCard />
          ) : (
            <>
              <WalletCard title={walletTitle} onOpen={onOpenWallet} />
              <SavingsCard onOpen={onOpenSavings} />
            </>
          )}
          <ListItem
            layout="Horizontal"
            title="Section title"
            showSupportText={false}
            navArrow={isLinked}
            onPress={isLinked ? onSectionPress : undefined}
            modes={{ Context: 'ListItem', 'List Item Style': 'Boxed' }}
          />
        </VStack>
      </ScrollArea>
      <BottomNav value="explore">
        <BottomNav.Item value="home" iconName="ic_home" label="Home" onPress={onExitFlow} />
        <BottomNav.Item value="finances" iconName="ic_rupee" label="Finances" />
        <BottomNav.Item value="pay" iconName="ic_scan" label="Pay" />
        <BottomNav.Item value="invest" iconName="ic_graph_increasing" label="Invest" />
        <BottomNav.Item value="explore" iconName="ic_explore_compass" label="Explore" />
      </BottomNav>
    </Screen>
  )
}

export default BankScreen
