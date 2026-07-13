import React, { useState } from 'react'
import { HealthReportScreen } from './HealthReportScreen'
import { SpendingScreen } from './SpendingScreen'

export type HealthReportRoute = 'health-report' | 'spending'

export const HEALTH_REPORT_ROUTES: readonly HealthReportRoute[] = [
  'health-report',
  'spending',
] as const

export interface HealthReportFlowProps {
  initialRoute?: HealthReportRoute
  onExitFlow?: () => void
}

export function HealthReportFlow({
  initialRoute = 'health-report',
  onExitFlow,
}: HealthReportFlowProps) {
  const [history, setHistory] = useState<HealthReportRoute[]>([initialRoute])
  const route = history[history.length - 1]

  const navigate = (next: HealthReportRoute) =>
    setHistory((current) => [...current, next])

  const goBack = () => {
    if (history.length > 1) {
      setHistory((current) => current.slice(0, -1))
      return
    }

    if (route === 'spending') {
      setHistory(['health-report'])
      return
    }

    onExitFlow?.()
  }

  if (route === 'spending') {
    return <SpendingScreen onBack={goBack} />
  }

  return (
    <HealthReportScreen
      onBack={goBack}
      onOpenSpending={() => navigate('spending')}
    />
  )
}

export default HealthReportFlow
