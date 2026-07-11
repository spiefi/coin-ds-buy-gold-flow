import React from 'react'
import AmountInput from 'jfs-components/src/components/AmountInput/AmountInput'
import AppBar from 'jfs-components/src/components/AppBar/AppBar'
import Button from 'jfs-components/src/components/Button/Button'
import CardBankAccount from 'jfs-components/src/components/CardBankAccount/CardBankAccount'
import IconButton from 'jfs-components/src/components/IconButton/IconButton'
import MoneyValue from 'jfs-components/src/components/MoneyValue/MoneyValue'
import NoteInput from 'jfs-components/src/components/NoteInput/NoteInput'
import Screen from 'jfs-components/src/components/Screen/Screen'
import VStack from 'jfs-components/src/components/VStack/VStack'
import jioLogoImage from '../assets/jio-logo.png'

export interface EnterAmountScreenProps {
  amount?: string
  note?: string
  onNoteChange?: (note: string) => void
  onBack?: () => void
  onAssistantPress?: () => void
  onMorePress?: () => void
  onChangeAccount?: () => void
  onPay?: () => void
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

export function EnterAmountScreen({
  amount = '5,000',
  note = '',
  onNoteChange,
  onBack,
  onAssistantPress,
  onMorePress,
  onChangeAccount,
  onPay,
}: EnterAmountScreenProps) {
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
        <AmountInput
          moneyValueSlot={<MoneyValue currency="₹" value={amount} />}
          noteInputSlot={
            <NoteInput
              value={note}
              placeholder="Add note"
              state={note ? 'Editing' : 'Idle'}
              onChangeText={onNoteChange}
            />
          }
        />

        <CardBankAccount
          institutionName="Jio Payments Bank"
          institutionAvatar={jioLogoImage}
          badge="Primary"
          items={[
            { label: 'Account type', value: 'Savings' },
            { label: 'Account number', value: '•••• 4821' },
            { label: 'Last updated', value: '10 Jul 2026' },
          ]}
          buttonLabel="Change account"
          onButtonPress={onChangeAccount}
          accessibilityLabel="Selected Jio Payments Bank account"
        />

        <Button
          label={`Pay ₹${amount}`}
          onPress={onPay}
          accessibilityHint="Confirms the gold purchase payment"
        />
      </VStack>
    </Screen>
  )
}

export default EnterAmountScreen
