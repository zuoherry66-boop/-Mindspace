import { useState } from 'react'
import type { MicrophoneStatus } from '../hooks/useMicrophoneLevel'

interface ExpressionStageProps {
  emotion: string
  prefersMicrophone: boolean
  microphoneStatus: MicrophoneStatus
  microphoneLevel: number
  onStartMicrophone: () => void
  onStopMicrophone: () => void
  onContinue: (reflection: string) => void
}

const statusCopy: Record<MicrophoneStatus, string> = {
  idle: '麦克风尚未开启。',
  requesting: '正在等待你的授权……',
  active: '正在感知声音的强弱；声音不会被录音或上传。',
  denied: '没有获得麦克风权限，你仍然可以继续书写。',
  unavailable: '当前浏览器无法使用麦克风，你仍然可以继续书写。',
}

export function ExpressionStage({
  emotion,
  prefersMicrophone,
  microphoneStatus,
  microphoneLevel,
  onStartMicrophone,
  onStopMicrophone,
  onContinue,
}: ExpressionStageProps) {
  const [text, setText] = useState('')

  return (
    <section className="stage stage-expression" aria-labelledby="expression-title">
      <p className="stage-eyebrow">声场容器 · {emotion}</p>
      <h1 id="expression-title">把它放在这里</h1>
      <p className="expression-copy">
        你不需要说得完整。可以写下一句话，也可以什么都不写，只在这里停一会儿。
      </p>
      {prefersMicrophone && (
        <div className="microphone-panel">
          <div className="microphone-heading">
            <span>声音感知</span>
            <span className="local-only">仅在本机</span>
          </div>
          <p role="status">{statusCopy[microphoneStatus]}</p>
          <div
            className="voice-meter"
            role="meter"
            aria-label="当前声音强度"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(microphoneLevel * 100)}
          >
            <span style={{ transform: `scaleX(${Math.max(0.02, microphoneLevel)})` }} />
          </div>
          {microphoneStatus === 'active' ? (
            <button className="text-action" type="button" onClick={onStopMicrophone}>关闭麦克风</button>
          ) : (
            <button
              className="text-action"
              type="button"
              disabled={microphoneStatus === 'requesting'}
              onClick={onStartMicrophone}
            >
              开启麦克风
            </button>
          )}
        </div>
      )}
      <label className="reflection-input">
        <span>此刻最难说的话</span>
        <textarea
          aria-label="写下一句此刻最难说的话"
          maxLength={500}
          placeholder="例如：我真的已经很努力了……"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <small>{text.length} / 500</small>
      </label>
      <button className="primary-action" type="button" onClick={() => onContinue(text)}>
        让空间承受它
        <span aria-hidden="true">→</span>
      </button>
    </section>
  )
}
