import { useState } from 'react'
import { valueOptions } from '../data/questions'

interface ValuesStageProps {
  onComplete: (value: string, action: string) => void
}

export function ValuesStage({ onComplete }: ValuesStageProps) {
  const [selectedValue, setSelectedValue] = useState('')
  const [action, setAction] = useState('')

  return (
    <section className="stage stage-values" aria-labelledby="values-title">
      <p className="stage-eyebrow">意义坐标</p>
      <h1 id="values-title">即使它还没有解决，你仍然不想失去什么？</h1>
      <div className="value-field">
        {valueOptions.map((value) => (
          <button
            className={selectedValue === value ? 'value-button is-selected' : 'value-button'}
            key={value}
            type="button"
            aria-pressed={selectedValue === value}
            onClick={() => setSelectedValue(value)}
          >
            {value}
          </button>
        ))}
      </div>
      {selectedValue && (
        <div className="action-entry">
          <p>为“{selectedValue}”留下一个小到几乎不会失败的行动。</p>
          <label className="reflection-input">
            <span>明天的一个小行动</span>
            <input
              aria-label="给明天留一个很小的行动"
              maxLength={120}
              placeholder="例如：明早出门走十分钟"
              value={action}
              onChange={(event) => setAction(event.target.value)}
            />
          </label>
          <button
            className="primary-action"
            type="button"
            disabled={!action.trim()}
            onClick={() => onComplete(selectedValue, action)}
          >
            留下这个下一步
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </section>
  )
}
