import { useRef, type PointerEvent, type RefObject } from 'react'
import type { InteractionSignal } from '../lib/interaction'

interface DistanceStageProps {
  reflection: string
  interactionRef: RefObject<InteractionSignal | null>
  onContinue: () => void
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
    const travel = Math.min(field.clientHeight * 0.56, 260)
    core.style.transform = `translate3d(0, ${distance * travel - travel / 2}px, 0) scale(${1.24 - distance * 0.62})`
    core.style.opacity = String(1 - distance * 0.42)
    core.setAttribute('aria-valuenow', String(Math.round(distance * 100)))
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
          onKeyDown={(event) => {
            const current = interactionRef.current?.distance ?? 0.5
            if (event.key === 'ArrowUp') {
              event.preventDefault()
              renderDistance(current - 0.12)
            }
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              renderDistance(current + 0.12)
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
