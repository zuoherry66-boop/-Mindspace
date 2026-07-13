export interface InteractionSignal {
  x: number
  y: number
  force: number
  velocity: number
  active: boolean
  distance: number
}

export function createInteractionSignal(): InteractionSignal {
  return { x: 0, y: 0, force: 0, velocity: 0, active: false, distance: 0.5 }
}
