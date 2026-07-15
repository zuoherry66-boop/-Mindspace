import { describe, expect, it } from 'vitest'
import { createInteractionSignal, settleInteraction } from './interaction'

describe('interaction memory', () => {
  it('keeps the trace left by earlier chapters when immediate input settles', () => {
    const signal = createInteractionSignal()
    Object.assign(signal, {
      x: 0.4,
      y: -0.3,
      force: 0.9,
      velocity: 0.8,
      active: true,
      trace: 0.46,
      tension: 0.7,
      releaseEnergy: 0.62,
      distance: 0.76,
      anchor: 3,
    })

    settleInteraction(signal)

    expect(signal).toMatchObject({
      x: 0.4,
      y: -0.3,
      active: false,
      force: 0,
      velocity: 0,
      trace: 0.46,
      tension: 0.7,
      releaseEnergy: 0.62,
      distance: 0.76,
      anchor: 3,
    })
  })
})
