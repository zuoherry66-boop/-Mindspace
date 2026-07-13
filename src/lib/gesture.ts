export interface GesturePoint {
  x: number
  y: number
}

export interface GestureMeaning {
  energy: 'sink' | 'restless' | 'unclear'
  body: 'head' | 'stomach' | 'chest' | 'whole-body' | 'throat'
  impulse: 'hide' | 'fight' | 'hold-on' | 'stay'
}

export function clampGesture(point: GesturePoint): GesturePoint {
  return {
    x: Math.max(-1, Math.min(1, point.x)),
    y: Math.max(-1, Math.min(1, point.y)),
  }
}

export function interpretGesture(point: GesturePoint): GestureMeaning {
  const { x, y } = clampGesture(point)
  const magnitude = Math.hypot(x, y)

  if (magnitude < 0.22) {
    return { energy: 'unclear', body: 'chest', impulse: 'stay' }
  }

  const energy = y > 0.28 ? 'sink' : y < -0.28 ? 'restless' : 'unclear'
  const impulse = x < -0.28 ? 'hide' : x > 0.28 ? 'fight' : 'hold-on'
  const body = y < -0.55
    ? 'head'
    : y > 0.55
      ? 'stomach'
      : Math.abs(x) > 0.7
        ? 'whole-body'
        : 'throat'

  return { energy, body, impulse }
}
