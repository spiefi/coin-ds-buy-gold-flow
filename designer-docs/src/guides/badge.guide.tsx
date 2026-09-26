import { BadgeGuide } from '../BadgeGuide'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

export default defineGuide({
  slug: 'badge',
  label: 'Badge',
  icon: LEGACY_ICONS.badge,
  Component: BadgeGuide,
})
