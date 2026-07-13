import { useRef, type PointerEvent, type RefObject } from 'react'
import { clampGesture, type GesturePoint } from '../lib/gesture'
import type { InteractionSignal } from '../lib/interaction'

interface TactileCalibrationStageProps {
  interactionRef: RefObject<InteractionSignal | null>
  onComplete: (point: GesturePoint) => void
}

export function TactileCalibrationStage({
  interactionRef,
  onComplete,
}: TactileCalibrationStageProps) {
  const fieldRef = useRef<HTMLDivElement>(null)
  const coreRef = useRef<HTMLButtonElement>(null)
  const positionRef = useRef<GesturePoint>({ x: 0, y: 0 })
  const draggingRef = useRef(false)
  const completedRef = useRef(false)
  const lastPointerRef = useRef({ x: 0, y: 0, time: 0 })

  const renderPosition = (point: GesturePoint, velocity = 0) => {
    positionRef.current = point
    if (interactionRef.current) {
      interactionRef.current.x = point.x
      interactionRef.current.y = point.y
      interactionRef.current.force = Math.hypot(point.x, point.y)
      interactionRef.current.velocity = velocity
    }
    const field = fieldRef.current
    const core = coreRef.current
    if (!field || !core) return
    const travel = Math.min(field.clientWidth, field.clientHeight) * 0.34
    core.style.transform = `translate3d(${point.x * travel}px, ${point.y * travel}px, 0)`
    field.style.setProperty('--field-force', String(Math.hypot(point.x, point.y)))
  }

  const complete = () => {
    if (completedRef.current) return
    completedRef.current = true
    if (interactionRef.current) interactionRef.current.active = false
    onComplete(positionRef.current)
  }

  const moveFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const field = fieldRef.current
    if (!field) return
    const rect = field.getBoundingClientRect()
    const point = clampGesture({
      x: ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2,
      y: ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2,
    })
    const now = performance.now()
    const elapsed = Math.max(16, now - lastPointerRef.current.time)
    const velocity = Math.min(
      1,
      Math.hypot(event.clientX - lastPointerRef.current.x, event.clientY - lastPointerRef.current.y) / elapsed / 1.2,
    )
    lastPointerRef.current = { x: event.clientX, y: event.clientY, time: now }
    renderPosition(point, velocity)
  }

  return (
    <section className="stage tactile-stage" aria-labelledby="calibration-title">
      <h1 id="calibration-title">把它拖向此刻的感觉</h1>
      <p className="gesture-caption">松手时，空间会记住这个方向。</p>
      <div
        ref={fieldRef}
        className="tactile-field"
        onPointerDown={(event) => {
          draggingRef.current = true
          event.currentTarget.setPointerCapture?.(event.pointerId)
          lastPointerRef.current = { x: event.clientX, y: event.clientY, time: performance.now() }
          if (interactionRef.current) interactionRef.current.active = true
          moveFromPointer(event)
        }}
        onPointerMove={(event) => {
          if (draggingRef.current) moveFromPointer(event)
        }}
        onPointerUp={() => {
          draggingRef.current = false
          complete()
        }}
      >
        <span className="field-label field-label-top">停不下来</span>
        <span className="field-label field-label-right">想反击</span>
        <span className="field-label field-label-bottom">沉下去</span>
        <span className="field-label field-label-left">想躲开</span>
        <button
          ref={coreRef}
          className="emotion-core"
          type="button"
          aria-label="情绪核：使用方向键移动，按回车确认"
          onKeyDown={(event) => {
            const delta: Record<string, GesturePoint> = {
              ArrowLeft: { x: -0.18, y: 0 },
              ArrowRight: { x: 0.18, y: 0 },
              ArrowUp: { x: 0, y: -0.18 },
              ArrowDown: { x: 0, y: 0.18 },
            }
            if (event.key === 'Enter') {
              complete()
              return
            }
            const change = delta[event.key]
            if (!change) return
            event.preventDefault()
            renderPosition(clampGesture({
              x: positionRef.current.x + change.x,
              y: positionRef.current.y + change.y,
            }))
          }}
        >
          <span aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
