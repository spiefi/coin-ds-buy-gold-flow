import { LayoutGuidePage } from '../LayoutGuides'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

function BreadcrumbsPage() {
  return <LayoutGuidePage guide="breadcrumbs" />
}

export default defineGuide({
  slug: 'breadcrumbs',
  label: 'Breadcrumbs',
  icon: LEGACY_ICONS.breadcrumbs,
  Component: BreadcrumbsPage,
})
