import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react'

interface ArrivalStageProps {
  onStart: () => void
}

const HOLD_DURATION = 560

export function ArrivalStage({ onStart }: ArrivalStageProps) {
  const [holding, setHolding] = useState(false)
  const holdTimerRef = useRef<number>(0)
  const startedRef = useRef(false)

  const start = () => {
    if (startedRef.current) return
    startedRef.current = true
    onStart()
  }

  const cancelHold = () => {
    window.clearTimeout(holdTimerRef.current)
    setHolding(false)
  }

  useEffect(() => () => window.clearTimeout(holdTimerRef.current), [])

  return (
    <section className="stage stage-arrival" aria-labelledby="arrival-title">
      <p className="stage-eyebrow">造梦空间</p>
      <h1 id="arrival-title">先别解释</h1>
      <p className="arrival-lead" id="arrival-instruction">把手放在这道缝隙上。</p>
      <button
        className={`arrival-core-action${holding ? ' is-holding' : ''}`}
        type="button"
        aria-label="按住进入造梦空间"
        aria-describedby="arrival-instruction"
        onPointerDown={(event: PointerEvent<HTMLButtonElement>) => {
          event.currentTarget.setPointerCapture?.(event.pointerId)
          setHolding(true)
          holdTimerRef.current = window.setTimeout(start, HOLD_DURATION)
        }}
        onPointerUp={cancelHold}
        onPointerCancel={cancelHold}
        onKeyDown={(event) => {
          if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) {
            event.preventDefault()
            start()
          }
        }}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          if (event.detail === 0) start()
        }}
      >
        <span className="arrival-slit" aria-hidden="true" />
        <span className="arrival-action-label">按住</span>
      </button>
    </section>
  )
}
