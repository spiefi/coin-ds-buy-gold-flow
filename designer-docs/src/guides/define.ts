import type { ComponentType, ReactNode } from 'react'

export type GuideDefinition = {
  /** Route slug, /?component=<slug>. Must match the file name <slug>.guide.tsx. */
  slug: string
  /** Readable display name. Used for the navigation and the page title. */
  label: string
  /** Children of an 18×18 SVG used as the navigation icon. */
  icon: ReactNode
  Component: ComponentType
}

export function defineGuide(guide: GuideDefinition) {
  return guide
}
