import { useRef, type PointerEvent, type RefObject } from 'react'
import type { InteractionSignal } from '../lib/interaction'

interface DistanceStageProps {
  reflection: string
  interactionRef: RefObject<InteractionSignal | null>
  onContinue: () => void
}

function describeDistance(distance: number) {
  if (distance <= 0.18) return '很近'
  if (distance <= 0.42) return '靠近'
  if (distance <= 0.7) return '有一点远'
  if (distance < 0.92) return '较远'
  return '很远'
}

export function DistanceStage({ reflection, interactionRef, onContinue }: DistanceStageProps) {
  const fieldRef = useRef<HTMLDivElement>(null)
  const coreRef = useRef<HTMLButtonElement>(null)
  const draggingRef = useRef(false)

  const renderDistance = (value: number) => {
    const distance = Math.max(0, Math.min(1, value))
    if (interactionRef.current) interactionRef.current.distance = distance
    const core = coreRef.current
    const field = fieldRef.current
    if (!core || !field) return
    const depth = (distance - 0.5) * 2
    const travelX = Math.min(field.clientWidth * 0.35, 280)
    const travelY = Math.min(field.clientHeight * 0.24, 140)
    core.style.transform = `translate3d(${-depth * travelX}px, ${depth * travelY}px, 0) scale(${1.12 - distance * 0.48})`
    core.style.opacity = String(1 - distance * 0.42)
    core.setAttribute('aria-valuenow', String(Math.round(distance * 100)))
    core.setAttribute('aria-valuetext', describeDistance(distance))
    field.style.setProperty('--distance', String(distance))
  }

  const moveFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    renderDistance((event.clientY - rect.top) / Math.max(rect.height, 1))
  }

  return (
    <section className="stage distance-stage" aria-labelledby="distance-title">
      <h1 id="distance-title">把它放在你能承受的距离</h1>
      {reflection && <blockquote>{reflection}</blockquote>}
      <div
        ref={fieldRef}
        className="distance-field"
        onPointerDown={(event) => {
          draggingRef.current = true
          event.currentTarget.setPointerCapture?.(event.pointerId)
          moveFromPointer(event)
        }}
        onPointerMove={(event) => {
          if (draggingRef.current) moveFromPointer(event)
        }}
        onPointerUp={() => {
          draggingRef.current = false
        }}
      >
        <span className="distance-label distance-label-near">靠近</span>
        <span className="distance-label distance-label-far">放远</span>
        <button
          ref={coreRef}
          className="distance-core"
          type="button"
          role="slider"
          aria-label="调整心事与自己的距离"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={50}
          aria-valuetext="有一点远"
          aria-orientation="vertical"
          onKeyDown={(event) => {
            const current = interactionRef.current?.distance ?? 0.5
            if (event.key === 'Home') {
              event.preventDefault()
              renderDistance(0)
            } else if (event.key === 'End') {
              event.preventDefault()
              renderDistance(1)
            } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
              event.preventDefault()
              renderDistance(current - (event.key === 'PageUp' ? 0.24 : 0.12))
            } else if (event.key === 'ArrowDown' || event.key === 'PageDown') {
              event.preventDefault()
              renderDistance(current + (event.key === 'PageDown' ? 0.24 : 0.12))
            }
          }}
        >
          <span aria-hidden="true" />
        </button>
      </div>
      <button className="settle-action" type="button" onClick={onContinue}>就放在这里</button>
    </section>
  )
}
