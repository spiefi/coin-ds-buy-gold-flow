// Development helper: checks guides in hidden iframes and returns only the
// problems. Usage in the browser console or a javascript tool call:
//   await guideKitSurvey(['badge', 'checkbox'])
// An empty object means every listed guide passed at every width.

type SurveyResult = Record<string, string[]>

async function survey(slugs: string[], widths: number[] = [1280, 390]): Promise<SurveyResult> {
  const problems: SurveyResult = {}
  for (const width of widths) {
    for (const slug of slugs) {
      const frame = document.createElement('iframe')
      frame.style.cssText = `position:fixed;left:0;top:0;width:${width}px;height:900px;opacity:0.01;pointer-events:none`
      frame.src = `/?component=${slug}`
      document.body.appendChild(frame)
      await new Promise((resolve) => frame.addEventListener('load', resolve, { once: true }))
      await new Promise((resolve) => setTimeout(resolve, 2500))
      const doc = frame.contentDocument
      const win = frame.contentWindow as (Window & { __guideKit?: Record<string, string[]> }) | null
      const found: string[] = []
      if (!doc?.querySelector('h1')) found.push('page did not render')
      const issues = Object.values(win?.__guideKit ?? {}).flat()
      found.push(...issues)
      const pins = doc?.querySelectorAll('#anatomy .gk-anatomy-pin').length ?? 0
      const legend = doc?.querySelectorAll('#anatomy .gk-anatomy-legend ol > li').length ?? 0
      if (pins !== legend) found.push(`${pins} pins for ${legend} legend rows`)
      if (doc && doc.documentElement.scrollWidth > width) found.push('page scrolls horizontally')
      if (found.length) problems[`${slug}@${width}`] = found
      frame.remove()
    }
  }
  return problems
}

if (import.meta.env.DEV && typeof window !== 'undefined') {
  ;(window as unknown as { guideKitSurvey: typeof survey }).guideKitSurvey = survey
}
