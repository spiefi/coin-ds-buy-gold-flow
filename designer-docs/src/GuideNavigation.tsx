import {
  useEffect,
  useLayoutEffect,
  useState,
  type MouseEvent,
} from 'react'

type GuideIconName =
  | 'button'
  | 'appbar'
  | 'accordion'
  | 'accordioncheckbox'
  | 'actionfooter'
  | 'actiontile'
  | 'additem'
  | 'hstack'
  | 'vstack'
  | 'stack'
  | 'breadcrumbs'

export const COMPONENT_NAV = [
  { slug: 'button', label: 'Button', icon: 'button' },
  { slug: 'appbar', label: 'App Bar', icon: 'appbar' },
  { slug: 'accordion', label: 'Accordion', icon: 'accordion' },
  {
    slug: 'accordioncheckbox',
    label: 'Accordion Checkbox',
    icon: 'accordioncheckbox',
  },
  { slug: 'actionfooter', label: 'Action Footer', icon: 'actionfooter' },
  { slug: 'actiontile', label: 'Action Tile', icon: 'actiontile' },
  { slug: 'additem', label: 'Add Item', icon: 'additem' },
  { slug: 'hstack', label: 'HStack', icon: 'hstack' },
  { slug: 'vstack', label: 'VStack', icon: 'vstack' },
  { slug: 'stack', label: 'Stack', icon: 'stack' },
  { slug: 'breadcrumbs', label: 'Breadcrumbs', icon: 'breadcrumbs' },
] as const satisfies ReadonlyArray<{
  slug: string
  label: string
  icon: GuideIconName
}>

export type ComponentSlug = (typeof COMPONENT_NAV)[number]['slug']

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
  return slug === 'button' ? '/#overview' : `/?component=${slug}#overview`
}

function GuideIcon({ name }: { name: GuideIconName }) {
  return (
    <svg
      className="component-icon-svg"
      viewBox="0 0 18 18"
      width="18"
      height="18"
      fill="none"
      aria-hidden="true"
    >
      {name === 'button' ? (
        <rect x="2.25" y="5" width="13.5" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      ) : name === 'appbar' ? (
        <>
          <rect x="2" y="3" width="14" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4.5 5.5h3M11 5.5h2.5M2.5 11.5h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : name === 'accordion' ? (
        <>
          <path d="M3 5.5h12M3 9h12M3 12.5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="m13 10.5 2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : name === 'accordioncheckbox' ? (
        <>
          <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="m4.2 5.5 1.1 1.1 1.8-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11.5 5.5h4M11.5 9h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : name === 'actionfooter' ? (
        <>
          <path d="M2.5 4.5h13v9h-13z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2.5 9.5h13M5 11.5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : name === 'actiontile' ? (
        <>
          <rect x="2.5" y="3.5" width="13" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="6" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.25" />
          <path d="M5 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : name === 'additem' ? (
        <>
          <rect x="3" y="3" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 6v6M6 9h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : name === 'hstack' ? (
        <>
          <rect x="2" y="6" width="3" height="6" rx="1" fill="currentColor" />
          <rect x="7.5" y="6" width="3" height="6" rx="1" fill="currentColor" />
          <rect x="13" y="6" width="3" height="6" rx="1" fill="currentColor" />
        </>
      ) : name === 'vstack' ? (
        <>
          <rect x="6" y="2" width="6" height="3" rx="1" fill="currentColor" />
          <rect x="6" y="7.5" width="6" height="3" rx="1" fill="currentColor" />
          <rect x="6" y="13" width="6" height="3" rx="1" fill="currentColor" />
        </>
      ) : name === 'stack' ? (
        <>
          <rect x="4" y="2.5" width="10" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="4" y="7.5" width="10" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="4" y="12.5" width="10" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" />
        </>
      ) : (
        <>
          <path d="M2.5 5.5h4M8.5 5.5h4M14.5 5.5h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="m7 4 1.5 1.5L7 7M13 4l1.5 1.5L13 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2.5 12.5h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

export function GuideSidebar({ active }: { active: ComponentSlug }) {
  return (
    <aside className="sidebar" aria-label="Documentation navigation">
      <a
        className="brand"
        href={guideHref('button')}
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
        {COMPONENT_NAV.map((item) => (
          <a
            className={'component-link ' + (item.slug === active ? 'is-active' : '')}
            href={guideHref(item.slug)}
            aria-current={item.slug === active ? 'page' : undefined}
            onClick={handleGuideNavigation}
            key={item.slug}
          >
            <span className="component-icon" aria-hidden="true">
              <GuideIcon name={item.icon} />
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
      <a className="brand" href={guideHref('button')} onClick={handleGuideNavigation}>
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
        {COMPONENT_NAV.map((item) => (
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
