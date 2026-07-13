import { describe, expect, it } from 'vitest'
import { getVisualProfile } from './visualProfile'

describe('getVisualProfile', () => {
  it('warms and settles the space at closure', () => {
    const arrival = getVisualProfile('arrival', '说不清')
    const closure = getVisualProfile('closure', '说不清')

    expect(closure.warmth).toBeGreaterThan(arrival.warmth)
    expect(closure.turbulence).toBeLessThan(arrival.turbulence)
  })

  it('lets anger disturb the field more than sadness', () => {
    const anger = getVisualProfile('expression', '生气')
    const sadness = getVisualProfile('expression', '悲伤')

    expect(anger.turbulence).toBeGreaterThan(sadness.turbulence)
    expect(sadness.gravity).toBeGreaterThan(anger.gravity)
  })

  it('keeps the urgent help route visually calm', () => {
    const help = getVisualProfile('help', '生气')
    expect(help.speed).toBe(0)
    expect(help.turbulence).toBe(0)
  })
})
