import { useState } from 'react'

interface ExpressionStageProps {
  emotion: string
  prefersMicrophone: boolean
  onContinue: (reflection: string) => void
}

export function ExpressionStage({ emotion, prefersMicrophone, onContinue }: ExpressionStageProps) {
  const [text, setText] = useState('')

  return (
    <section className="stage stage-expression" aria-labelledby="expression-title">
      <p className="stage-eyebrow">声场容器 · {emotion}</p>
      <h1 id="expression-title">把它放在这里</h1>
      <p className="expression-copy">
        你不需要说得完整。可以写下一句话，也可以什么都不写，只在这里停一会儿。
      </p>
      {prefersMicrophone && (
        <p className="microphone-pending" role="status">
          麦克风将在下一视觉切片接入；此刻可以先用文字完成这段旅程。
        </p>
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
