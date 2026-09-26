import { LayoutGuidePage } from '../LayoutGuides'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

function StackPage() {
  return <LayoutGuidePage guide="stack" />
}

export default defineGuide({
  slug: 'stack',
  label: 'Stack',
  icon: LEGACY_ICONS.stack,
  Component: StackPage,
})
