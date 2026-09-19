import { useEffect, useRef, useState } from 'react'
import { Image, ScrollView, Text, TextInput, View } from 'react-native'

const transition = new Proxy({}, { get: () => () => transition })

export const FadeInUp = transition
export const FadeOutUp = transition
export const FadeOut = transition
export const SlideInDown = transition
export const SlideInUp = transition
export const ReduceMotion = {
  System: 'system',
  Always: 'always',
  Never: 'never',
}
export const Easing = {
  linear: (value: number) => value,
  ease: (value: number) => value,
  cubic: (value: number) => value * value * value,
  out: (fn: unknown) => fn,
  inOut: (fn: unknown) => fn,
  bezier: () => (value: number) => value,
}

type AnimationKind = 'spring' | 'timing'

interface AnimationDescriptor<T> {
  __coinAnimation: AnimationKind
  to: T
  duration: number
  callback?: (finished: boolean) => void
}

interface WebSharedValue<T> {
  value: T
  __cancel?: () => void
}

function isAnimationDescriptor<T>(
  value: T | AnimationDescriptor<T>,
): value is AnimationDescriptor<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    '__coinAnimation' in value
  )
}

function animationProgress(kind: AnimationKind, progress: number) {
  if (kind === 'spring') {
    return 1 - Math.exp(-7 * progress) * Math.cos(10 * progress)
  }

  return 1 - (1 - progress) ** 3
}

export const useSharedValue = <T,>(initialValue: T): WebSharedValue<T> => {
  const currentValue = useRef(initialValue)
  const frame = useRef<number | null>(null)
  const [, render] = useState(0)
  const sharedValue = useRef<WebSharedValue<T> | null>(null)

  const cancel = () => {
    if (frame.current !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(frame.current)
    }
    frame.current = null
  }

  if (sharedValue.current === null) {
    const value = {} as WebSharedValue<T>

    Object.defineProperty(value, 'value', {
      enumerable: true,
      get: () => currentValue.current,
      set: (nextValue: T | AnimationDescriptor<T>) => {
        cancel()

        if (
          !isAnimationDescriptor(nextValue) ||
          typeof currentValue.current !== 'number' ||
          typeof nextValue.to !== 'number' ||
          typeof requestAnimationFrame !== 'function'
        ) {
          currentValue.current = (
            isAnimationDescriptor(nextValue) ? nextValue.to : nextValue
          ) as T
          render((version) => version + 1)
          if (isAnimationDescriptor(nextValue)) {
            nextValue.callback?.(true)
          }
          return
        }

        const from = currentValue.current
        const to = nextValue.to
        const startedAt =
          typeof performance === 'undefined' ? Date.now() : performance.now()

        const tick = (now: number) => {
          const elapsed = now - startedAt
          const progress = Math.min(1, elapsed / nextValue.duration)
          const eased = animationProgress(nextValue.__coinAnimation, progress)
          currentValue.current = (from + (to - from) * eased) as T
          render((version) => version + 1)

          if (progress < 1) {
            frame.current = requestAnimationFrame(tick)
          } else {
            currentValue.current = to as T
            frame.current = null
            nextValue.callback?.(true)
          }
        }

        frame.current = requestAnimationFrame(tick)
      },
    })

    value.__cancel = cancel
    sharedValue.current = value
  }

  useEffect(() => cancel, [])

  return sharedValue.current
}

export const useAnimatedStyle = (factory: () => object) => factory()
export const useAnimatedProps = (factory: () => object) => factory()
export const useAnimatedScrollHandler = () => () => undefined
export const useAnimatedKeyboard = () => ({
  height: { value: 0 },
  state: { value: 0 },
})
export const withTiming = <T,>(
  value: T,
  config?: { duration?: number },
  callback?: (finished: boolean) => void,
) =>
  ({
    __coinAnimation: 'timing',
    to: value,
    duration: config?.duration ?? 300,
    callback,
  }) as T
export const withSpring = <T,>(
  value: T,
  _config?: object,
  callback?: (finished: boolean) => void,
) =>
  ({
    __coinAnimation: 'spring',
    to: value,
    duration: 420,
    callback,
  }) as T
export const withRepeat = <T,>(value: T) => value
export const cancelAnimation = <T,>(value: WebSharedValue<T>) =>
  value.__cancel?.()
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
