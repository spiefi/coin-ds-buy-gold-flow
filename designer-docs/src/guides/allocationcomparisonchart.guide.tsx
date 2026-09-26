import { AllocationComparisonChartGuide } from '../AllocationComparisonChartGuide'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

export default defineGuide({
  slug: 'allocationcomparisonchart',
  label: 'Allocation Comparison Chart',
  icon: LEGACY_ICONS.allocationcomparisonchart,
  Component: AllocationComparisonChartGuide,
})
