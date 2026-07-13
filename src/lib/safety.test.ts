import { describe, expect, it } from 'vitest'
import { assessSafety, normalizeUserText } from './safety'

describe('safety boundary', () => {
  it('routes explicit self-harm language to urgent human support', () => {
    expect(assessSafety('我真的活不下去了，想结束生命')).toBe('urgent')
  })

  it('routes explicit threats toward others to urgent human support', () => {
    expect(assessSafety('我现在想伤害别人')).toBe('urgent')
  })

  it('does not classify ordinary frustration as an emergency', () => {
    expect(assessSafety('我很生气，也觉得这件事太不公平了')).toBe('normal')
  })

  it('trims and caps user text before it enters the experience state', () => {
    const longText = `  ${'心事'.repeat(400)}  `
    const result = normalizeUserText(longText)

    expect(result.length).toBe(500)
    expect(result.startsWith('心事')).toBe(true)
  })
})
