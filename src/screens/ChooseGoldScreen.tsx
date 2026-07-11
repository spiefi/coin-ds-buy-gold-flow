import React from 'react'
import type { ImageSourcePropType } from 'react-native'
import AppBar from 'jfs-components/src/components/AppBar/AppBar'
import Button from 'jfs-components/src/components/Button/Button'
import IconButton from 'jfs-components/src/components/IconButton/IconButton'
import ProductOverview from 'jfs-components/src/components/ProductOverview/ProductOverview'
import Screen from 'jfs-components/src/components/Screen/Screen'
import VStack from 'jfs-components/src/components/VStack/VStack'
import goldCoinImage from '../assets/gold-coin.png'
import jioLogoImage from '../assets/jio-logo.png'

export interface ChooseGoldScreenProps {
  goldImageSource?: ImageSourcePropType | string
  goldLabelImageSource?: ImageSourcePropType | string
  onBack?: () => void
  onAssistantPress?: () => void
  onMorePress?: () => void
  onBuyGold?: () => void
}

const SCREEN_MODES = {
  'Color Mode': 'Light',
  'Page type': 'SubPage',
} as const

const CONTENT_MODES = {
  'Slot gap': 'XL',
  Padding: 'Default',
  'context 9': 'Stack',
} as const

export function ChooseGoldScreen({
  goldImageSource = goldCoinImage,
  goldLabelImageSource = jioLogoImage,
  onBack,
  onAssistantPress,
  onMorePress,
  onBuyGold,
}: ChooseGoldScreenProps) {
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
              modes={{ 'Button / Size': 'S', Emphasis: 'Low', Appearance: 'Primary' }}
            />
            <IconButton
              iconName="ic_more_horizontal"
              onPress={onMorePress}
              accessibilityLabel="More options"
              modes={{
                'Button / Size': 'S',
                Emphasis: 'Low',
                AppearanceBrand: 'Neutral',
              }}
            />
          </>
        }
      />

      <VStack modes={CONTENT_MODES} style={{ flex: 1 }}>
        <ProductOverview
          imageSource={goldImageSource}
          labelImageSource={goldLabelImageSource}
          label="Gold"
          productName="0.5g Gold Coin"
          description="Your gold is insured from our vault to you. If lost or damaged, we’ll replace it."
          stats={[
            { value: '995', label: 'Purity' },
            { value: '3%', label: 'GST' },
          ]}
        />

        <Button
          label="Buy gold"
          onPress={onBuyGold}
          accessibilityHint="Continues to the purchase amount screen"
        />
      </VStack>
    </Screen>
  )
}

export default ChooseGoldScreen
