import type { InteractionSignal } from '../lib/interaction'

type MatterInput = Pick<
  InteractionSignal,
  'trace' | 'tension' | 'settledness' | 'releaseEnergy' | 'distance' | 'anchor'
>

export interface MatterMemory {
  phase: number
  trace: number
  tension: number
  settledness: number
  releaseEnergy: number
  distance: number
  anchor: number
}

export function createMatterMemory(): MatterMemory {
  return {
    phase: 0,
    trace: 0.08,
    tension: 0,
    settledness: 1,
    releaseEnergy: 0,
    distance: 0.5,
    anchor: -1,
  }
}

export function advanceMatterMemory(
  memory: MatterMemory,
  input: MatterInput,
  response = 1,
): MatterMemory {
  const amount = clamp(response, 0, 1)
  memory.trace = Math.max(memory.trace, clamp(input.trace, 0, 1))
  memory.releaseEnergy = Math.max(memory.releaseEnergy, clamp(input.releaseEnergy, 0, 1))
  memory.tension = mix(memory.tension, clamp(input.tension, 0, 1), amount)
  memory.settledness = mix(memory.settledness, clamp(input.settledness, 0, 1), amount)
  memory.distance = clamp(input.distance, 0, 1)
  if (input.anchor >= 0) memory.anchor = input.anchor
  return memory
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value))
}

function mix(from: number, to: number, amount: number): number {
  return from + (to - from) * amount
}
