import { useEffect, useRef, type RefObject } from 'react'
import type { EmotionLabel } from '../lib/experience'
import type { InteractionSignal } from '../lib/interaction'
import {
  getVisualProfile,
  type SceneMaterial,
  type VisualProfile,
  type VisualStage,
} from '../lib/visualProfile'
import {
  advanceMatterMemory,
  createMatterMemory,
  type MatterMemory,
} from './livingMatter'

interface DreamCanvasProps {
  stage: VisualStage
  emotion: EmotionLabel
  microphoneLevel: number
  interactionRef: RefObject<InteractionSignal>
  reducedMotion: boolean
}

interface PointerPosition {
  x: number
  y: number
}

interface SceneState {
  profile: VisualProfile
  previousMaterial: SceneMaterial
  transition: number
}

const FIELD = '#070809'
const SURFACE = '#171b19'
const SURFACE_LIGHT = '#2b312e'
const FOG = '#4e5752'
const QUIET = '#b9b8b2'
const TAU = Math.PI * 2

const MATERIAL_TRACE: Record<SceneMaterial, number> = {
  slit: 0.08,
  membrane: 0.18,
  echoes: 0.3,
  rupture: 0.47,
  knot: 0.58,
  threads: 0.76,
  horizon: 1,
  still: 1,
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value))
}

function mix(from: number, to: number, amount: number): number {
  return from + (to - from) * amount
}

function ease(value: number): number {
  const bounded = clamp(value, 0, 1)
  return bounded * bounded * (3 - 2 * bounded)
}

function profileToward(current: VisualProfile, target: VisualProfile, amount: number): VisualProfile {
  return {
    ...target,
    tempo: mix(current.tempo, target.tempo, amount),
    tension: mix(current.tension, target.tension, amount),
    viscosity: mix(current.viscosity, target.viscosity, amount),
    rebound: mix(current.rebound, target.rebound, amount),
    weight: mix(current.weight, target.weight, amount),
    blur: mix(current.blur, target.blur, amount),
  }
}

function drawBackground(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  phase: number,
  profile: VisualProfile,
  pointer: PointerPosition,
  signal: InteractionSignal,
  memory: MatterMemory,
  voice: number,
) {
  context.fillStyle = FIELD
  context.fillRect(0, 0, width, height)

  const response = 1 - profile.viscosity * 0.72
  const pullX = (pointer.x * 0.35 + signal.x * 0.65) * width * 0.06 * response
  const pullY = (pointer.y * 0.3 + signal.y * 0.7) * height * 0.05 * response
  const agitation = profile.tension + signal.force * 0.55 + memory.tension * 0.38 + voice * 0.72

  for (let layer = 0; layer < 5; layer += 1) {
    const depth = layer / 4
    const baseline = height * (0.16 + depth * 0.18)
    const wave = 18 + depth * 34 + agitation * 24
    const drift = Math.sin(phase * (0.35 + profile.rebound * 0.42) + layer * 1.37) * wave
    const gradient = context.createLinearGradient(0, baseline, width, height)
    gradient.addColorStop(0, layer % 2 === 0 ? SURFACE : FIELD)
    gradient.addColorStop(0.5, layer % 2 === 0 ? SURFACE_LIGHT : SURFACE)
    gradient.addColorStop(1, FIELD)

    context.beginPath()
    context.moveTo(-width * 0.08, height + 2)
    context.lineTo(-width * 0.08, baseline + drift)
    context.bezierCurveTo(
      width * 0.18,
      baseline - wave + pullY,
      width * 0.34 + pullX,
      baseline + wave * 0.72,
      width * 0.52,
      baseline + drift * 0.28 + profile.weight * height * 0.03,
    )
    context.bezierCurveTo(
      width * 0.69 - pullX,
      baseline - wave * 0.58,
      width * 0.84,
      baseline + wave + pullY,
      width * 1.08,
      baseline + drift * 0.45,
    )
    context.lineTo(width * 1.08, height + 2)
    context.closePath()
    context.globalAlpha = 0.2 + depth * 0.11
    context.fillStyle = gradient
    context.fill()
  }
  context.globalAlpha = 1

  const veil = context.createLinearGradient(0, 0, 0, height)
  veil.addColorStop(0, 'rgba(7, 8, 9, 0.12)')
  veil.addColorStop(0.56, 'rgba(7, 8, 9, 0)')
  veil.addColorStop(1, 'rgba(7, 8, 9, 0.72)')
  context.fillStyle = veil
  context.fillRect(0, 0, width, height)
}

function drawSlit(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  phase: number,
  profile: VisualProfile,
  signal: InteractionSignal,
  opacity: number,
) {
  const centerX = width * (0.54 + signal.x * 0.025)
  const centerY = height * (0.5 + signal.y * 0.018)
  const opening = 8 + signal.force * 22 + profile.tension * 12
  const length = height * (0.14 + signal.force * 0.09)
  const sway = Math.sin(phase * 0.6) * (2 + profile.rebound * 5)

  context.save()
  context.globalAlpha = opacity
  context.fillStyle = FIELD
  context.beginPath()
  context.moveTo(centerX - opening, centerY - length)
  context.bezierCurveTo(centerX - opening * 1.4 + sway, centerY - length * 0.35, centerX, centerY, centerX - opening * 0.6, centerY + length)
  context.bezierCurveTo(centerX + opening * 0.9, centerY + length * 0.42, centerX + opening * 1.25 - sway, centerY - length * 0.45, centerX + opening, centerY - length)
  context.closePath()
  context.fill()

  context.strokeStyle = FOG
  context.lineWidth = 1
  context.globalAlpha = opacity * 0.34
  context.beginPath()
  context.moveTo(centerX - opening * 2.2, centerY - length * 1.15)
  context.bezierCurveTo(centerX - opening * 2.8 + sway, centerY - length * 0.2, centerX - opening, centerY + length * 0.28, centerX - opening * 1.7, centerY + length * 1.12)
  context.stroke()
  context.beginPath()
  context.moveTo(centerX + opening * 2.1, centerY - length * 1.08)
  context.bezierCurveTo(centerX + opening * 2.7 - sway, centerY - length * 0.18, centerX + opening, centerY + length * 0.32, centerX + opening * 1.8, centerY + length * 1.06)
  context.stroke()
  context.restore()
}

function drawMembrane(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  phase: number,
  profile: VisualProfile,
  pointer: PointerPosition,
  signal: InteractionSignal,
  opacity: number,
) {
  const focusX = width * (0.5 + pointer.x * 0.12 + signal.x * 0.08)
  const focusY = height * (0.5 + pointer.y * 0.08 + signal.y * 0.08)
  const press = 18 + signal.force * 70

  context.save()
  context.globalAlpha = opacity * 0.52
  context.strokeStyle = FOG
  context.lineWidth = 0.8
  for (let fold = -3; fold <= 3; fold += 1) {
    const y = focusY + fold * (26 + profile.viscosity * 12)
    const breathe = Math.sin(phase * 0.45 + fold * 0.86) * (5 + profile.rebound * 8)
    context.beginPath()
    context.moveTo(-20, y + breathe)
    context.bezierCurveTo(width * 0.22, y - press * 0.24, focusX - press, y + press * 0.4, focusX, y + breathe * 0.2)
    context.bezierCurveTo(focusX + press, y - press * 0.4, width * 0.78, y + press * 0.24, width + 20, y - breathe)
    context.stroke()
  }
  context.restore()
}

function drawEchoes(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  phase: number,
  profile: VisualProfile,
  signal: InteractionSignal,
  opacity: number,
) {
  context.save()
  context.strokeStyle = QUIET
  context.lineWidth = 0.7
  for (let echo = 0; echo < 8; echo += 1) {
    const spread = (echo - 3.5) * (24 + profile.blur * 18)
    const offset = Math.sin(phase * 0.34 + echo * 0.72) * (4 + profile.tension * 9)
    const y = height * 0.5 + spread + profile.weight * height * 0.04
    context.globalAlpha = opacity * (0.08 + (7 - echo) * 0.025)
    context.beginPath()
    context.moveTo(width * 0.12, y + offset)
    context.bezierCurveTo(width * 0.3, y - 28 - signal.y * 30, width * 0.43, y + 18, width * 0.54, y + signal.x * 28)
    context.bezierCurveTo(width * 0.7, y - 18, width * 0.79, y + 26 + offset, width * 0.91, y - offset * 0.4)
    context.stroke()
  }
  context.restore()
}

function drawRupture(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  phase: number,
  profile: VisualProfile,
  signal: InteractionSignal,
  memory: MatterMemory,
  opacity: number,
) {
  const originX = width * (0.49 + signal.x * 0.14)
  const originY = height * (0.53 + signal.y * 0.12)
  const energy = clamp(signal.velocity * 1.2 + signal.force * 0.7 + memory.releaseEnergy, 0, 1)

  context.save()
  context.strokeStyle = FOG
  context.lineWidth = 0.8 + profile.tension * 0.9
  context.globalAlpha = opacity * (0.24 + energy * 0.26)
  for (let fracture = 0; fracture < 7; fracture += 1) {
    const direction = -1.28 + fracture * 0.43 + signal.x * 0.22
    const reach = Math.min(width, height) * (0.12 + energy * 0.26) * (0.62 + (fracture % 3) * 0.18)
    const kink = Math.sin(phase * 1.4 + fracture * 2.17) * profile.rebound * 12
    context.beginPath()
    context.moveTo(originX, originY)
    context.lineTo(originX + Math.cos(direction) * reach * 0.34 + kink, originY + Math.sin(direction) * reach * 0.34)
    context.lineTo(originX + Math.cos(direction + 0.12) * reach * 0.68, originY + Math.sin(direction - 0.08) * reach * 0.68 + kink)
    context.lineTo(originX + Math.cos(direction - 0.05) * reach, originY + Math.sin(direction + 0.06) * reach)
    context.stroke()
  }
  context.restore()
}

function drawKnot(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  phase: number,
  profile: VisualProfile,
  signal: InteractionSignal,
  memory: MatterMemory,
  opacity: number,
) {
  const x = width * (0.5 + signal.x * 0.06)
  const y = height * (0.52 + (memory.distance - 0.5) * 0.22)
  const scale = Math.min(width, height) * (0.11 + (1 - memory.distance) * 0.12)

  context.save()
  context.strokeStyle = SURFACE_LIGHT
  context.lineWidth = 1.1
  context.globalAlpha = opacity * 0.75
  for (let strand = 0; strand < 7; strand += 1) {
    const bias = (strand - 3) / 3
    const flex = Math.sin(phase * 0.38 + strand) * profile.rebound * scale * 0.09
    context.beginPath()
    context.moveTo(x - scale * 1.5, y + bias * scale * 0.82)
    context.bezierCurveTo(x - scale * 0.5, y - scale * (0.88 - bias * 0.22), x + scale * 0.38 + flex, y + scale * (0.9 + bias * 0.18), x + scale * 1.45, y - bias * scale * 0.74)
    context.bezierCurveTo(x + scale * 0.55, y - scale * (0.72 + bias * 0.16), x - scale * 0.36 - flex, y + scale * (0.66 - bias * 0.12), x - scale * 1.5, y + bias * scale * 0.82)
    context.stroke()
  }
  context.restore()
}

function drawThreads(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  phase: number,
  profile: VisualProfile,
  memory: MatterMemory,
  opacity: number,
) {
  const rootX = width * 0.48
  const rootY = height * 0.78
  context.save()
  context.strokeStyle = FOG
  context.lineWidth = 0.8
  for (let thread = 0; thread < 7; thread += 1) {
    const position = thread / 6
    const targetX = width * (0.14 + position * 0.72)
    const targetY = height * (0.18 + Math.abs(thread - 3) * 0.035)
    const selected = memory.anchor === thread
    const sway = Math.sin(phase * 0.44 + thread * 0.9) * (4 + profile.rebound * 7)
    context.globalAlpha = opacity * (selected ? 0.54 : 0.2)
    context.lineWidth = selected ? 1.35 : 0.8
    context.beginPath()
    context.moveTo(rootX, rootY)
    context.bezierCurveTo(rootX + (targetX - rootX) * 0.18 + sway, height * 0.62, targetX - sway, height * 0.42, targetX, targetY)
    context.stroke()
  }
  context.restore()
}

function drawHorizon(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  phase: number,
  profile: VisualProfile,
  memory: MatterMemory,
  opacity: number,
) {
  const y = height * (0.58 + profile.weight * 0.02)
  const opening = height * (0.035 + memory.settledness * 0.04)
  const move = Math.sin(phase * 0.2) * 2
  const upper = context.createLinearGradient(0, y - opening, 0, y)
  upper.addColorStop(0, 'rgba(23, 27, 25, 0)')
  upper.addColorStop(1, 'rgba(78, 87, 82, 0.17)')
  context.save()
  context.globalAlpha = opacity
  context.fillStyle = upper
  context.beginPath()
  context.moveTo(0, y - opening * 3)
  context.bezierCurveTo(width * 0.28, y - opening + move, width * 0.7, y - opening - move, width, y - opening * 2.2)
  context.lineTo(width, y)
  context.lineTo(0, y)
  context.closePath()
  context.fill()
  context.restore()
}

function drawStill(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  opacity: number,
) {
  context.save()
  context.globalAlpha = opacity * 0.24
  context.strokeStyle = FOG
  context.lineWidth = 1
  context.beginPath()
  context.moveTo(width * 0.22, height * 0.62)
  context.bezierCurveTo(width * 0.39, height * 0.615, width * 0.61, height * 0.625, width * 0.78, height * 0.62)
  context.stroke()
  context.restore()
}

function drawMaterial(
  context: CanvasRenderingContext2D,
  material: SceneMaterial,
  width: number,
  height: number,
  phase: number,
  profile: VisualProfile,
  pointer: PointerPosition,
  signal: InteractionSignal,
  memory: MatterMemory,
  opacity: number,
) {
  switch (material) {
    case 'slit':
      drawSlit(context, width, height, phase, profile, signal, opacity)
      break
    case 'membrane':
      drawMembrane(context, width, height, phase, profile, pointer, signal, opacity)
      break
    case 'echoes':
      drawEchoes(context, width, height, phase, profile, signal, opacity)
      break
    case 'rupture':
      drawRupture(context, width, height, phase, profile, signal, memory, opacity)
      break
    case 'knot':
      drawKnot(context, width, height, phase, profile, signal, memory, opacity)
      break
    case 'threads':
      drawThreads(context, width, height, phase, profile, memory, opacity)
      break
    case 'horizon':
      drawHorizon(context, width, height, phase, profile, memory, opacity)
      break
    case 'still':
      drawStill(context, width, height, opacity)
      break
  }
}

function tracePath(
  context: CanvasRenderingContext2D,
  material: SceneMaterial,
  width: number,
  height: number,
  phase: number,
  signal: InteractionSignal,
  memory: MatterMemory,
) {
  const responseX = signal.x * width * 0.055
  const responseY = signal.y * height * 0.055
  context.beginPath()

  if (material === 'slit' || material === 'membrane') {
    const x = width * 0.54 + responseX
    context.moveTo(x - 2, height * 0.39)
    context.bezierCurveTo(x - 14, height * 0.46 + responseY, x + 10, height * 0.54, x - 1, height * 0.62)
    return
  }

  if (material === 'horizon' || material === 'still') {
    const y = height * 0.58
    context.moveTo(width * 0.08, y + Math.sin(phase * 0.22) * 2)
    context.bezierCurveTo(width * 0.34, y - 4, width * 0.63, y + 5, width * 0.92, y)
    return
  }

  if (material === 'threads') {
    const target = memory.anchor >= 0 ? memory.anchor / 6 : 0.54
    const targetX = width * (0.14 + target * 0.72)
    context.moveTo(width * 0.48, height * 0.78)
    context.bezierCurveTo(width * 0.48 + responseX, height * 0.6, targetX - responseX * 0.3, height * 0.39, targetX, height * (0.18 + Math.abs(target * 6 - 3) * 0.035))
    return
  }

  if (material === 'rupture') {
    const x = width * 0.49 + responseX
    const y = height * 0.53 + responseY
    context.moveTo(width * 0.22, height * 0.76)
    context.lineTo(x - width * 0.08, y + height * 0.08)
    context.lineTo(x, y)
    context.lineTo(x + width * 0.05, y - height * 0.09)
    context.lineTo(width * 0.73, height * 0.25)
    return
  }

  if (material === 'knot') {
    const distanceShift = (memory.distance - 0.5) * height * 0.18
    context.moveTo(width * 0.18, height * 0.7)
    context.bezierCurveTo(width * 0.4, height * 0.42 + distanceShift, width * 0.63, height * 0.68 + distanceShift, width * 0.82, height * 0.32)
    return
  }

  context.moveTo(width * 0.12, height * 0.7)
  context.bezierCurveTo(width * 0.34, height * 0.47 + responseY, width * 0.61 + responseX, height * 0.6, width * 0.88, height * 0.32)
}

function drawLivingTrace(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  phase: number,
  profile: VisualProfile,
  signal: InteractionSignal,
  memory: MatterMemory,
  opacity: number,
  voice: number,
) {
  const progress = ease(Math.max(memory.trace, MATERIAL_TRACE[profile.material]))
  const estimatedLength = width + height

  context.save()
  context.globalAlpha = opacity * (0.58 + memory.settledness * 0.28)
  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.setLineDash([estimatedLength * progress, estimatedLength])

  tracePath(context, profile.material, width, height, phase, signal, memory)
  context.strokeStyle = FIELD
  context.lineWidth = 5.5 + memory.releaseEnergy * 2
  context.stroke()

  tracePath(context, profile.material, width, height, phase, signal, memory)
  context.strokeStyle = profile.accent
  context.lineWidth = 1.15 + signal.force * 0.85 + memory.releaseEnergy * 0.45 + voice * 1.1
  context.stroke()

  context.setLineDash([])
  context.restore()
}

function signalFingerprint(signal: InteractionSignal, level: number): string {
  return [
    signal.x,
    signal.y,
    signal.force,
    signal.velocity,
    signal.active ? 1 : 0,
    signal.distance,
    signal.trace,
    signal.tension,
    signal.settledness,
    signal.releaseEnergy,
    signal.anchor,
    level,
  ]
    .map((value) => Number(value).toFixed(3))
    .join(':')
}

export function DreamCanvas({
  stage,
  emotion,
  microphoneLevel,
  interactionRef,
  reducedMotion,
}: DreamCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerRef = useRef<PointerPosition>({ x: 0, y: 0 })
  const levelRef = useRef(microphoneLevel)
  const reducedRef = useRef(reducedMotion)
  const memoryRef = useRef<MatterMemory>(createMatterMemory())
  const initialProfile = getVisualProfile(stage, emotion)
  const sceneRef = useRef<SceneState>({
    profile: initialProfile,
    previousMaterial: initialProfile.material,
    transition: 1,
  })
  const targetProfileRef = useRef(initialProfile)
  const dirtyRef = useRef(true)

  levelRef.current = microphoneLevel
  reducedRef.current = reducedMotion

  useEffect(() => {
    const nextProfile = getVisualProfile(stage, emotion)
    const scene = sceneRef.current
    if (scene.profile.material !== nextProfile.material) {
      scene.previousMaterial = scene.profile.material
      scene.transition = reducedMotion ? 1 : 0
    }
    targetProfileRef.current = nextProfile
    memoryRef.current.trace = Math.max(memoryRef.current.trace, MATERIAL_TRACE[nextProfile.material])
    dirtyRef.current = true
  }, [emotion, reducedMotion, stage])

  useEffect(() => {
    dirtyRef.current = true
  }, [microphoneLevel, reducedMotion])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    let frame = 0
    let previousTime = performance.now()
    let width = 0
    let height = 0
    let pixelRatio = 1
    let previousFingerprint = ''

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      width = Math.max(1, bounds.width || window.innerWidth)
      height = Math.max(1, bounds.height || window.innerHeight)
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      const nextWidth = Math.round(width * pixelRatio)
      const nextHeight = Math.round(height * pixelRatio)
      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth
        canvas.height = nextHeight
      }
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      dirtyRef.current = true
    }

    const render = (elapsed: number) => {
      const signal = interactionRef.current
      const memory = memoryRef.current
      const scene = sceneRef.current
      const targetProfile = targetProfileRef.current
      const still = reducedRef.current

      if (!still) {
        memory.phase = (memory.phase + elapsed * (0.16 + targetProfile.tempo * 0.9)) % TAU
        scene.transition = Math.min(1, scene.transition + elapsed * 1.85)
      } else {
        scene.transition = 1
      }

      const response = still ? 1 : Math.min(1, elapsed * (3.2 + (1 - targetProfile.viscosity) * 5))
      advanceMatterMemory(
        memory,
        {
          trace: Math.max(signal.trace, MATERIAL_TRACE[targetProfile.material]),
          tension: Math.max(signal.tension, targetProfile.tension),
          settledness: signal.settledness,
          releaseEnergy: signal.releaseEnergy,
          distance: signal.distance,
          anchor: signal.anchor,
        },
        response,
      )
      scene.profile = profileToward(scene.profile, targetProfile, still ? 1 : Math.min(1, elapsed * 3.4))

      drawBackground(
        context,
        width,
        height,
        memory.phase,
        scene.profile,
        pointerRef.current,
        signal,
        memory,
        levelRef.current,
      )

      const transition = ease(scene.transition)
      if (scene.previousMaterial !== targetProfile.material && transition < 1) {
        drawMaterial(
          context,
          scene.previousMaterial,
          width,
          height,
          memory.phase,
          scene.profile,
          pointerRef.current,
          signal,
          memory,
          (1 - transition) * 0.58,
        )
      }
      drawMaterial(
        context,
        targetProfile.material,
        width,
        height,
        memory.phase,
        scene.profile,
        pointerRef.current,
        signal,
        memory,
        transition,
      )
      drawLivingTrace(
        context,
        width,
        height,
        memory.phase,
        targetProfile,
        signal,
        memory,
        1,
        levelRef.current,
      )

      previousFingerprint = signalFingerprint(signal, levelRef.current)
      dirtyRef.current = false
    }

    const tick = (time: number) => {
      const elapsed = Math.min(0.05, Math.max(0, (time - previousTime) / 1000))
      previousTime = time
      const fingerprint = signalFingerprint(interactionRef.current, levelRef.current)
      if (!reducedRef.current || dirtyRef.current || fingerprint !== previousFingerprint) {
        render(elapsed)
      }
      frame = requestAnimationFrame(tick)
    }

    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current = {
        x: clamp(event.clientX / Math.max(width, 1) - 0.5, -0.5, 0.5),
        y: clamp(event.clientY / Math.max(height, 1) - 0.5, -0.5, 0.5),
      }
      dirtyRef.current = true
    }

    const markDirty = () => {
      dirtyRef.current = true
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', markDirty, { passive: true })
    window.addEventListener('pointerup', markDirty, { passive: true })
    window.addEventListener('input', markDirty, { passive: true })
    window.addEventListener('keydown', markDirty)
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', markDirty)
      window.removeEventListener('pointerup', markDirty)
      window.removeEventListener('input', markDirty)
      window.removeEventListener('keydown', markDirty)
    }
  }, [interactionRef])

  return <canvas ref={canvasRef} className="dream-canvas" aria-hidden="true" />
}
