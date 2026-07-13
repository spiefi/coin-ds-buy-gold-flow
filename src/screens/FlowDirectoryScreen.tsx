import React from 'react'
import {
  AppBar,
  HeroSection,
  ListItem,
  Screen,
  ScrollArea,
  Title,
  VStack,
} from 'jfs-components'

export type AppFlow = 'zgredek' | 'credit-cards' | 'health-report'

export interface FlowDirectoryScreenProps {
  onSelectFlow: (flow: AppFlow) => void
}

const SCREEN_MODES = {
  'Color Mode': 'Light',
  'Page type': 'MainPage',
} as const

const DIRECTORY_MODES = {
  Padding: 'Default',
  'Slot gap': 'S',
  'context 9': 'Stack',
} as const

const FLOW_ITEM_MODES = {
  Context: 'ListItem',
  'List Item Style': 'Boxed',
} as const

export function FlowDirectoryScreen({ onSelectFlow }: FlowDirectoryScreenProps) {
  return (
    <Screen modes={SCREEN_MODES}>
      <ScrollArea direction="vertical" style={{ flex: 1 }}>
        <AppBar type="MainPage" />
        <HeroSection
          titleSlot={
            <Title
              title="Flow playground"
              subtitle="Choose a product flow to review"
              modes={{ context7: 'Page Hero' }}
            />
          }
          showSearch={false}
          showFilter={false}
        />
        <VStack modes={DIRECTORY_MODES} accessibilityLabel="Available flows">
          <ListItem
            layout="Horizontal"
            title="Zgredek Bank"
            supportText="Explore, account linking, Wallet and Savings details"
            showSupportText
            navArrow
            onPress={() => onSelectFlow('zgredek')}
            accessibilityLabel="Open Zgredek Bank flow"
            modes={FLOW_ITEM_MODES}
            disableTruncation
          />
          <ListItem
            layout="Horizontal"
            title="Credit Cards"
            supportText="Browse, search and filter card offers"
            showSupportText
            navArrow
            onPress={() => onSelectFlow('credit-cards')}
            accessibilityLabel="Open Credit Cards flow"
            modes={FLOW_ITEM_MODES}
            disableTruncation
          />
          <ListItem
            layout="Horizontal"
            title="Health Report"
            supportText="Health rating and spending insights"
            showSupportText
            navArrow
            onPress={() => onSelectFlow('health-report')}
            accessibilityLabel="Open Health Report flow"
            modes={FLOW_ITEM_MODES}
            disableTruncation
          />
        </VStack>
      </ScrollArea>
    </Screen>
  )
}

export default FlowDirectoryScreen
