import React from 'react'

type SvgProps = { children?: React.ReactNode; [key: string]: any }

const element = (tag: string) =>
  React.forwardRef<SVGElement, SvgProps>(({ children, ...props }, ref) =>
    React.createElement(tag, { ...props, ref }, children),
  )

export const Svg = element('svg')
export const Path = element('path')
export const Circle = element('circle')
export const Line = element('line')
export const Rect = element('rect')
export const Defs = element('defs')
export const LinearGradient = element('linearGradient')
export const Stop = element('stop')
export const Mask = element('mask')
export const Filter = element('filter')
export const FeGaussianBlur = element('feGaussianBlur')
export const Image = element('image')
export const ForeignObject = element('foreignObject')
export const Polyline = element('polyline')

export const SvgXml = ({ xml, ...props }: SvgProps & { xml?: string }) => (
  <span
    {...props}
    dangerouslySetInnerHTML={{ __html: typeof xml === 'string' ? xml : '' }}
  />
)

export const SvgUri = ({ uri, ...props }: SvgProps & { uri?: string }) => (
  <img {...props} src={uri} alt="" />
)

export default Svg
