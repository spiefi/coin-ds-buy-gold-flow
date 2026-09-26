import { useLayoutEffect, useRef } from 'react'
import { useGuideLocation } from './GuideNavigation'
import { findGuide } from './guides/registry'

function App() {
  const location = useGuideLocation()
  const previousRouteRef = useRef<string | null>(null)

  useLayoutEffect(() => {
    const routeKey = `${location.pathname}${location.search}`
    const previousRoute = previousRouteRef.current
    previousRouteRef.current = routeKey

    if (!previousRoute || previousRoute === routeKey) return

    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [location.pathname, location.search])

  const guide = findGuide(new URLSearchParams(location.search).get('component'))
  return <guide.Component />
}

export default App
