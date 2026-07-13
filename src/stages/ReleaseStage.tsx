import { useEffect, useRef, useState, type PointerEvent, type RefObject } from 'react'
import type { MicrophoneStatus } from '../hooks/useMicrophoneLevel'
import { clampGesture } from '../lib/gesture'
import type { InteractionSignal } from '../lib/interaction'

interface ReleaseStageProps {
  emotion: string
  interactionRef: RefObject<InteractionSignal | null>
  microphoneStatus: MicrophoneStatus
  microphoneLevel: number
  onStartMicrophone: () => void
  onStopMicrophone: () => void
  onContinue: (reflection: string) => void
}

const microphoneCopy: Record<MicrophoneStatus, string> = {
  idle: '声音',
  requesting: '等待授权',
  active: '正在感知',
  denied: '未获权限',
  unavailable: '不可用',
}

export function ReleaseStage({
  emotion,
  interactionRef,
  microphoneStatus,
  microphoneLevel,
  onStartMicrophone,
  onStopMicrophone,
  onContinue,
}: ReleaseStageProps) {
  const [text, setText] = useState('')
  const lastPointerRef = useRef({ x: 0, y: 0, time: 0 })
  const settleTimerRef = useRef<number>(0)

  const settle = () => {
    if (!interactionRef.current) return
    interactionRef.current.active = false
    interactionRef.current.force = 0
    interactionRef.current.velocity = 0
  }

  useEffect(() => () => {
    window.clearTimeout(settleTimerRef.current)
    if (!interactionRef.current) return
    interactionRef.current.active = false
    interactionRef.current.force = 0
    interactionRef.current.velocity = 0
  }, [interactionRef])

  const reactToPointer = (event: PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const point = clampGesture({
      x: ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2,
      y: ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2,
    })
    const now = performance.now()
    const elapsed = Math.max(16, now - lastPointerRef.current.time)
    const velocity = Math.min(
      1,
      Math.hypot(event.clientX - lastPointerRef.current.x, event.clientY - lastPointerRef.current.y) / elapsed / 0.8,
    )
    lastPointerRef.current = { x: event.clientX, y: event.clientY, time: now }
    if (interactionRef.current) {
      interactionRef.current.x = point.x
      interactionRef.current.y = point.y
      interactionRef.current.active = true
      interactionRef.current.force = Math.max(0.24, velocity)
      interactionRef.current.velocity = velocity
    }
    window.clearTimeout(settleTimerRef.current)
    settleTimerRef.current = window.setTimeout(settle, 180)
  }

  return (
    <section className="stage release-stage" aria-labelledby="release-title">
      <h1 id="release-title">让它动起来</h1>
      <span className="release-emotion">{emotion}</span>
      <button
        className="release-surface"
        type="button"
        aria-label="情绪释放空间：滑动指针或按住空格"
        onPointerDown={(event) => {
          if (interactionRef.current) interactionRef.current.force = 1
          reactToPointer(event)
        }}
        onPointerMove={reactToPointer}
        onPointerUp={settle}
        onKeyDown={(event) => {
          if (event.key !== ' ' || !interactionRef.current) return
          event.preventDefault()
          interactionRef.current.active = true
          interactionRef.current.force = 1
          interactionRef.current.velocity = 1
        }}
        onKeyUp={(event) => {
          if (event.key === ' ') settle()
        }}
      >
        <span className="release-ring release-ring-one" aria-hidden="true" />
        <span className="release-ring release-ring-two" aria-hidden="true" />
        <span className="release-instruction" aria-hidden="true">滑动 / 按住空格 / 发出声音</span>
      </button>
      <div className="release-controls">
        <button
          className="sound-control"
          type="button"
          aria-pressed={microphoneStatus === 'active'}
          disabled={microphoneStatus === 'requesting' || microphoneStatus === 'unavailable'}
          onClick={microphoneStatus === 'active' ? onStopMicrophone : onStartMicrophone}
        >
          {microphoneCopy[microphoneStatus]}
          <span className="sound-level" aria-hidden="true">
            <i style={{ transform: `scaleX(${Math.max(0.04, microphoneLevel)})` }} />
          </span>
        </button>
        <details className="writing-fallback">
          <summary>写一句</summary>
          <label>
            <span className="visually-hidden">如果愿意，可以写下一句</span>
            <textarea
              aria-label="如果愿意，可以写下一句"
              maxLength={500}
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </label>
        </details>
        <button className="settle-action" type="button" onClick={() => onContinue(text)}>
          我停下来了
        </button>
      </div>
    </section>
  )
}
