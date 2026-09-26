import type { GuideDefinition } from './define'
import { registerGuides } from './store'

// Every src/guides/<slug>.guide.tsx registers itself. Adding a guide never
// requires editing this file, the navigation, or App.
const modules = import.meta.glob<GuideDefinition>('./*.guide.tsx', {
  eager: true,
  import: 'default',
})

registerGuides(Object.values(modules))

export { findGuide, listGuides } from './store'
