import { useState } from 'react'
import { valueOptions } from '../data/questions'

interface ValueLightsStageProps {
  onComplete: (value: string, action: string) => void
}

export function ValueLightsStage({ onComplete }: ValueLightsStageProps) {
  const [selectedValue, setSelectedValue] = useState('')
  const [action, setAction] = useState('')

  return (
    <section className="stage value-lights-stage" aria-labelledby="value-lights-title">
      <h1 id="value-lights-title">靠近你还在乎的光</h1>
      <div className="value-sky">
        {valueOptions.map((value, index) => (
          <button
            className={`value-light value-light-${index + 1}${selectedValue === value ? ' is-chosen' : ''}`}
            key={value}
            type="button"
            aria-label={value}
            aria-pressed={selectedValue === value}
            onClick={() => setSelectedValue(value)}
          >
            <span aria-hidden="true" />
            {value}
          </button>
        ))}
      </div>
      {selectedValue && (
        <div className="small-action-entry">
          <label>
            <span>{selectedValue}</span>
            <input
              aria-label="明天的一个小行动"
              maxLength={120}
              placeholder="明天，做一件很小的事"
              value={action}
              onChange={(event) => setAction(event.target.value)}
            />
          </label>
          <button
            className="settle-action"
            type="button"
            disabled={!action.trim()}
            onClick={() => onComplete(selectedValue, action)}
          >
            留给明天
          </button>
        </div>
      )}
    </section>
  )
}
