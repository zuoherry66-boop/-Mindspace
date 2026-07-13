export interface InteractionSignal {
  x: number
  y: number
  force: number
  velocity: number
  active: boolean
  distance: number
  trace: number
  tension: number
  settledness: number
  releaseEnergy: number
  anchor: number
}

export function createInteractionSignal(): InteractionSignal {
  return {
    x: 0,
    y: 0,
    force: 0,
    velocity: 0,
    active: false,
    distance: 0.5,
    trace: 0,
    tension: 0,
    settledness: 1,
    releaseEnergy: 0,
    anchor: -1,
  }
}

export function settleInteraction(signal: InteractionSignal): void {
  signal.active = false
  signal.force = 0
  signal.velocity = 0
}
