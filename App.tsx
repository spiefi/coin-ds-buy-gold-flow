import React, { useState } from 'react'
import { ChooseGoldScreen, EnterAmountScreen } from './src/screens'

type Route = 'choose-gold' | 'enter-amount'

export default function App() {
  const [route, setRoute] = useState<Route>('choose-gold')
  const [note, setNote] = useState('')

  if (route === 'enter-amount') {
    return (
      <EnterAmountScreen
        note={note}
        onNoteChange={setNote}
        onBack={() => setRoute('choose-gold')}
      />
    )
  }

  return <ChooseGoldScreen onBuyGold={() => setRoute('enter-amount')} />
}
