import { describe, expect, it } from 'vitest'
// Vite resolves source imports during tests; the application tsconfig does not
// include Vite's query-module declarations.
// @ts-expect-error test-only raw source import
import canvasSource from './DreamCanvas.tsx?raw'
import { advanceMatterMemory, createMatterMemory } from './livingMatter'

describe('DreamCanvas living matter contract', () => {
  it('contains no particle field or circle-based celestial imagery', () => {
    expect(canvasSource).not.toMatch(/Particle|createParticles|star|radialGradient|\.arc\(/i)
  })

  it('keeps the same material memory while scenes change', () => {
    const memory = createMatterMemory()
    const firstIdentity = memory

    advanceMatterMemory(memory, {
      trace: 0.74,
      tension: 0.82,
      settledness: 0.18,
      releaseEnergy: 0.61,
      distance: 0.34,
      anchor: 2,
    })
    advanceMatterMemory(memory, {
      trace: 0.12,
      tension: 0.2,
      settledness: 0.86,
      releaseEnergy: 0.08,
      distance: 0.76,
      anchor: 4,
    })

    expect(memory).toBe(firstIdentity)
    expect(memory.trace).toBeGreaterThanOrEqual(0.74)
    expect(memory.releaseEnergy).toBeGreaterThanOrEqual(0.61)
    expect(memory.anchor).toBe(4)
    expect(memory.distance).toBeCloseTo(0.76)
  })
})
