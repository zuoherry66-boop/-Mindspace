import { describe, expect, it } from 'vitest'
import { getVisualProfile } from './visualProfile'

describe('getVisualProfile', () => {
  it('gives every emotional chapter its own material state', () => {
    const stages = [
      'arrival',
      'calibration',
      'confirmation',
      'expression',
      'embodiment',
      'values',
      'closure',
      'help',
    ] as const

    expect(stages.map((stage) => getVisualProfile(stage, '说不清').material)).toEqual([
      'slit',
      'membrane',
      'echoes',
      'rupture',
      'knot',
      'threads',
      'horizon',
      'still',
    ])
  })

  it('expresses emotion through mechanics instead of changing accent colors', () => {
    const anger = getVisualProfile('expression', '生气')
    const sadness = getVisualProfile('expression', '悲伤')
    const unwilling = getVisualProfile('expression', '不甘')

    expect(anger.tension).toBeGreaterThan(sadness.tension)
    expect(sadness.viscosity).toBeGreaterThan(anger.viscosity)
    expect(unwilling.rebound).toBeGreaterThan(sadness.rebound)
    expect(new Set([anger.accent, sadness.accent, unwilling.accent]).size).toBe(1)
  })

  it('keeps the urgent help route visually calm', () => {
    const help = getVisualProfile('help', '生气')
    expect(help.tempo).toBe(0)
    expect(help.tension).toBe(0)
  })
})
