import { LayoutGuidePage } from '../LayoutGuides'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

function VStackPage() {
  return <LayoutGuidePage guide="vstack" />
}

export default defineGuide({
  slug: 'vstack',
  label: 'VStack',
  icon: LEGACY_ICONS.vstack,
  Component: VStackPage,
})
