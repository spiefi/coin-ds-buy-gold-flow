import { useEffect, type ReactNode } from 'react'
import {
  GuideMobileBar,
  GuideSidebar,
  MobileComponentNav,
  MobilePageNav,
  PAGE_NAV,
  type ComponentSlug,
} from './GuideNavigation'

type PageNavEntry = (typeof PAGE_NAV)[number]

export type GuideSectionId = Exclude<PageNavEntry[0], 'overview'>

export type ComponentGuideMetadata = {
  slug: ComponentSlug
  name: string
  summary: string
  corePrinciple: string
  figmaUrl: string
  storybookUrl: string
}

export type GuideSection = {
  header: string
  title: string
  description: ReactNode
  body: ReactNode
}

export type GuideSectionSlots = {
  [SectionId in GuideSectionId]: GuideSection
}

export type ComponentGuideTemplateProps = {
  metadata: ComponentGuideMetadata
  playground: ReactNode
  sections: GuideSectionSlots
}

const SECTION_NAV = PAGE_NAV.slice(1) as ReadonlyArray<
  readonly [GuideSectionId, string]
>

function SourceLink({ href, children }: { href: string; children: string }) {
  return (
    <a className="source-link" href={href} target="_blank" rel="noreferrer">
      {children}
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
      </svg>
    </a>
  )
}

function SectionHeader({ section }: { section: GuideSection }) {
  return (
    <header className="section-header">
      <p className="eyebrow">{section.header}</p>
      <h2>{section.title}</h2>
      <p>{section.description}</p>
    </header>
  )
}

export function ComponentGuideTemplate({
  metadata,
  playground,
  sections,
}: ComponentGuideTemplateProps) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = `${metadata.name} · Coin designer documentation`
    return () => {
      document.title = previousTitle
    }
  }, [metadata.name])

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <GuideSidebar active={metadata.slug} />

      <main id="main-content" className="content">
        <GuideMobileBar />
        <MobileComponentNav active={metadata.slug} />
        <MobilePageNav />

        <article>
          <section id="overview" className="hero-section anchor-section">
            <div className="hero-copy">
              <p className="breadcrumb">Components / {metadata.name}</p>
              <div className="hero-title-row">
                <h1>{metadata.name}</h1>
                <span className="public-badge">Public component</span>
              </div>
              <p className="hero-lede">{metadata.summary}</p>
              <p className="recommendation-label">Usage recommendations</p>
              <div className="hero-links">
                <SourceLink href={metadata.figmaUrl}>Open in Figma</SourceLink>
                <SourceLink href={metadata.storybookUrl}>View Storybook</SourceLink>
              </div>
            </div>

            <div className="principle-card">
              <span className="principle-number" aria-hidden="true">
                01
              </span>
              <p className="eyebrow">Core principle</p>
              <p>{metadata.corePrinciple}</p>
            </div>
          </section>

          <section className="playground" aria-labelledby="playground-title">
            <div className="playground-heading">
              <div>
                <p className="eyebrow">Try it</p>
                <h2 id="playground-title">Explore the component</h2>
              </div>
              <p>Use the live example to compare the supported component behavior.</p>
            </div>
            <div className="playground-grid">{playground}</div>
          </section>

          {SECTION_NAV.map(([id]) => {
            const section = sections[id]
            return (
              <section
                className={`doc-section anchor-section${id === 'sources' ? ' sources-section' : ''}`}
                id={id}
                key={id}
              >
                <SectionHeader section={section} />
                {section.body}
              </section>
            )
          })}
        </article>

        <footer>
          <span>Coin designer documentation</span>
          <a href="#overview">Back to top ↑</a>
        </footer>
      </main>
    </div>
  )
}
