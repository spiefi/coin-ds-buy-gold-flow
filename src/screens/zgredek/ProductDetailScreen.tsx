import React from 'react'
import {
  ActionFooter,
  AppBar,
  Avatar,
  Balance,
  Button,
  ExpandableCheckbox,
  HeroSection,
  Icon,
  IconButton,
  IconCapsule,
  Image,
  ListGroup,
  ListItem,
  Nudge,
  PdpCcCard,
  Screen,
  ScrollArea,
  Section,
  Stack,
  Text,
  VStack,
} from 'jfs-components'
import jioLogo from '../../assets/jio-logo.png'
import savingsAvatar from '../../assets/savings-avatar.png'
import successIcon from '../../assets/success-icon.png'
import walletAvatar from '../../assets/wallet-avatar.png'

export type ProductDetailProduct = 'wallet' | 'saving-account'

export type ProductDetailFeature =
  | 'instant-account-opening'
  | 'multiple-account-types'
  | 'digital-first-banking'

export interface ProductDetailScreenProps {
  product: ProductDetailProduct
  consentChecked?: boolean
  consentExpanded?: boolean
  onBack?: () => void
  onAssistantPress?: () => void
  onMorePress?: () => void
  onFeaturePress?: (feature: ProductDetailFeature) => void
  onFaqPress?: () => void
  onRequirementsPress?: () => void
  onConsentChange?: (checked: boolean) => void
  onReadMorePress?: (expanded: boolean) => void
  onApply?: () => void
}

const SCREEN_MODES = {
  'Color Mode': 'Light',
  'Page type': 'MainPage',
} as const

const APP_BAR_MODES = {
  Context2: 'AppBar',
} as const

const ASSISTANT_BUTTON_MODES = {
  'Button / Size': 'S',
  Emphasis: 'Low',
  Appearance: 'Primary',
} as const

const MORE_BUTTON_MODES = {
  'Button / Size': 'S',
  Emphasis: 'Low',
  AppearanceBrand: 'Primary',
} as const

const PRODUCT_MEDIA_MODES = {
  Radius: 'S',
} as const

const FEATURE_GROUP_MODES = {
  'List Item Style': 'Minimal',
  AppearanceBrand: 'Secondary',
} as const

const LIST_ITEM_MODES = {
  Context: 'ListItem',
} as const

const FEATURE_LIST_ITEM_MODES = {
  Context: 'ListItem',
  AppearanceBrand: 'Neutral',
} as const

const FEATURE_ICON_MODES = {
  Emphasis: 'Low',
  'Icon Capsule Size': 'S',
  AppearanceBrand: 'Secondary',
} as const

const CONTENT_MODES = {
  'Slot gap': 'S',
  'context 9': 'Stack',
} as const

const DETAILED_NUDGE_MODES = {
  'Slot gap': 'S',
  Context: 'Default',
  Emphasis: 'High',
  'Nudge padding': 'Default',
  AppearanceBrand: 'Neutral',
} as const

const DETAILED_NUDGE_CONTENT_MODES = {
  'Slot gap': 'M',
} as const

const OPINION_ICON_MODES = {
  Emphasis: 'Low',
  'Icon Capsule Size': 'M',
  AppearanceBrand: 'Tertiary',
} as const

const ELIGIBILITY_TEXT_MODES = {
  'Text Appearance': 'Neutral',
  'Text Sizes': 'Medium',
  Weight: 'Medium',
} as const

const SECTION_MODES = {
  'context 8': 'Section',
} as const

const SECTION_CONTENT_MODES = {
  'Slot gap': 'M',
} as const

const BALANCE_MODES = {
  Context3: 'Transaction Bubble',
} as const

const BOXED_LIST_ITEM_MODES = {
  Context: 'ListItem',
  'List Item Style': 'Boxed',
} as const

const POWERED_BY_MODES = {
  'Slot gap': 'S',
  Padding: 'Default',
  'context 9': 'Stack',
} as const

const POWERED_BY_TEXT_MODES = {
  Weight: 'Regular',
} as const

const APPLY_BUTTON_MODES = {
  'Button / State': 'Idle',
} as const

const FEATURES: ReadonlyArray<{
  id: ProductDetailFeature
  title: string
  supportText: string
  iconName: string
}> = [
  {
    id: 'instant-account-opening',
    title: 'Instant account opening',
    supportText: 'Digital KYC & video verification. No branch visit required.',
    iconName: 'ic_gift',
  },
  {
    id: 'multiple-account-types',
    title: 'Multiple account types',
    supportText: 'Regular savings, salary account, senior citizen, student accounts.',
    iconName: 'ic_voucher_cashback',
  },
  {
    id: 'digital-first-banking',
    title: 'Digital-first banking',
    supportText: 'Manage everything through JioFinance app.',
    iconName: 'ic_fuel',
  },
]

const OPINIONS = [
  {
    title: 'Great',
    supportText: 'Enjoy competitive interest rates & zero hidden charges.',
    iconName: 'ic_star',
  },
  {
    title: 'Good',
    supportText: 'Track your spending & savings with real-time notifications.',
    iconName: 'ic_status_successful',
  },
  {
    title: 'Caution',
    supportText: 'KYC verification & document submission required.',
    iconName: 'ic_warning',
  },
] as const

const LENDER_METRICS = [
  { title: 'Customers served', amount: '2+ Crore' },
  { title: 'Digital transactions monthly', amount: '50 lakh+' },
  { title: 'App rating', amount: '4.2+' },
  { title: 'Established', amount: '2018' },
] as const

const ELIGIBILITY =
  'Indian resident\nAge 21–65 yrs\nSalaried: Min ₹30 000 / month\nSelf-employed: ITR ₹6 lakh / yr'

const CONSENT_LABEL = 'By checking this box, I (a) acknowledge...'

function FeatureList({
  onFeaturePress,
}: {
  onFeaturePress?: (feature: ProductDetailFeature) => void
}) {
  return (
    <ListGroup modes={FEATURE_GROUP_MODES} disableTruncation>
      <Stack layoutDirection="vertical" fillWidth>
        {FEATURES.map((feature) => (
          <ListItem
            key={feature.id}
            layout="Horizontal"
            title={feature.title}
            supportText={feature.supportText}
            showSupportText
            leading={
              <Icon
                iconName={feature.iconName}
                modes={FEATURE_ICON_MODES}
                accessibilityElementsHidden
                importantForAccessibility="no"
              />
            }
            navArrow
            onPress={onFeaturePress ? () => onFeaturePress(feature.id) : undefined}
            modes={FEATURE_LIST_ITEM_MODES}
            disableTruncation
          />
        ))}
      </Stack>
    </ListGroup>
  )
}

function ProductOpinionNudge() {
  return (
    <Nudge
      type="stacked-detailed"
      title="Insights"
      startSlot={false}
      modes={DETAILED_NUDGE_MODES}
    >
      <Stack layoutDirection="vertical" fillWidth modes={DETAILED_NUDGE_CONTENT_MODES}>
        {OPINIONS.map((opinion) => (
          <ListItem
            key={opinion.title}
            layout="Horizontal"
            title={opinion.title}
            supportText={opinion.supportText}
            showSupportText
            leading={
              <IconCapsule
                {...(opinion.title === 'Good'
                  ? {
                      iconName: '',
                      source: (
                        <Image
                          imageSource={successIcon}
                          width={18}
                          height={18}
                          resizeMode="contain"
                          accessibilityElementsHidden
                          importantForAccessibility="no"
                        />
                      ),
                    }
                  : { iconName: opinion.iconName })}
                modes={OPINION_ICON_MODES}
                accessibilityElementsHidden
                importantForAccessibility="no"
              />
            }
            navArrow={false}
            modes={LIST_ITEM_MODES}
            disableTruncation
          />
        ))}
      </Stack>
    </Nudge>
  )
}

function LenderSection() {
  return (
    <Section
      title="About this lender"
      showSupportText={false}
      slotDirection="column"
      modes={SECTION_MODES}
      slot={
        <Stack layoutDirection="vertical" fillWidth modes={SECTION_CONTENT_MODES}>
          <ListItem
            layout="Horizontal"
            title="Jio Payments Bank"
            showSupportText={false}
            leading={
              <Avatar
                imageSource={jioLogo}
                accessibilityLabel="Jio Payments Bank"
              />
            }
            navArrow={false}
            modes={LIST_ITEM_MODES}
          />
          {LENDER_METRICS.map((metric) => (
            <Balance
              key={metric.title}
              title={metric.title}
              amount={metric.amount}
              currency=""
              modes={BALANCE_MODES}
            />
          ))}
        </Stack>
      }
    />
  )
}

function SupportingDetails({
  onFaqPress,
  onRequirementsPress,
}: Pick<ProductDetailScreenProps, 'onFaqPress' | 'onRequirementsPress'>) {
  return (
    <>
      <ListItem
        layout="Horizontal"
        title="Commonly asked questions"
        showSupportText={false}
        navArrow
        onPress={onFaqPress}
        modes={BOXED_LIST_ITEM_MODES}
        disableTruncation
      />
      <ListItem
        layout="Horizontal"
        title="You might need"
        supportText="PAN, Aadhaar, 1 nominee"
        showSupportText
        navArrow
        onPress={onRequirementsPress}
        modes={BOXED_LIST_ITEM_MODES}
        disableTruncation
      />
      <Section
        title="Eligibility"
        showSupportText={false}
        slotDirection="row"
        modes={SECTION_MODES}
        slot={
          <Stack layoutDirection="horizontal">
            <Text
              text={ELIGIBILITY}
              textAlign="Left"
              modes={ELIGIBILITY_TEXT_MODES}
              disableTruncation
            />
          </Stack>
        }
      />
    </>
  )
}

export function ProductDetailScreen({
  product,
  consentChecked,
  consentExpanded,
  onBack,
  onAssistantPress,
  onMorePress,
  onFeaturePress,
  onFaqPress,
  onRequirementsPress,
  onConsentChange,
  onReadMorePress,
  onApply,
}: ProductDetailScreenProps) {
  const isWallet = product === 'wallet'
  const productTitle = isWallet ? 'Wallet' : 'Saving account'
  const productAvatar = isWallet ? walletAvatar : savingsAvatar

  return (
    <Screen modes={SCREEN_MODES}>
      <AppBar
        type="SubPage"
        onLeadingPress={onBack}
        actionsSlot={
          <>
            <IconButton
              iconName="ic_hellojio"
              onPress={onAssistantPress}
              accessibilityLabel="Open Jio assistant"
              modes={ASSISTANT_BUTTON_MODES}
            />
            <IconButton
              iconName="ic_more_horizontal"
              onPress={onMorePress}
              accessibilityLabel="More options"
              modes={MORE_BUTTON_MODES}
            />
          </>
        }
        modes={APP_BAR_MODES}
      />

      <ScrollArea direction="vertical" style={{ flex: 1 }}>
        <HeroSection showTitle={false} showSearch={false} showFilter={false}>
          <PdpCcCard
            media={
              <Avatar
                imageSource={productAvatar}
                modes={PRODUCT_MEDIA_MODES}
                accessibilityLabel={`${productTitle} product`}
              />
            }
            title={productTitle}
            subtitle="Jio Payments Bank"
            metrics={[
              { title: 'Minimum balance', value: '₹0' },
              { title: 'Digital banking', value: '24/7' },
            ]}
            showButton={false}
            width="100%"
            accessibilityLabel={`${productTitle}, Jio Payments Bank`}
          />
          <FeatureList onFeaturePress={onFeaturePress} />
        </HeroSection>

        <VStack modes={CONTENT_MODES}>
          <ProductOpinionNudge />
          <LenderSection />
          <SupportingDetails
            onFaqPress={onFaqPress}
            onRequirementsPress={onRequirementsPress}
          />
        </VStack>

        {isWallet ? (
          <VStack modes={POWERED_BY_MODES}>
            <Text text="Powered by ZET" textAlign="Left" modes={POWERED_BY_TEXT_MODES} />
          </VStack>
        ) : null}
      </ScrollArea>

      <ActionFooter accessibilityLabel={`${productTitle} actions`}>
        <Stack layoutDirection="vertical" fillWidth>
          <ExpandableCheckbox
            label={CONSENT_LABEL}
            checked={consentChecked}
            defaultChecked
            onValueChange={onConsentChange}
            expanded={consentExpanded}
            defaultExpanded={false}
            onExpandedChange={onReadMorePress}
            readMoreLabel="Read more"
            readLessLabel="Read less"
            collapsedLines={2}
            accessibilityLabel={CONSENT_LABEL}
          />
          <Button
            label="Apply now"
            onPress={onApply}
            accessibilityHint={`Applies for ${productTitle}`}
            modes={APPLY_BUTTON_MODES}
          />
        </Stack>
      </ActionFooter>
    </Screen>
  )
}

export default ProductDetailScreen
