import { AppBarGuide } from '../AppBarGuide'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

export default defineGuide({
  slug: 'appbar',
  label: 'App Bar',
  icon: LEGACY_ICONS.appbar,
  Component: AppBarGuide,
})
