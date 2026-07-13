import React from 'react'
import {
  AppBar,
  AreaLineChart,
  Avatar,
  Button,
  CardAdvisory,
  CardInsight,
  CircularProgressBar,
  HeroSection,
  HStack,
  Icon,
  IconButton,
  IconCapsule,
  ListItem,
  MetricLegendItem,
  MonthlyStatusGrid,
  Nudge,
  SavingsGoalSummary,
  Screen,
  ScrollArea,
  Section,
  StrengthIndicator,
  Title,
  VStack,
} from 'jfs-components'
import { HealthReportMerchandisingCarousel } from './HealthReportMerchandisingCarousel'

const SCREEN_MODES = {
  'Color Mode': 'Light',
  'Page type': 'SubPage',
} as const

const APP_ACTION_MODES = {
  'Button / Size': 'S',
  Emphasis: 'Low',
  AppearanceBrand: 'Neutral',
} as const

const JIO_ACTION_MODES = {
  'Button / Size': 'S',
  Emphasis: 'Low',
  AppearanceBrand: 'Primary',
} as const

const CONTENT_MODES = {
  'Background': 'False',
} as const

const SECTION_MODES = {
  'context 8': 'Section',
} as const

const WARNING_NUDGE_MODES = {
  Context: 'Nudge&Alert',
  'Semantic Intent': 'System',
  AppearanceSystem: 'warning',
} as const

const CARD_NUDGE_MODES = {
  Context: 'Nudge&Alert',
  'Nudge padding': 'None',
  AppearanceBrand: 'Neutral',
} as const

const INSIGHT_CARD_MODES = {
  'Appearance Type': 'Brand',
  AppearanceBrand: 'Primary',
  'context 8': 'Section',
} as const

const EMERGENCY_INSIGHT_CARD_MODES = {
  'Appearance / DataViz': 'Primary',
  'context 8': 'Section',
} as const

const MORE_SECTION_MODES = {
  Emphasis: 'Medium',
  'context 8': 'Section',
  AppearanceBrand: 'Secondary',
} as const

export interface SpendingScreenProps {
  onBack: () => void
}

function InsightFooter({ body }: { body: string }) {
  return (
    <Nudge
      type="inline-compact"
      body={body}
      buttonSlot={<React.Fragment />}
      startSlot={
        <Icon iconName="ic_hellojio" modes={{ AppearanceBrand: 'Primary' }} />
      }
      modes={CARD_NUDGE_MODES}
    />
  )
}

function SpendingRateCard() {
  return (
    <CardInsight
      title="Spending rate"
      subtitle="Your spending rate compares your spending with your income"
      badge={false}
      footer={
        <InsightFooter body="Your spends increased in last 4 months. Consider cutting excess spends to save more." />
      }
      modes={INSIGHT_CARD_MODES}
    >
      <VStack modes={{ Padding: 'None', 'Slot gap': 'S' }}>
        <Title title="68%" modes={{ context7: 'Page Hero' }} />
        <AreaLineChart
          series={[
            {
              key: 'income',
              label: 'Income',
              appearance: 'Primary',
              data: [0, 11000, 9000, 17000, 33000, 30000],
            },
            {
              key: 'spends',
              label: 'Spends',
              appearance: 'Secondary',
              data: [0, 14000, 11000, 22000, 46000, 42000],
            },
          ]}
          xLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
          yMin={0}
          yMax={90000}
          numberOfTicks={4}
          height={188}
          curve="linear"
          showGrid={false}
          showXAxis
          showYAxis
          showLegend
          showDots
          interactive={false}
          formatY={(value) => (value === 0 ? '00' : `${Math.round(value / 1000)}K`)}
          accessibilityLabel="Income and spends from January to June"
        />
      </VStack>
    </CardInsight>
  )
}

const MONTHS = [
  { label: 'Jan', status: 'saved' },
  { label: 'Feb', status: 'saved' },
  { label: 'Mar', status: 'saved' },
  { label: 'Apr', status: 'saved' },
  { label: 'May', status: 'notSaved' },
  { label: 'Jun', status: 'Idle' },
  { label: 'Jul', status: 'Idle' },
  { label: 'Aug', status: 'Idle' },
  { label: 'Sep', status: 'Idle' },
  { label: 'Oct', status: 'Idle' },
  { label: 'Nov', status: 'Idle' },
  { label: 'Dec', status: 'Idle' },
] as const

function SavingsTrendCard() {
  return (
    <CardInsight
      title="Savings trend"
      subtitle="Check whether you've been saving consistently every month"
      badge={false}
      footer={
        <InsightFooter body="Try saving at least 10% of your monthly income to build a stronger financial cushion." />
      }
      modes={INSIGHT_CARD_MODES}
    >
      <MonthlyStatusGrid
        months={MONTHS.map((month) => ({ ...month }))}
        columns={4}
        legend={{
          saved: 'Healthy savings',
          notSaved: 'Low savings',
          Idle: 'Data unavailable',
        }}
        legendStatuses={['saved', 'notSaved', 'Idle']}
        accessibilityLabel="Monthly savings trend"
      />
    </CardInsight>
  )
}

function EmergencySavingsCard() {
  return (
    <CardInsight
      title="Emergency savings"
      subtitle="Know how many months of essential expenses you can cover without an income"
      badge={false}
      footer={
        <InsightFooter body="Saving more consistently can help you build your emergency fund faster." />
      }
      modes={EMERGENCY_INSIGHT_CARD_MODES}
    >
      <SavingsGoalSummary
        label="Savings progress"
        current={{ label: 'Current (6 months)', value: 240000 }}
        target={{ label: 'Recommended (8 months)', value: 480000 }}
        modes={{ AppearanceBrand: 'Secondary' }}
      >
        <MetricLegendItem
          label="Current (6 months)"
          value="₹3.6L"
          modes={{ 'Appearance / DataViz': 'Primary' }}
        />
        <MetricLegendItem
          label="Recommended (8 months)"
          value="₹4.8L"
          modes={{ 'Emphasis / DataViz': 'Medium' }}
        />
      </SavingsGoalSummary>
    </CardInsight>
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
            title="Data and consent"
            supportText="Manage, add, remove or sync accounts"
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
            title="Frequently asked questions"
            supportText="Get answers to your questions on FinScore"
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
      accessibilityLabel="More spending options"
    />
  )
}

export function SpendingScreen({ onBack }: SpendingScreenProps) {
  return (
    <Screen modes={SCREEN_MODES}>
      <ScrollArea direction="vertical" style={{ flex: 1 }}>
        <AppBar
          type="SubPage"
          onLeadingPress={onBack}
          actionsSlot={
            <HStack modes={{ Padding: 'None', 'Slot gap': 'None' }}>
              <IconButton
                iconName="ic_hellojio"
                accessibilityLabel="Hello Jio"
                modes={JIO_ACTION_MODES}
              />
              <IconButton
                iconName="ic_help"
                accessibilityLabel="Help"
                modes={APP_ACTION_MODES}
              />
            </HStack>
          }
        />
        <HeroSection showTitle={false} showSearch={false} showFilter={false}>
          <CardAdvisory
            title="Spending"
            description="Your spends score reflects how well you’re balancing your  spending and savings"
            value={25}
            valueLabel="25"
            progressSlot={
              <CircularProgressBar
                state="Active"
                value={25}
                valueLabel="25"
                accessibilityLabel="Spending score 25"
                modes={{
                  'Semantic Intent': 'System',
                  AppearanceSystem: 'warning',
                }}
              />
            }
            nudgeSlot={
              <Nudge
                type="inline-compact"
                body="Your insights are based on limited data. Link more accounts to improve accuracy."
                startSlot={<StrengthIndicator confidence="Low" />}
                buttonSlot={
                  <Button
                    label="Link"
                    modes={{ Emphasis: 'High' }}
                  />
                }
                modes={WARNING_NUDGE_MODES}
              />
            }
            accessibilityLabel="Spending score 25. Your insights are based on limited data."
            disableTruncation
            style={{ width: '100%' }}
          />
        </HeroSection>
        <VStack modes={CONTENT_MODES}>
          <SpendingRateCard />
          <SavingsTrendCard />
          <EmergencySavingsCard />
          <ListItem
            layout="Horizontal"
            title="Insights"
            showSupportText={false}
            leading={
              <Avatar
                style="Monogram"
                monogram="10"
                modes={{ 'Avatar Size': 'M' }}
              />
            }
            navArrow
            modes={{
              Context: 'ListItem',
              'List Item Style': 'Boxed',
              Emphasis: 'High',
              AppearanceBrand: 'Secondary',
            }}
            accessibilityLabel="10 insights"
          />
          <Section
            title="For you"
            supportText="Smart picks based on your spends score"
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

export default SpendingScreen
