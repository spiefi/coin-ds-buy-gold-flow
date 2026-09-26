import {
  useEffect,
  useLayoutEffect,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { HOME_SLUG, listGuides } from './guides/store'

/** A registered guide slug; see src/guides/<slug>.guide.tsx. */
export type ComponentSlug = string

export type GuideLocation = Pick<Location, 'pathname' | 'search' | 'hash'> & {
  navigationType: 'initial' | 'popstate' | 'hashchange'
}

function readGuideLocation(
  navigationType: GuideLocation['navigationType'] = 'initial',
): GuideLocation {
  if (typeof window === 'undefined') {
    return { pathname: '/', search: '', hash: '', navigationType }
  }

  return {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    navigationType,
  }
}

export function useGuideLocation() {
  const [location, setLocation] = useState<GuideLocation>(readGuideLocation)

  useEffect(() => {
    const syncLocation = (navigationType: GuideLocation['navigationType']) =>
      setLocation(readGuideLocation(navigationType))
    const handlePopState = () => syncLocation('popstate')
    const handleHashChange = () => syncLocation('hashchange')

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return location
}

function locationPath(location: GuideLocation) {
  return `${location.pathname}${location.search}${location.hash}`
}

function hashTargetId(hash: string) {
  const encodedId = hash.startsWith('#') ? hash.slice(1) : hash
  if (!encodedId) return 'overview'

  try {
    return decodeURIComponent(encodedId)
  } catch {
    return encodedId
  }
}

export function useGuidePageNavigation() {
  const location = useGuideLocation()

  useLayoutEffect(() => {
    if (location.navigationType === 'hashchange') return

    const targetId = hashTargetId(location.hash)
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, [
    location.hash,
    location.navigationType,
    location.pathname,
    location.search,
  ])

  return location
}

export function navigateGuide(url: URL) {
  const nextPath = `${url.pathname}${url.search}${url.hash}`
  const currentPath = locationPath(readGuideLocation())

  if (nextPath !== currentPath) {
    window.history.pushState({}, '', nextPath)
  }

  window.dispatchEvent(new Event('popstate'))
}

export function handleGuideNavigation(event: MouseEvent<HTMLAnchorElement>) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return
  }

  const anchor = event.currentTarget
  if (
    (anchor.target && anchor.target !== '_self') ||
    anchor.hasAttribute('download')
  ) {
    return
  }

  const url = new URL(anchor.href, window.location.href)
  if (url.origin !== window.location.origin) return

  event.preventDefault()
  navigateGuide(url)
}

export const PAGE_NAV = [
  ['overview', 'Overview'],
  ['anatomy', 'Anatomy'],
  ['configuration', 'Configuration'],
  ['states', 'States'],
  ['sizing', 'Sizing'],
  ['content', 'Content'],
  ['context', 'In context'],
  ['dos-donts', "Do & Don’ts"],
  ['sources', 'Sources'],
] as const

export function guideHref(slug: ComponentSlug) {
  return slug === HOME_SLUG ? '/#overview' : `/?component=${slug}#overview`
}

function GuideIcon({ icon }: { icon: ReactNode }) {
  return (
    <svg
      className="component-icon-svg"
      viewBox="0 0 18 18"
      width="18"
      height="18"
      fill="none"
      aria-hidden="true"
    >
      {icon}
    </svg>
  )
}

export function GuideSidebar({ active }: { active: ComponentSlug }) {
  return (
    <aside className="sidebar" aria-label="Documentation navigation">
      <a
        className="brand"
        href={guideHref(HOME_SLUG)}
        aria-label="Coin documentation home"
        onClick={handleGuideNavigation}
      >
        <span className="brand-mark" aria-hidden="true">C</span>
        <span>
          <strong>Coin</strong>
          <small>Designer docs</small>
        </span>
      </a>

      <div className="sidebar-group">
        <p>Components</p>
        {listGuides().map((item) => (
          <a
            className={'component-link ' + (item.slug === active ? 'is-active' : '')}
            href={guideHref(item.slug)}
            aria-current={item.slug === active ? 'page' : undefined}
            onClick={handleGuideNavigation}
            key={item.slug}
          >
            <span className="component-icon" aria-hidden="true">
              <GuideIcon icon={item.icon} />
            </span>
            {item.label}
          </a>
        ))}
      </div>

      <nav className="page-nav" aria-label="On this page">
        <p>On this page</p>
        {PAGE_NAV.map(([id, label]) => (
          <a href={'#' + id} key={id}>{label}</a>
        ))}
      </nav>
      <p className="sidebar-version">Coin Components · 0.1.60</p>
    </aside>
  )
}

export function GuideMobileBar() {
  return (
    <div className="mobile-bar">
      <a className="brand" href={guideHref(HOME_SLUG)} onClick={handleGuideNavigation}>
        <span className="brand-mark" aria-hidden="true">C</span>
        <strong>Coin designer docs</strong>
      </a>
      <a href="#sources">Sources</a>
    </div>
  )
}

export function MobileComponentNav({ active }: { active: ComponentSlug }) {
  return (
    <nav className="mobile-component-toc" aria-label="Components">
      <span className="mobile-component-toc-label">Components</span>
      <div>
        {listGuides().map((item) => (
          <a
            className={item.slug === active ? 'is-active' : ''}
            href={guideHref(item.slug)}
            aria-current={item.slug === active ? 'page' : undefined}
            onClick={handleGuideNavigation}
            key={item.slug}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}

export function MobilePageNav() {
  return (
    <nav className="mobile-toc" aria-label="Page sections">
      {PAGE_NAV.map(([id, label]) => (
        <a href={'#' + id} key={id}>{label}</a>
      ))}
    </nav>
  )
}
