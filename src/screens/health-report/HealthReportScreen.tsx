import React from 'react'
import {
  AppBar,
  ButtonGroup,
  CardCTA,
  Carousel,
  CircularProgressBar,
  CircularRating,
  ClusterBubble,
  CoverageBarComparison,
  CoverageRing,
  Divider,
  DonutChart,
  HeroSection,
  HStack,
  Icon,
  IconButton,
  IconCapsule,
  ListItem,
  Nudge,
  SavingsGoalSummary,
  Screen,
  ScrollArea,
  Section,
  StrengthIndicator,
  SummaryTile,
  VStack,
} from 'jfs-components'
import { HealthReportMerchandisingCarousel } from './HealthReportMerchandisingCarousel'

const SCREEN_MODES = {
  'Color Mode': 'Light',
  'Page type': 'SubPage',
} as const

const CONTENT_MODES = {
  Padding: 'Default',
  'Slot gap': 'XL',
  'Background': 'False',
  'context 9': 'Stack',
} as const

const SECTION_MODES = {
  'context 8': 'Section',
} as const

const WARNING_NUDGE_MODES = {
  Context: 'Nudge&Alert',
  'Semantic Intent': 'System',
  AppearanceSystem: 'warning',
} as const

const INSIGHT_NUDGE_MODES = {
  Context: 'Nudge&Alert',
  AppearanceBrand: 'Neutral',
} as const

const CARD_CTA_MODES = {
  Context: 'CTACard',
  AppearanceBrand: 'Secondary',
  'context 8': 'Section',
} as const

const RATING_ACTION_MODES = {
  'Button / Size': 'S',
  Emphasis: 'Low',
  AppearanceBrand: 'Neutral',
} as const

const MORE_SECTION_MODES = {
  Emphasis: 'Medium',
  'context 8': 'Section',
  AppearanceBrand: 'Secondary',
} as const

export interface HealthReportScreenProps {
  onBack: () => void
  onOpenSpending: () => void
}

function RatingCard({
  title,
  body,
  children,
}: {
  title: string
  body: string
  children: React.ReactNode
}) {
  return (
    <CardCTA
      type="Rating"
      title={title}
      body={body}
      ratingBadgeSlot={children}
      buttonSlot={
        <ButtonGroup modes={RATING_ACTION_MODES}>
          <IconButton
            iconName="ic_like"
            accessibilityLabel="Like"
            modes={RATING_ACTION_MODES}
          />
          <IconButton
            iconName="ic_dislike"
            accessibilityLabel="Dislike"
            modes={RATING_ACTION_MODES}
          />
        </ButtonGroup>
      }
      showRatingActions={false}
      modes={CARD_CTA_MODES}
    />
  )
}

function InsightsCarousel() {
  return (
    <Carousel
      type="Default"
      showPagination
      loop={false}
      itemWidth={316}
      gap={8}
      paddingHorizontal={0}
      paddingVertical={8}
      style={{ width: '100%', maxHeight: 388 }}
    >
      <RatingCard
        title="Increase your health cover by ₹5L"
        body="Your current cover is ₹1L. Aim for ₹10L to stay better protected"
      >
        <CoverageBarComparison
          height={160}
          bars={[
            {
              key: 'current',
              value: 20,
              label: '₹1L (20%)',
              legend: 'Current cover',
              modes: { 'Emphasis / DataViz': 'High' },
            },
            {
              key: 'recommended',
              value: 80,
              label: '₹10L (80%)',
              legend: 'Recommended cover',
              modes: { 'Appearance / DataViz': 'Secondary' },
            },
          ]}
          accessibilityLabel="Current health cover ₹1 lakh at 20 percent; recommended cover ₹10 lakh at 80 percent"
        />
      </RatingCard>
      <RatingCard
        title="Reduce your credit usage"
        body="You’re above the safe limit of 30%, which can bring down your credit score."
      >
        <SavingsGoalSummary
          label="Credit usage"
          current={{ label: 'Current usage', value: 64 }}
          target={{ label: 'Limit', value: 100 }}
        >
          <React.Fragment />
        </SavingsGoalSummary>
      </RatingCard>
      <RatingCard
        title="Your investment mix can improve"
        body="Your investments are well spread across categories"
      >
        <DonutChart
          size={154}
          value="₹51,230"
          label="Total invested"
          segments={[
            { value: 24 },
            { value: 20 },
            { value: 18 },
            { value: 16 },
            { value: 12 },
            { value: 10 },
          ]}
        />
      </RatingCard>
      <RatingCard
        title="Increase your health cover by ₹5L"
        body="Your current cover is ₹3L. Aim for ₹10L to stay better protected"
      >
        <HStack
          justifyHorizontal="space-between"
          alignVertical="center"
          modes={{ Padding: 'None', 'Slot gap': 'S' }}
        >
          <ClusterBubble value="3L" label="Current" size={112} />
          <ClusterBubble
            value="₹10L"
            label="Recommended"
            size={112}
            appearance="Secondary"
          />
        </HStack>
      </RatingCard>
      <RatingCard
        title="Your credit mix can improve"
        body="Most of your loans are unsecured. A balanced credit mix can help."
      >
        <CoverageRing
          value={4}
          total={7}
          supportText="Unsecured loans"
          action={<React.Fragment />}
        />
      </RatingCard>
    </Carousel>
  )
}

const HEALTH_ROWS = [
  {
    title: 'Spending',
    description: 'Learn how to spend and save better',
    score: 23,
    confidence: 'Low',
  },
  {
    title: 'Borrowing',
    description: 'know and improve your credit',
    score: 70,
    confidence: 'High',
  },
  {
    title: 'Insurance',
    description: 'Protect what matters',
    score: 64,
    confidence: 'Low',
  },
  {
    title: 'Investing',
    description: 'Know how to grow your money',
    score: 24,
    confidence: 'Low',
  },
  {
    title: 'Tax',
    description: 'Track dues and know your savings',
    score: 70,
    confidence: 'High',
  },
] as const

function HealthCard({ onOpenSpending }: { onOpenSpending: () => void }) {
  return (
    <Section
      title="Health card"
      showSupportText={false}
      slotDirection="column"
      slot={HEALTH_ROWS.flatMap((item, index) => {
        const tile = (
          <SummaryTile
            key={item.title}
            title={item.title}
            description={item.description}
            confidence={item.confidence}
            chevron
            onPress={item.title === 'Spending' ? onOpenSpending : undefined}
            accessibilityLabel={`${item.title}, score ${item.score}. ${item.description}`}
            disableTruncation
          >
            <CircularProgressBar
              state="Active"
              value={item.score}
              valueLabel={`${item.score}`}
              modes={{
                'Semantic Intent': 'System',
                AppearanceSystem: 'positive',
                Emphasis: 'High',
              }}
            />
          </SummaryTile>
        )

        if (index === HEALTH_ROWS.length - 1) return [tile]
        return [tile, <Divider key={`${item.title}-divider`} direction="horizontal" />]
      })}
      modes={SECTION_MODES}
      accessibilityLabel="Health card"
    />
  )
}

function MoreSection() {
  return (
    <Section
      title="More"
      showSupportText={false}
      slotDirection="column"
      slot={
        <>
          <ListItem
            layout="Horizontal"
            title="Data & consent"
            supportText="Manage, add, remove or sync data"
            showSupportText
            leading={
              <IconCapsule
                iconName="ic_filter_multiple"
                modes={{ AppearanceBrand: 'Secondary' }}
              />
            }
            navArrow
            modes={{ Context: 'ListItem', AppearanceBrand: 'Neutral' }}
            disableTruncation
          />
          <ListItem
            layout="Horizontal"
            title="Commonly asked questions"
            supportText="Get answers on your report"
            showSupportText
            leading={
              <IconCapsule
                iconName="ic_help"
                modes={{ AppearanceBrand: 'Secondary' }}
              />
            }
            navArrow
            modes={{ Context: 'ListItem', AppearanceBrand: 'Neutral' }}
            disableTruncation
          />
        </>
      }
      modes={MORE_SECTION_MODES}
      accessibilityLabel="More health report options"
    />
  )
}

export function HealthReportScreen({
  onBack,
  onOpenSpending,
}: HealthReportScreenProps) {
  return (
    <Screen modes={SCREEN_MODES}>
      <ScrollArea direction="vertical" style={{ flex: 1 }}>
        <AppBar type="SubPage" onLeadingPress={onBack} />
        <HeroSection
          title="Health Report"
          subtitle=""
          showSearch={false}
          showFilter={false}
        >
          <CircularRating
            value={32}
            label="Rating"
            tierLabel="Needs attention"
            footerText="Updated on 1 March"
            showFooterIcon
            nudgeSlot={
              <Nudge
                type="inline-compact"
                body="Your data confidence is low, add more accounts to improve your rating."
                buttonLabel="Add"
                startSlot={<StrengthIndicator confidence="Low" />}
                modes={WARNING_NUDGE_MODES}
              />
            }
            accessibilityLabel="Health rating 32. Needs attention. Updated on 1 March."
          />
        </HeroSection>
        <VStack modes={CONTENT_MODES}>
          <Nudge
            type="inline-compact"
            body="Your spending rose in last 4 months, reducing this can help you save more consistently."
            buttonSlot={<React.Fragment />}
            startSlot={
              <Icon
                iconName="ic_hellojio"
                modes={{ AppearanceBrand: 'Primary' }}
              />
            }
            modes={INSIGHT_NUDGE_MODES}
          />
          <Section
            title="Insights"
            showSupportText={false}
            onPress={() => {}}
            slotDirection="column"
            slot={<InsightsCarousel />}
            modes={SECTION_MODES}
            accessibilityLabel="Insights"
          />
          <HealthCard onOpenSpending={onOpenSpending} />
          <Section
            title="For you"
            supportText="Smart picks based on your score"
            showSupportText
            onPress={() => {}}
            slotDirection="column"
            slot={<HealthReportMerchandisingCarousel />}
            modes={{ ...SECTION_MODES, 'Slot gap': 'S' }}
            accessibilityLabel="Recommended products"
          />
          <MoreSection />
        </VStack>
      </ScrollArea>
    </Screen>
  )
}

export default HealthReportScreen
