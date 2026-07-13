import React, { useEffect, useState } from 'react'
import {
  CREDIT_CARD_ROUTES,
  CreditCardsFlow,
  FlowDirectoryScreen,
  HEALTH_REPORT_ROUTES,
  HealthReportFlow,
  ZGREDEK_ROUTES,
  ZgredekFlow,
  type AppFlow,
  type CreditCardsRoute,
  type HealthReportRoute,
  type ZgredekRoute,
} from './src/screens'

type AppLocation =
  | { flow: 'directory' }
  | { flow: 'zgredek'; route: ZgredekRoute }
  | { flow: 'credit-cards'; route: CreditCardsRoute }
  | { flow: 'health-report'; route: HealthReportRoute }

function readAppLocation(): AppLocation {
  const params = new URLSearchParams(window.location.search)
  const requestedFlow = params.get('flow')
  const requestedRoute = params.get('route')

  if (
    requestedFlow === 'health-report' ||
    HEALTH_REPORT_ROUTES.includes(requestedRoute as HealthReportRoute)
  ) {
    return {
      flow: 'health-report',
      route: HEALTH_REPORT_ROUTES.includes(requestedRoute as HealthReportRoute)
        ? (requestedRoute as HealthReportRoute)
        : 'health-report',
    }
  }

  if (
    requestedFlow === 'credit-cards' ||
    CREDIT_CARD_ROUTES.includes(requestedRoute as CreditCardsRoute)
  ) {
    return {
      flow: 'credit-cards',
      route: CREDIT_CARD_ROUTES.includes(requestedRoute as CreditCardsRoute)
        ? (requestedRoute as CreditCardsRoute)
        : 'credit-cards',
    }
  }

  if (
    requestedFlow === 'zgredek' ||
    ZGREDEK_ROUTES.includes(requestedRoute as ZgredekRoute)
  ) {
    return {
      flow: 'zgredek',
      route: ZGREDEK_ROUTES.includes(requestedRoute as ZgredekRoute)
        ? (requestedRoute as ZgredekRoute)
        : 'explore',
    }
  }

  return { flow: 'directory' }
}

export default function App() {
  const [location, setLocation] = useState<AppLocation>(readAppLocation)

  useEffect(() => {
    const handlePopState = () => setLocation(readAppLocation())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const openFlow = (flow: AppFlow) => {
    const route =
      flow === 'zgredek'
        ? 'explore'
        : flow === 'health-report'
          ? 'health-report'
          : 'credit-cards'
    window.history.pushState({}, '', `?flow=${flow}&route=${route}`)

    if (flow === 'zgredek') {
      setLocation({ flow, route: 'explore' })
      return
    }

    if (flow === 'health-report') {
      setLocation({ flow, route: 'health-report' })
      return
    }

    setLocation({ flow, route: 'credit-cards' })
  }

  const openDirectory = () => {
    window.history.pushState({}, '', window.location.pathname)
    setLocation({ flow: 'directory' })
  }

  if (location.flow === 'directory') {
    return <FlowDirectoryScreen onSelectFlow={openFlow} />
  }

  if (location.flow === 'credit-cards') {
    return (
      <CreditCardsFlow
        key={`credit-cards-${location.route}`}
        initialRoute={location.route}
        onExitFlow={openDirectory}
      />
    )
  }

  if (location.flow === 'health-report') {
    return (
      <HealthReportFlow
        key={`health-report-${location.route}`}
        initialRoute={location.route}
        onExitFlow={openDirectory}
      />
    )
  }

  return (
    <ZgredekFlow
      key={`zgredek-${location.route}`}
      initialRoute={location.route}
      onExitFlow={openDirectory}
    />
  )
}
