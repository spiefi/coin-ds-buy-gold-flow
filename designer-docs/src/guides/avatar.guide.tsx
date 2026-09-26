import { AvatarGuide } from '../AvatarGuides'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

export default defineGuide({
  slug: 'avatar',
  label: 'Avatar',
  icon: LEGACY_ICONS.avatar,
  Component: AvatarGuide,
})
