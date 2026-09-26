import { BottomNavItemGuide } from '../BottomNavItemGuide'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

export default defineGuide({
  slug: 'bottomnavitem',
  label: 'Bottom Nav Item',
  icon: LEGACY_ICONS.bottomnavitem,
  Component: BottomNavItemGuide,
})
