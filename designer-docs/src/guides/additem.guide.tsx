import { AddItemGuide } from '../ActionGuides'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

export default defineGuide({
  slug: 'additem',
  label: 'Add Item',
  icon: LEGACY_ICONS.additem,
  Component: AddItemGuide,
})
