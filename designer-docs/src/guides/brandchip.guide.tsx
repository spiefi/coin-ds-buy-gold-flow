import { BrandChipGuide } from '../BrandChipGuide'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

export default defineGuide({
  slug: 'brandchip',
  label: 'Brand Chip',
  icon: LEGACY_ICONS.brandchip,
  Component: BrandChipGuide,
})
