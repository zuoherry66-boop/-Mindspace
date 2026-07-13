import { useEffect, useRef } from 'react'
import type { EmotionLabel } from '../lib/experience'
import { getVisualProfile, type VisualStage } from '../lib/visualProfile'

interface DreamCanvasProps {
  stage: VisualStage
  emotion: EmotionLabel
  microphoneLevel: number
  reducedMotion: boolean
}

interface Particle {
  x: number
  y: number
  z: number
  size: number
  seed: number
}

function createParticles(count: number): Particle[] {
  let seed = 1937
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }

  return Array.from({ length: count }, () => ({
    x: (random() - 0.5) * 2.8,
    y: (random() - 0.5) * 1.6,
    z: random() * 0.94 + 0.06,
    size: random() * 1.8 + 0.35,
    seed: random() * Math.PI * 2,
  }))
}

export function DreamCanvas({ stage, emotion, microphoneLevel, reducedMotion }: DreamCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerRef = useRef({ x: 0, y: 0 })
  const levelRef = useRef(microphoneLevel)
  levelRef.current = microphoneLevel

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const particles = createParticles(240)
    const profile = getVisualProfile(stage, emotion)
    let frame = 0
    let startTime = performance.now()
    let width = 0
    let height = 0

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const draw = (time: number) => {
      const elapsed = (time - startTime) / 1000
      startTime = time
      const centerX = width * (0.5 + pointerRef.current.x * 0.035)
      const centerY = height * (0.49 + pointerRef.current.y * 0.025)
      const liveLevel = levelRef.current
      const pulse = 1 + liveLevel * 1.8

      context.clearRect(0, 0, width, height)
      const fog = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, width * 0.58)
      fog.addColorStop(0, `${profile.glow}20`)
      fog.addColorStop(0.28, `${profile.glow}0b`)
      fog.addColorStop(1, '#05060a00')
      context.fillStyle = fog
      context.fillRect(0, 0, width, height)

      if (stage === 'closure') {
        const path = context.createLinearGradient(centerX, height, centerX, centerY)
        path.addColorStop(0, '#e6bd7b00')
        path.addColorStop(0.62, '#e6bd7b18')
        path.addColorStop(1, '#f5dba44d')
        context.beginPath()
        context.moveTo(width * 0.31, height)
        context.quadraticCurveTo(width * 0.45, height * 0.68, centerX, centerY)
        context.quadraticCurveTo(width * 0.55, height * 0.68, width * 0.69, height)
        context.closePath()
        context.fillStyle = path
        context.fill()
      }

      for (const particle of particles) {
        if (!reducedMotion && profile.speed > 0) {
          particle.z -= elapsed * (0.018 + profile.speed * 0.035) * pulse
          particle.x += Math.sin(time * 0.0012 + particle.seed) * profile.turbulence * elapsed * 0.055
          particle.y += profile.gravity * elapsed * 0.018
          if (particle.z < 0.035) {
            particle.z = 1
            particle.x = ((particle.seed * 1.71) % 2.8) - 1.4
            particle.y = ((particle.seed * 1.13) % 1.6) - 0.8
          }
        }

        const perspective = 1 / particle.z
        const x = centerX + particle.x * width * 0.19 * perspective
        const y = centerY + particle.y * height * 0.24 * perspective
        if (x < -20 || x > width + 20 || y < -20 || y > height + 20) continue

        const alpha = Math.min(0.72, 0.09 + (1 - particle.z) * 0.46)
        const radius = Math.min(8, particle.size * perspective * (0.48 + liveLevel))
        context.beginPath()
        context.arc(x, y, radius, 0, Math.PI * 2)
        context.fillStyle = `${profile.glow}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
        context.fill()
      }

      if (!reducedMotion) frame = requestAnimationFrame(draw)
    }

    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current = {
        x: event.clientX / Math.max(width, 1) - 0.5,
        y: event.clientY / Math.max(height, 1) - 0.5,
      }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [emotion, reducedMotion, stage])

  return <canvas ref={canvasRef} className="dream-canvas" aria-hidden="true" />
}
