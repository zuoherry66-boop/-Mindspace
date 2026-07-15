import { useState, type RefObject } from 'react'
import { valueOptions } from '../data/questions'
import type { InteractionSignal } from '../lib/interaction'

interface ValueLightsStageProps {
  interactionRef?: RefObject<InteractionSignal | null>
  onComplete: (value: string, action: string) => void
}

const quickActions: Record<string, [string, string]> = {
  '家人或关系': ['发一句问候', '写下一个名字'],
  '尊严': ['拒绝一次消耗', '站直，慢慢呼吸'],
  '自由': ['留十分钟给自己', '走一条不同的路'],
  '创作': ['记下一句话', '画一个小形状'],
  '认真生活': ['拉开窗帘', '认真喝一杯水'],
  '未来的自己': ['早点躺下十分钟', '给未来写一句话'],
}

export function ValueLightsStage({ interactionRef, onComplete }: ValueLightsStageProps) {
  const [selectedValue, setSelectedValue] = useState('')
  const [action, setAction] = useState('')
  const [quickAction, setQuickAction] = useState('')

  const pointToValue = (index: number) => {
    if (interactionRef?.current) interactionRef.current.anchor = index
  }

  const selectValue = (value: string, index: number) => {
    setSelectedValue(value)
    setAction('')
    setQuickAction('')
    pointToValue(index)
  }

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
            onFocus={() => pointToValue(index)}
            onPointerEnter={() => pointToValue(index)}
            onClick={() => selectValue(value, index)}
          >
            <span aria-hidden="true" />
            {value}
          </button>
        ))}
      </div>
      {selectedValue && (
        <div className="small-action-entry">
          <p>愿意的话，给明天留一个很小的动作。</p>
          <div className="quick-actions" aria-label="轻一点的行动">
            {quickActions[selectedValue].map((suggestion) => (
              <button
                className="small-action-choice"
                key={suggestion}
                type="button"
                aria-pressed={quickAction === suggestion}
                onClick={() => {
                  setQuickAction(suggestion)
                  setAction('')
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
          <label>
            <span>{selectedValue}</span>
            <input
              aria-label="明天的一个小行动"
              maxLength={120}
              placeholder="或者，写下自己的动作（可选）"
              value={action}
              onChange={(event) => {
                setAction(event.target.value)
                setQuickAction('')
              }}
            />
          </label>
          <div className="small-action-controls">
            <button className="quiet-action" type="button" onClick={() => onComplete(selectedValue, '')}>
              暂时不安排
            </button>
            <button
              className="settle-action"
              type="button"
              onClick={() => onComplete(selectedValue, action.trim() || quickAction)}
            >
              留给明天
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
