import { AvatarGroupGuide } from '../AvatarGuides'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

export default defineGuide({
  slug: 'avatargroup',
  label: 'Avatar Group',
  icon: LEGACY_ICONS.avatargroup,
  Component: AvatarGroupGuide,
})
