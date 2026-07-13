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

export type SceneMaterial =
  | 'slit'
  | 'membrane'
  | 'echoes'
  | 'rupture'
  | 'knot'
  | 'threads'
  | 'horizon'
  | 'still'

export interface VisualProfile {
  material: SceneMaterial
  tempo: number
  tension: number
  viscosity: number
  rebound: number
  weight: number
  blur: number
  accent: string
  // Compatibility values for the current renderer. They disappear when the
  // persistent living-matter canvas replaces the particle field.
  speed: number
  turbulence: number
  gravity: number
  warmth: number
  glow: string
}

type EmotionMechanics = Pick<
  VisualProfile,
  'tempo' | 'tension' | 'viscosity' | 'rebound' | 'weight' | 'blur'
>

const LIVING_TRACE = '#F08A72'

const emotionMechanics: Record<EmotionLabel, EmotionMechanics> = {
  悲伤: { tempo: 0.26, tension: 0.22, viscosity: 0.94, rebound: 0.18, weight: 0.9, blur: 0.7 },
  生气: { tempo: 0.86, tension: 0.96, viscosity: 0.22, rebound: 0.78, weight: 0.48, blur: 0.08 },
  恨意: { tempo: 0.58, tension: 0.88, viscosity: 0.42, rebound: 0.38, weight: 0.7, blur: 0.02 },
  不甘: { tempo: 0.64, tension: 0.72, viscosity: 0.48, rebound: 0.94, weight: 0.42, blur: 0.16 },
  无奈: { tempo: 0.2, tension: 0.18, viscosity: 0.72, rebound: 0.14, weight: 0.68, blur: 0.5 },
  开心: { tempo: 0.52, tension: 0.28, viscosity: 0.18, rebound: 0.64, weight: -0.22, blur: 0.12 },
  说不清: { tempo: 0.34, tension: 0.38, viscosity: 0.6, rebound: 0.34, weight: 0.3, blur: 0.82 },
}

const stageMaterials: Record<VisualStage, SceneMaterial> = {
  arrival: 'slit',
  calibration: 'membrane',
  confirmation: 'echoes',
  expression: 'rupture',
  embodiment: 'knot',
  values: 'threads',
  closure: 'horizon',
  help: 'still',
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
  const mechanics = emotionMechanics[emotion]
  const tempo = mechanics.tempo * intensity
  const tension = mechanics.tension * intensity
  const weight = mechanics.weight * intensity

  return {
    material: stageMaterials[stage],
    tempo,
    tension,
    viscosity: mechanics.viscosity,
    rebound: mechanics.rebound,
    weight,
    blur: mechanics.blur,
    accent: LIVING_TRACE,
    speed: tempo,
    turbulence: tension,
    gravity: weight,
    warmth: stage === 'closure' ? 1 : stage === 'values' ? 0.55 : 0.12,
    glow: LIVING_TRACE,
  }
}
