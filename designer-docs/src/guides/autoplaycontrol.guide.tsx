import { AutoplayControlGuide } from '../AutoplayControlGuide'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

export default defineGuide({
  slug: 'autoplaycontrol',
  label: 'Autoplay Control',
  icon: LEGACY_ICONS.autoplaycontrol,
  Component: AutoplayControlGuide,
})
