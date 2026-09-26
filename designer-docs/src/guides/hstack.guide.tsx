import { LayoutGuidePage } from '../LayoutGuides'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

function HStackPage() {
  return <LayoutGuidePage guide="hstack" />
}

export default defineGuide({
  slug: 'hstack',
  label: 'HStack',
  icon: LEGACY_ICONS.hstack,
  Component: HStackPage,
})
