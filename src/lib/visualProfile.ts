import type { EmotionLabel } from './experience'

export type VisualStage =
  | 'arrival'
  | 'calibration'
  | 'confirmation'
  | 'expression'
  | 'embodiment'
  | 'values'
  | 'closure'
  | 'help'

export interface VisualProfile {
  speed: number
  turbulence: number
  gravity: number
  warmth: number
  glow: string
}

const emotionProfiles: Record<EmotionLabel, Pick<VisualProfile, 'turbulence' | 'gravity' | 'glow'>> = {
  悲伤: { turbulence: 0.18, gravity: 0.8, glow: '#7692b4' },
  生气: { turbulence: 0.9, gravity: 0.18, glow: '#d1765f' },
  恨意: { turbulence: 1, gravity: 0.28, glow: '#b65c68' },
  不甘: { turbulence: 0.76, gravity: 0.12, glow: '#d59564' },
  无奈: { turbulence: 0.28, gravity: 0.62, glow: '#858b9e' },
  开心: { turbulence: 0.34, gravity: -0.2, glow: '#d9b778' },
  说不清: { turbulence: 0.4, gravity: 0.25, glow: '#8b91aa' },
}

const stageIntensity: Record<VisualStage, number> = {
  arrival: 0.42,
  calibration: 0.55,
  confirmation: 0.65,
  expression: 1,
  embodiment: 0.72,
  values: 0.45,
  closure: 0.14,
  help: 0,
}

export function getVisualProfile(stage: VisualStage, emotion: EmotionLabel): VisualProfile {
  const intensity = stageIntensity[stage]
  const profile = emotionProfiles[emotion]

  return {
    speed: stage === 'help' ? 0 : 0.18 + intensity * 0.52,
    turbulence: profile.turbulence * intensity,
    gravity: profile.gravity * intensity,
    warmth: stage === 'closure' ? 1 : stage === 'values' ? 0.55 : 0.12,
    glow: stage === 'closure' ? '#e6bd7b' : profile.glow,
  }
}
