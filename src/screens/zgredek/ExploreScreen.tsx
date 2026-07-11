import React from 'react'
import {
  AppBar,
  Avatar,
  Badge,
  BottomNav,
  Button,
  CardCTA,
  Carousel,
  CcCard,
  HeroSection,
  HStack,
  Icon,
  IconButton,
  IconCapsule,
  Image,
  ListItem,
  ProductMerchandisingCard,
  Screen,
  ScrollArea,
  Section,
  Text,
  VStack,
} from 'jfs-components'
import bankHero from '../../assets/bank-hero.png'
import carouselAvatar from '../../assets/credit-cards/carousel-avatar.png'
import carouselFlipkart from '../../assets/credit-cards/carousel-flipkart.png'
import hsbcCard from '../../assets/credit-cards/card-hsbc.png'
import airportIcon from '../../assets/credit-cards/ic-airport.png'
import upgradeCta from '../../assets/credit-cards/upgrade-cta.png'
import jioLogo from '../../assets/jio-logo.png'
import profileAvatar from '../../assets/profile-avatar.png'

const SCREEN_MODES = {
  'Color Mode': 'Light',
  'Page type': 'MainPage',
} as const

const CARD_MODES = {
  context7: 'Card',
} as const

const HERO_BADGE_MODES = {
  Context4: 'Badge',
  Emphasis: 'Medium',
  AppearanceBrand: 'Secondary',
} as const

const CARD_BADGE_MODES = {
  ...HERO_BADGE_MODES,
  'Badge Size': 'Small',
} as const

const NEUTRAL_APP_ACTION_MODES = {
  'Button / Size': 'S',
  Emphasis: 'Low',
  AppearanceBrand: 'Neutral',
  Appearance: 'Primary',
} as const

const JIO_APP_ACTION_MODES = {
  'Button / Size': 'S',
  Emphasis: 'Low',
  AppearanceBrand: 'Primary',
  Appearance: '172:0',
} as const

const OFFER_ICON_MODES = {
  Emphasis: 'Low',
  'Icon Capsule Size': 'S',
  AppearanceBrand: 'Secondary',
} as const

const CATEGORIES = [
  ['Bank', 'ic_bank_branch'],
  ['Credit cards', 'ic_rupee_coin'],
  ['Loans', 'ic_loans'],
  ['Insurance', 'ic_protection'],
  ['Investments', 'ic_consumption_high'],
  ['Tax', 'ic_municipal_tax'],
  ['JioBlackRock', 'ic_graph_increasing'],
  ['Optimise', 'ic_analytics_pie_chart_tree'],
] as const

export interface ExploreScreenProps {
  onOpenBank: () => void
  onExitFlow?: () => void
}

function PromoCard({ configured = false }: { configured?: boolean }) {
  return (
    <ProductMerchandisingCard
      imageSource={configured ? carouselFlipkart : bankHero}
      avatarSource={carouselAvatar}
      title={configured ? 'Flipkart Axis Bank Credit Card' : 'Title'}
      subtitle={configured ? 'Welcome Benefits. Fuel. More.' : 'Subtitle'}
      badge={
        <Badge
          label={configured ? 'Up to 2000 pts' : 'Label'}
          leading={<Icon iconName="ic_jewellery_diamond" modes={HERO_BADGE_MODES} />}
          modes={HERO_BADGE_MODES}
        />
      }
      specialBadgeLabel={
        configured ? 'Upgrade for ₹750 cashback with JioFinance+' : 'Badge'
      }
      specialBadgeIcon={
        <Icon iconName="ic_card" modes={{ Context4: 'Badge/glass' }} />
      }
      ctaLabel={configured ? 'Apply' : 'CTA'}
      height={223}
      accessibilityLabel={
        configured
          ? 'Flipkart Axis Bank Credit Card, Welcome Benefits. Fuel. More.'
          : 'Additional promotion'
      }
    />
  )
}

function PromoCarousel() {
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
      <PromoCard key="promo-featured" configured />
      <PromoCard key="promo-side-1" />
      <PromoCard key="promo-side-2" />
      <PromoCard key="promo-side-3" />
      <PromoCard key="promo-side-4" />
    </Carousel>
  )
}

function CategoryGrid({ onOpenBank }: { onOpenBank: () => void }) {
  return (
    <Section.Bento
      navSlot={CATEGORIES.map(([label, iconName]) => {
        const onPress = label === 'Bank' ? onOpenBank : undefined

        return (
          <ListItem
            key={label}
            layout="Vertical"
            supportText={label}
            supportSlot={
              <Text
                text={label}
                textAlign="Center"
                modes={{ AppearanceBrand: 'Neutral' }}
              />
            }
            leading={<IconCapsule iconName={iconName} />}
            onPress={onPress}
            accessibilityLabel={label}
            accessibilityHint={onPress ? 'Opens banking products' : undefined}
            modes={{ Context: 'ListItem' }}
          />
        )
      })}
      collapsedCount={8}
      modes={{ Context: 'ListItem', AppearanceBrand: 'Secondary' }}
      accessibilityLabel="Explore categories"
    />
  )
}

function CreditCardOffer({ primary = false }: { primary?: boolean }) {
  return (
    <CcCard
      width={300}
      badges={[
        {
          label: primary ? 'Badge' : 'Pre-qualified',
          modes: { Emphasis: 'High', AppearanceBrand: 'Tertiary' },
        },
        {
          label: primary ? 'Badge' : 'Lifetime free',
          modes: { Emphasis: 'High', AppearanceBrand: 'Tertiary' },
        },
      ]}
      trailingBadges={[{ label: 'Up to 2000 pts', modes: CARD_BADGE_MODES }]}
      imageSource={hsbcCard}
      imageWidth={88}
      imageHeight={54}
      title="HSBC Live + Credit Card"
      subtitle="Joining fee: ₹999 + GST"
      items={[
        {
          leading: <Icon source={airportIcon} modes={OFFER_ICON_MODES} />,
          title: '4 domestic + 2 intl. lounge access yearly',
        },
        {
          leading: <Icon iconName="ic_voucher_cashback" modes={OFFER_ICON_MODES} />,
          title: '₹5000 Amazon voucher on joining',
        },
        {
          leading: <Icon iconName="ic_rupee_coin_off" modes={OFFER_ICON_MODES} />,
          title: '10% off on dining and grocery spends',
        },
      ]}
      showNudge
      nudgeAvatarSource={upgradeCta}
      nudgeSegments={[
        { text: 'Upgrade for ₹750 cashback with ' },
        { text: 'JioFinance+', modes: { 'Text Appearance': 'Primary' } },
      ]}
      headline="Best for"
      description="Travel"
      footerSubtitle=""
      button={
        <Button
          label="Apply"
          modes={{
            'Button / Size': 'S',
            Emphasis: 'High',
            AppearanceBrand: 'Secondary',
          }}
        />
      }
      accessibilityLabel="HSBC Live Plus Credit Card, pre-qualified, lifetime free"
      modes={CARD_MODES}
    />
  )
}

function ExploreContent() {
  return (
    <VStack modes={{ Padding: 'Default', 'Slot gap': 'XL', 'context 9': 'Stack' }}>
      <Section
        title="Credit cards"
        supportText="Pre-qualified · Lifetime free"
        showSupportText
        slot={
          <ScrollArea
            direction="horizontal"
            paddingRight={16}
            contentContainerStyle={{ gap: 8 }}
          >
            <CreditCardOffer primary />
            <CreditCardOffer />
          </ScrollArea>
        }
        modes={{ 'context 8': 'Section' }}
        accessibilityLabel="Credit cards"
      />
      <CardCTA
        type="CTA"
        title="Upgrade for 25% Extra"
        body="You can earn extra 25% JioPoints on FD booking with JioFinance+"
        iconSlot={<Image imageSource={upgradeCta} width={105} height={141} resizeMode="contain" />}
        buttonLabel="Get started"
        modes={{ Context: 'CTACard', MediaBlock: 'IconCapsule' }}
      />
    </VStack>
  )
}

export function ExploreScreen({ onOpenBank, onExitFlow }: ExploreScreenProps) {
  return (
    <Screen modes={SCREEN_MODES}>
      <ScrollArea direction="vertical" style={{ flex: 1 }} paddingBottom={96}>
        <AppBar
          type="MainPage"
          leadingSlot={
            <Avatar
              imageSource={jioLogo}
              modes={{ 'Avatar Size': 'M' }}
              accessibilityLabel="Jio"
            />
          }
          actionsSlot={
            <HStack modes={{ Padding: 'None', 'Slot gap': 'None' }}>
              <IconButton iconName="ic_search" accessibilityLabel="Search" modes={NEUTRAL_APP_ACTION_MODES} />
              <IconButton iconName="ic_hellojio" accessibilityLabel="Hello Jio" modes={JIO_APP_ACTION_MODES} />
              <IconButton iconName="ic_notification" accessibilityLabel="Notifications" modes={NEUTRAL_APP_ACTION_MODES} />
              <Avatar
                imageSource={profileAvatar}
                modes={{ 'Avatar Size': 'S' }}
                accessibilityLabel="Profile"
              />
            </HStack>
          }
        />
        <HeroSection showTitle={false} showSearch={false} showFilter={false}>
          <PromoCarousel />
        </HeroSection>
        <CategoryGrid onOpenBank={onOpenBank} />
        <ExploreContent />
      </ScrollArea>
      <BottomNav value="explore">
        <BottomNav.Item value="home" iconName="ic_home" label="Home" onPress={onExitFlow} />
        <BottomNav.Item value="finances" iconName="ic_rupee" label="Finances" />
        <BottomNav.Item value="pay" iconName="ic_scan" label="Pay" />
        <BottomNav.Item value="invest" iconName="ic_graph_increasing" label="Invest" />
        <BottomNav.Item value="explore" iconName="ic_explore_compass" label="Explore" />
      </BottomNav>
      <Button
        label="Personalise"
        style={{ position: 'absolute', bottom: 89, alignSelf: 'center' }}
        modes={{
          'Button / Size': 'M',
          Emphasis: 'High',
          AppearanceBrand: 'Primary',
        }}
        accessibilityLabel="Personalise"
      />
    </Screen>
  )
}

export default ExploreScreen
