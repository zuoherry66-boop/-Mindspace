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
  const draggingRef = useRef(false)
  const lastPointerRef = useRef({ x: 0, y: 0, time: 0 })

  const settle = () => {
    draggingRef.current = false
    if (!interactionRef.current) return
    interactionRef.current.active = false
    interactionRef.current.force = 0
    interactionRef.current.velocity = 0
  }

  useEffect(() => () => {
    if (!interactionRef.current) return
    interactionRef.current.active = false
    interactionRef.current.force = 0
    interactionRef.current.velocity = 0
  }, [interactionRef])

  const reactToPointer = (event: PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const clientX = Number.isFinite(event.clientX) ? event.clientX : rect.left + rect.width / 2
    const clientY = Number.isFinite(event.clientY) ? event.clientY : rect.top + rect.height / 2
    const point = clampGesture({
      x: ((clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2,
      y: ((clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2,
    })
    const now = performance.now()
    const elapsed = Math.max(16, now - lastPointerRef.current.time)
    const velocity = Math.min(
      1,
      Math.hypot(clientX - lastPointerRef.current.x, clientY - lastPointerRef.current.y) / elapsed / 0.8,
    )
    lastPointerRef.current = { x: clientX, y: clientY, time: now }
    if (interactionRef.current) {
      const signal = interactionRef.current
      const energy = 0.035 + velocity * 0.09
      signal.x = point.x
      signal.y = point.y
      signal.active = true
      signal.force = Math.max(0.24, velocity)
      signal.velocity = velocity
      signal.trace = Math.min(1, signal.trace + energy)
      signal.tension = Math.min(1, Math.max(signal.tension, 0.3 + velocity * 0.7))
      signal.releaseEnergy = Math.min(1, signal.releaseEnergy + energy)
      signal.settledness = Math.max(0, signal.settledness - energy * 0.8)
    }
  }

  const pressWithKeyboard = () => {
    if (!interactionRef.current) return
    const signal = interactionRef.current
    signal.active = true
    signal.force = 1
    signal.velocity = 1
    signal.trace = Math.min(1, signal.trace + 0.12)
    signal.tension = Math.min(1, Math.max(signal.tension, 0.82))
    signal.releaseEnergy = Math.min(1, signal.releaseEnergy + 0.14)
    signal.settledness = Math.max(0, signal.settledness - 0.12)
  }

  return (
    <section className="stage release-stage" aria-labelledby="release-title">
      <h1 id="release-title">让它动起来</h1>
      <span className="release-emotion">{emotion}</span>
      <button
        className="release-surface"
        type="button"
        aria-label="情绪释放空间：按住滑动或按住空格"
        onPointerDown={(event) => {
          draggingRef.current = true
          event.currentTarget.setPointerCapture?.(event.pointerId)
          const rect = event.currentTarget.getBoundingClientRect()
          lastPointerRef.current = {
            x: Number.isFinite(event.clientX) ? event.clientX : rect.left + rect.width / 2,
            y: Number.isFinite(event.clientY) ? event.clientY : rect.top + rect.height / 2,
            time: performance.now(),
          }
          reactToPointer(event)
        }}
        onPointerMove={(event) => {
          if (draggingRef.current) reactToPointer(event)
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
            event.currentTarget.releasePointerCapture?.(event.pointerId)
          }
          settle()
        }}
        onPointerCancel={settle}
        onLostPointerCapture={settle}
        onKeyDown={(event) => {
          if (event.key !== ' ' || !interactionRef.current) return
          event.preventDefault()
          if (!event.repeat) pressWithKeyboard()
        }}
        onKeyUp={(event) => {
          if (event.key === ' ') settle()
        }}
      >
        <span className="release-ring release-ring-one" aria-hidden="true" />
        <span className="release-ring release-ring-two" aria-hidden="true" />
        <span className="release-instruction" aria-hidden="true">按住滑动 / 按住空格 / 发出声音</span>
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
