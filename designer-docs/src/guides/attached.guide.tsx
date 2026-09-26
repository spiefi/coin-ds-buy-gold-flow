import { AttachedGuide } from '../AttachedGuide'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

export default defineGuide({
  slug: 'attached',
  label: 'Attached',
  icon: LEGACY_ICONS.attached,
  Component: AttachedGuide,
})
