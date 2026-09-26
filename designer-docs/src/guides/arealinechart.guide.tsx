import { AreaLineChartGuide } from '../AreaLineChartGuide'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

export default defineGuide({
  slug: 'arealinechart',
  label: 'Area Line Chart',
  icon: LEGACY_ICONS.arealinechart,
  Component: AreaLineChartGuide,
})
