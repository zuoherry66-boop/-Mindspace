import { describe, expect, it } from 'vitest'
import { levelFromTimeDomain } from './audio'

describe('levelFromTimeDomain', () => {
  it('treats a centered signal as silence', () => {
    expect(levelFromTimeDomain(new Uint8Array([128, 128, 128]))).toBe(0)
  })

  it('normalizes and clamps a loud signal', () => {
    expect(levelFromTimeDomain(new Uint8Array([0, 255, 0, 255]))).toBe(1)
  })
})
