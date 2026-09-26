import type { ReactNode } from 'react'

// 18×18 navigation glyphs for guides registered before the kit. New guides
// pass their own icon to defineGuide().
export const LEGACY_ICONS: Record<string, ReactNode> = {
  button: (
    <rect x="2.25" y="5" width="13.5" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
  ),
  appbar: (
    <>
      <rect x="2" y="3" width="14" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 5.5h3M11 5.5h2.5M2.5 11.5h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  accordion: (
    <>
      <path d="M3 5.5h12M3 9h12M3 12.5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="m13 10.5 2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  accordioncheckbox: (
    <>
      <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4.2 5.5 1.1 1.1 1.8-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 5.5h4M11.5 9h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  actionfooter: (
    <>
      <path d="M2.5 4.5h13v9h-13z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 9.5h13M5 11.5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  actiontile: (
    <>
      <rect x="2.5" y="3.5" width="13" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M5 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  additem: (
    <>
      <rect x="3" y="3" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 6v6M6 9h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  attached: (
    <>
      <circle cx="7" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12.5" cy="12.5" r="2.25" fill="currentColor" />
    </>
  ),
  arealinechart: (
    <>
      <path d="M2.5 14.5h13M3.5 12.5l3-3 2.5 1.5 5-6 1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 12.5 6.5 9l2.5 1.5 5-6v10h-11z" fill="currentColor" opacity=".16" />
    </>
  ),
  allocationcomparisonchart: (
    <>
      <path d="M2.5 15.5h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 14V8h2v6M8 14V4h2v10M12 14v-3h2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3.5 6.5h3M7.5 2.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeDasharray="1 1" />
    </>
  ),
  amountinput: (
    <>
      <path d="M3 5.5h12M3 9h8M3 12.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="13.5" cy="12.5" r="2" stroke="currentColor" strokeWidth="1.35" />
    </>
  ),
  autoplaycontrol: (
    <>
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.25 6.5v5M10.75 6.5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  bottomnavitem: (
    <>
      <path d="M5.5 8.25 9 5.25l3.5 3V11h-7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M6 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  buttongroup: (
    <>
      <circle cx="3.75" cy="9" r="2.25" stroke="currentColor" strokeWidth="1.4" />
      <rect x="7.5" y="6.75" width="4" height="4.5" rx="2.25" stroke="currentColor" strokeWidth="1.4" />
      <rect x="12.75" y="6.75" width="4" height="4.5" rx="2.25" stroke="currentColor" strokeWidth="1.4" />
    </>
  ),
  avatargroup: (
    <>
      <circle cx="5.25" cy="9" r="4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="9" cy="9" r="4" fill="var(--paper, #fff)" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12.75" cy="9" r="4" fill="var(--paper, #fff)" stroke="currentColor" strokeWidth="1.4" />
    </>
  ),
  avatar: (
    <>
      <circle cx="9" cy="9" r="6.4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="7" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.8 13.2c.7-1.6 2.1-2.5 4.2-2.5s3.5.9 4.2 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </>
  ),
  hstack: (
    <>
      <rect x="2" y="6" width="3" height="6" rx="1" fill="currentColor" />
      <rect x="7.5" y="6" width="3" height="6" rx="1" fill="currentColor" />
      <rect x="13" y="6" width="3" height="6" rx="1" fill="currentColor" />
    </>
  ),
  vstack: (
    <>
      <rect x="6" y="2" width="6" height="3" rx="1" fill="currentColor" />
      <rect x="6" y="7.5" width="6" height="3" rx="1" fill="currentColor" />
      <rect x="6" y="13" width="6" height="3" rx="1" fill="currentColor" />
    </>
  ),
  stack: (
    <>
      <rect x="4" y="2.5" width="10" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="4" y="7.5" width="10" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="4" y="12.5" width="10" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  badge: (
    <><rect x="2" y="4" width="14" height="10" rx="5" stroke="currentColor" strokeWidth="1.5" /><path d="M6 9h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></>
  ),
  checkboxitem: (
    <><rect x="2" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><path d="m3.5 7 1.2 1.2 2-2.4M10 5.5h6M10 8.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></>
  ),
  checkbox: (
    <><rect x="3" y="3" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" /><path d="m5.5 9 2.4 2.3 4.7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></>
  ),
  brandchip: (
    <><rect x="1.5" y="4" width="15" height="10" rx="5" stroke="currentColor" strokeWidth="1.5" /><circle cx="6" cy="9" r="2" stroke="currentColor" strokeWidth="1.3" /><path d="M9.5 9h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></>
  ),
  breadcrumbs: (
    <>
      <path d="M2.5 5.5h4M8.5 5.5h4M14.5 5.5h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="m7 4 1.5 1.5L7 7M13 4l1.5 1.5L13 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 12.5h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
}
