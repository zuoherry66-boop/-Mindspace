import { describe, expect, it } from 'vitest'
import { clampGesture, interpretGesture } from './gesture'

describe('interpretGesture', () => {
  it('reads a downward retreat as heavy and withdrawing', () => {
    expect(interpretGesture({ x: -0.72, y: 0.81 })).toEqual({
      energy: 'sink',
      body: 'stomach',
      impulse: 'hide',
    })
  })

  it('reads an upward push as restless and fighting', () => {
    expect(interpretGesture({ x: 0.76, y: -0.68 })).toEqual({
      energy: 'restless',
      body: 'head',
      impulse: 'fight',
    })
  })

  it('allows stillness to remain unclear instead of forcing a label', () => {
    expect(interpretGesture({ x: 0.08, y: -0.06 })).toEqual({
      energy: 'unclear',
      body: 'chest',
      impulse: 'stay',
    })
  })

  it('clamps pointer input to the interaction field', () => {
    expect(clampGesture({ x: 1.8, y: -2.2 })).toEqual({ x: 1, y: -1 })
  })
})
