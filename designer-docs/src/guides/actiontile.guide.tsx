import { ActionTileGuide } from '../ActionGuides'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

export default defineGuide({
  slug: 'actiontile',
  label: 'Action Tile',
  icon: LEGACY_ICONS.actiontile,
  Component: ActionTileGuide,
})
