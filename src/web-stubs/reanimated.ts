import { Image, ScrollView, Text, TextInput, View } from 'react-native'

const transition = new Proxy(
  {},
  { get: () => () => transition },
)

export const FadeInUp = transition
export const FadeOutUp = transition
export const FadeOut = transition
export const SlideInDown = transition
export const SlideInUp = transition
export const ReduceMotion = { System: 'system', Always: 'always', Never: 'never' }
export const Easing = {
  linear: (value: number) => value,
  ease: (value: number) => value,
  cubic: (value: number) => value * value * value,
  out: (fn: unknown) => fn,
  inOut: (fn: unknown) => fn,
  bezier: () => (value: number) => value,
}

export const useSharedValue = <T,>(value: T) => ({ value })
export const useAnimatedStyle = (factory: () => object) => factory()
export const useAnimatedProps = (factory: () => object) => factory()
export const useAnimatedScrollHandler = () => () => undefined
export const useAnimatedKeyboard = () => ({ height: { value: 0 }, state: { value: 0 } })
export const withTiming = <T,>(value: T) => value
export const withSpring = <T,>(value: T) => value
export const withRepeat = <T,>(value: T) => value
export const cancelAnimation = () => undefined
export const runOnJS = <T extends (...args: never[]) => unknown>(fn: T) => fn
export const interpolate = (value: number) => value

export const Animated = {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  createAnimatedComponent: <T,>(component: T) => component,
}

export default Animated
