import React, { useMemo, useState } from 'react'
import {
  ScrollView,
  type ImageSourcePropType,
} from 'react-native'
import {
  AppBar,
  Badge,
  BottomNav,
  Button,
  CardCTA,
  Carousel,
  CcCard,
  HeroSection,
  HStack,
  Icon,
  IconCapsule,
  Image,
  ListItem,
  ProductMerchandisingCard,
  Screen,
  Section,
  Title,
  VStack,
} from 'jfs-components'
import axisMyZoneCard from '../assets/credit-cards/card-axis-myzone.png'
import flipkartCard from '../assets/credit-cards/card-flipkart.png'
import hsbcCard from '../assets/credit-cards/card-hsbc.png'
import idfcCard from '../assets/credit-cards/card-idfc.png'
import indusindCard from '../assets/credit-cards/card-indusind.png'
import carouselAvatar from '../assets/credit-cards/carousel-avatar.png'
import carouselFlipkart from '../assets/credit-cards/carousel-flipkart.png'
import airportIcon from '../assets/credit-cards/ic-airport.png'
import upgradeCta from '../assets/credit-cards/upgrade-cta.png'

export type CreditCardsRoute =
  | 'credit-cards'
  | 'credit-cards-expanded'
  | 'pre-qualified'
  | 'fuel'

export interface CreditCardsFlowProps {
  initialRoute?: CreditCardsRoute
}

type Category = {
  label: string
  icon?: string
  source?: string
  route?: CreditCardsRoute
}

type ProductId = 'hsbc' | 'flipkart' | 'idfc' | 'indusind' | 'axis-my-zone'

type CreditCardProduct = {
  id: ProductId
  title: string
  fee: string
  imageSource: ImageSourcePropType | string
  leadingBadges: string[]
  bestFor: string
}

const SCREEN_MODES = {
  'Color Mode': 'Light',
  'Page type': 'MainPage',
} as const

const CONTENT_MODES = {
  Padding: 'Default',
  'Slot gap': 'S',
  'context 9': 'Stack',
} as const

const CATEGORIES_COLLAPSED: Category[] = [
  { label: 'All cards', icon: 'ic_month' },
  { label: 'Pre-approved', icon: 'ic_confirm', route: 'pre-qualified' },
  { label: 'Cashback', icon: 'ic_rupee_coin' },
]

const CATEGORIES_EXPANDED: Category[] = [
  ...CATEGORIES_COLLAPSED,
  { label: 'Fuel', icon: 'ic_fuel', route: 'fuel' },
  { label: 'Shopping\n&\u00a0Rewards', icon: 'ic_cart' },
  { label: 'Travel', source: airportIcon },
  { label: 'Lifestyle\n&\u00a0Entertainment', icon: 'ic_movie' },
]

const PRODUCTS: Record<ProductId, CreditCardProduct> = {
  hsbc: {
    id: 'hsbc',
    title: 'HSBC Live + Credit Card',
    fee: 'Joining fee: ₹999 + GST',
    imageSource: hsbcCard,
    leadingBadges: ['Pre-qualified', 'Lifetime free'],
    bestFor: 'Travel',
  },
  flipkart: {
    id: 'flipkart',
    title: 'Flipkart Axis Bank Credit Card',
    fee: 'Joining ₹500 | Second year ₹500 + GST',
    imageSource: flipkartCard,
    leadingBadges: ['Lifetime free'],
    bestFor: 'Shopping',
  },
  idfc: {
    id: 'idfc',
    title: 'IDFC HPCL First Power Plus Credit Card',
    fee: 'Joining fee ₹199 | Renew ₹199 +GST',
    imageSource: idfcCard,
    leadingBadges: [],
    bestFor: 'Fuel',
  },
  indusind: {
    id: 'indusind',
    title: 'Indulind Legend Credit Card',
    fee: 'Joining fee: ₹0',
    imageSource: indusindCard,
    leadingBadges: [],
    bestFor: 'Travel',
  },
  'axis-my-zone': {
    id: 'axis-my-zone',
    title: 'Axis Bank MY ZONE Credit Card',
    fee: 'Lifetime Free | Renewal ₹0',
    imageSource: axisMyZoneCard,
    leadingBadges: [],
    bestFor: 'Cashback',
  },
}

const HOME_PRODUCTS = [
  PRODUCTS.hsbc,
  PRODUCTS.flipkart,
  PRODUCTS.idfc,
  PRODUCTS.indusind,
  PRODUCTS['axis-my-zone'],
]

const PREQUALIFIED_PRODUCTS = [
  PRODUCTS.flipkart,
  PRODUCTS.hsbc,
  PRODUCTS.idfc,
  PRODUCTS.indusind,
  PRODUCTS['axis-my-zone'],
]

const FUEL_PRODUCTS = [PRODUCTS.idfc, PRODUCTS.indusind]

const BENEFITS = Array.from({ length: 3 }, () => ({
  icon: 'ic_4g_bar_three',
  title: 'Instant withdrawal available',
}))

const NUDGE_SEGMENTS = [
  { text: 'Upgrade for ₹750 cashback with ' },
  { text: 'JioFinance+', modes: { 'Text Appearance': 'Primary' } },
]

function CategoryItem({ category, onPress }: { category: Category; onPress?: () => void }) {
  return (
    <ListItem
      layout="Vertical"
      supportText={category.label}
      leading={
        <IconCapsule
          iconName={category.icon ?? (category.source ? '' : undefined)}
          source={category.source}
          modes={{ Emphasis: 'High', AppearanceBrand: 'Secondary' }}
        />
      }
      onPress={onPress}
      accessibilityLabel={category.label.replace(/\s/g, ' ')}
      modes={{ Context: 'ListItem' }}
    />
  )
}

function CategoryGrid({
  expanded,
  onExpand,
  onNavigate,
}: {
  expanded: boolean
  onExpand: () => void
  onNavigate: (route: CreditCardsRoute) => void
}) {
  return (
    <Section.Bento
      navSlot={CATEGORIES_EXPANDED.map((category) => (
        <CategoryItem
          key={category.label}
          category={category}
          onPress={category.route ? () => onNavigate(category.route!) : undefined}
        />
      ))}
      collapsedCount={4}
      expanded={expanded}
      onExpandedChange={() => onExpand()}
      toggleMoreLabel="More"
      toggleLessLabel="Less"
      modes={{ Context: 'ListItem', Emphasis: 'High', AppearanceBrand: 'Secondary' }}
      style={{
        alignSelf: 'stretch',
        marginHorizontal: -16,
        paddingHorizontal: 16,
        paddingVertical: 0,
        backgroundColor: 'transparent',
      }}
    />
  )
}

function CardHeader({ product }: { product: CreditCardProduct }) {
  return (
    <HStack
      alignVertical="center"
      justifyHorizontal="space-between"
      modes={{ Padding: 'None', 'Slot gap': 'XS' }}
      style={{ width: '100%' }}
    >
      <HStack
        alignVertical="center"
        modes={{ Padding: 'None', 'Slot gap': 'XS' }}
        style={{ flex: 1, flexWrap: 'wrap' }}
      >
        {product.leadingBadges.map((label) => (
          <Badge
            key={label}
            label={label}
            modes={{
              Context4: 'Badge',
              'Badge Size': 'Small',
              Emphasis: 'High',
              AppearanceBrand: 'Tertiary',
            }}
          />
        ))}
      </HStack>
      <Badge
        label="Up to 2000 pts"
        leading={
          <Icon
            iconName="ic_card"
            modes={{ Emphasis: 'Medium', AppearanceBrand: 'Secondary' }}
          />
        }
        modes={{
          Context4: 'Badge',
          'Badge Size': 'Small',
          Emphasis: 'Medium',
          AppearanceBrand: 'Secondary',
        }}
      />
    </HStack>
  )
}

function ProductCard({ product }: { product: CreditCardProduct }) {
  return (
    <CcCard
      width="100%"
      header={<CardHeader product={product} />}
      imageSource={product.imageSource}
      imageWidth={88}
      imageHeight={54}
      title={product.title}
      subtitle={product.fee}
      items={BENEFITS}
      showNudge
      nudgeAvatarSource={upgradeCta}
      nudgeSegments={NUDGE_SEGMENTS}
      headline="Best for"
      description={product.bestFor}
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
      accessibilityLabel={`${product.title}, ${product.fee}, best for ${product.bestFor}`}
      modes={{ context7: 'Card', AppearanceBrand: 'Secondary' }}
      style={{ gap: 4 }}
    />
  )
}

function ProductList({ products, showUpgrade }: { products: CreditCardProduct[]; showUpgrade: boolean }) {
  return (
    <VStack modes={CONTENT_MODES} style={{ width: '100%' }}>
      {products.map((product, index) => (
        <React.Fragment key={product.id}>
          <ProductCard product={product} />
          {showUpgrade && index === 1 ? (
            <CardCTA
              type="CTA"
              title="Upgrade for 25% Extra"
              body="You can earn extra 25% JioPoints on FD booking with JioFinance+"
              iconSlot={
                <Image
                  imageSource={upgradeCta}
                  width={105}
                  height={141}
                  resizeMode="contain"
                />
              }
              buttonLabel="Update"
              modes={{ Context: 'CTACard', MediaBlock: 'IconCapsule' }}
            />
          ) : null}
        </React.Fragment>
      ))}
    </VStack>
  )
}

function PromoCard({ configured = false }: { configured?: boolean }) {
  return (
    <ProductMerchandisingCard
      imageSource={carouselFlipkart}
      avatarSource={carouselAvatar}
      title={configured ? 'Flipkart Axis Bank Credit Card' : 'Title'}
      subtitle={configured ? 'Welcome Benefits. Fuel. More.' : 'Subtitle'}
      badge={
        <Badge
          label={configured ? 'Up to 2000 pts' : 'Label'}
          leading={
            <Icon
              iconName="ic_jewellery_diamond"
              modes={{ Emphasis: 'Medium', AppearanceBrand: 'Secondary' }}
            />
          }
          modes={{ Context4: 'Badge', Emphasis: 'Medium', AppearanceBrand: 'Secondary' }}
        />
      }
      specialBadgeLabel={
        configured ? 'Upgrade for ₹750 cashback with JioFinance+' : 'Badge'
      }
      specialBadgeIcon={<Icon iconName="ic_card" color="#ffffff" />}
      ctaLabel={configured ? 'Apply' : 'CTA'}
      height={223}
      accessibilityLabel={
        configured ? 'Featured Flipkart Axis Bank Credit Card' : 'Credit card promotion'
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
      paddingHorizontal={16}
      paddingVertical={8}
      style={{ alignSelf: 'stretch', marginHorizontal: -16 }}
    >
      {/* Carousel has no public initialIndex API, so the approved configured card is first. */}
      <PromoCard configured />
      <PromoCard />
      <PromoCard />
      <PromoCard />
      <PromoCard />
    </Carousel>
  )
}

function filterProducts(products: CreditCardProduct[], search: string) {
  const normalized = search.trim().toLocaleLowerCase()
  if (!normalized) return products
  return products.filter((product) =>
    `${product.title} ${product.fee} ${product.bestFor}`.toLocaleLowerCase().includes(normalized),
  )
}

function CreditCardsHome({
  expanded,
  search,
  onSearchChange,
  onToggleCategories,
  onNavigate,
}: {
  expanded: boolean
  search: string
  onSearchChange: (value: string) => void
  onToggleCategories: () => void
  onNavigate: (route: CreditCardsRoute) => void
}) {
  const visibleProducts = useMemo(() => filterProducts(HOME_PRODUCTS, search), [search])

  return (
    <>
      <ScrollView
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{ paddingBottom: 104 }}
        keyboardShouldPersistTaps="handled"
      >
        <AppBar type="SubPage" />
        <HeroSection
          titleSlot={<Title title="Credit Cards" modes={{ context7: 'Page Hero' }} />}
          searchValue={search}
          onSearchChange={onSearchChange}
          searchPlaceholder="Search"
        >
          <VStack modes={{ Padding: 'None', 'Slot gap': 'L' }} style={{ width: '100%' }}>
            <PromoCarousel />
            <CategoryGrid
              expanded={expanded}
              onExpand={onToggleCategories}
              onNavigate={onNavigate}
            />
          </VStack>
        </HeroSection>
        <ProductList products={visibleProducts} showUpgrade />
      </ScrollView>
      <BottomNav value="explore">
        <BottomNav.Item value="home" iconName="ic_home" label="Home" />
        <BottomNav.Item value="finances" iconName="ic_rupee" label="Finances" />
        <BottomNav.Item value="pay" iconName="ic_scan" label="Pay" />
        <BottomNav.Item value="invest" iconName="ic_graph_increasing" label="Invest" />
        <BottomNav.Item value="explore" iconName="ic_explore_compass" label="Explore" />
      </BottomNav>
    </>
  )
}

function ResultsScreen({
  title,
  products,
  search,
  onSearchChange,
  onBack,
}: {
  title: string
  products: CreditCardProduct[]
  search: string
  onSearchChange: (value: string) => void
  onBack: () => void
}) {
  const visibleProducts = useMemo(
    () => filterProducts(products, search),
    [products, search],
  )

  return (
    <ScrollView
      style={{ flex: 1, width: '100%' }}
      contentContainerStyle={{ paddingBottom: 24 }}
      keyboardShouldPersistTaps="handled"
    >
      <AppBar type="SubPage" onLeadingPress={onBack} />
      <HeroSection
        title={title}
        subtitle="Showing 52 cards"
        searchValue={search}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search credit cards"
      />
      <ProductList products={visibleProducts} showUpgrade={title === 'Pre-qualified cards'} />
    </ScrollView>
  )
}

export function CreditCardsFlow({ initialRoute = 'credit-cards' }: CreditCardsFlowProps) {
  const [route, setRoute] = useState<CreditCardsRoute>(initialRoute)
  const [returnRoute, setReturnRoute] = useState<'credit-cards' | 'credit-cards-expanded'>(
    initialRoute === 'credit-cards-expanded' ? 'credit-cards-expanded' : 'credit-cards',
  )
  const [searchByRoute, setSearchByRoute] = useState<Record<CreditCardsRoute, string>>({
    'credit-cards': '',
    'credit-cards-expanded': '',
    'pre-qualified': '',
    fuel: '',
  })

  const search = searchByRoute[route]
  const setSearch = (value: string) =>
    setSearchByRoute((current) => ({ ...current, [route]: value }))
  const isExpanded = route === 'credit-cards-expanded'

  return (
    <Screen modes={SCREEN_MODES}>
      {route === 'pre-qualified' ? (
        <ResultsScreen
          title="Pre-qualified cards"
          products={PREQUALIFIED_PRODUCTS}
          search={search}
          onSearchChange={setSearch}
          onBack={() => setRoute(returnRoute)}
        />
      ) : route === 'fuel' ? (
        <ResultsScreen
          title="Fuel"
          products={FUEL_PRODUCTS}
          search={search}
          onSearchChange={setSearch}
          onBack={() => setRoute(returnRoute)}
        />
      ) : (
        <CreditCardsHome
          expanded={isExpanded}
          search={search}
          onSearchChange={setSearch}
          onToggleCategories={() =>
            setRoute(isExpanded ? 'credit-cards' : 'credit-cards-expanded')
          }
          onNavigate={(nextRoute) => {
            setReturnRoute(isExpanded ? 'credit-cards-expanded' : 'credit-cards')
            setRoute(nextRoute)
          }}
        />
      )}
    </Screen>
  )
}

export default CreditCardsFlow
