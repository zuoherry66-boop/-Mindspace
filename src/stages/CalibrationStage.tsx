import type { ReflectionQuestion } from '../data/questions'

interface CalibrationStageProps {
  index: number
  total: number
  question: ReflectionQuestion
  onAnswer: (value: string) => void
}

export function CalibrationStage({
  index,
  total,
  question,
  onAnswer,
}: CalibrationStageProps) {
  return (
    <section className="stage stage-question" aria-labelledby="question-title">
      <div className="question-count" aria-label={`第 ${index + 1} 个问题，共 ${total} 个`}>
        0{index + 1} <span>/ 0{total}</span>
      </div>
      <p className="stage-eyebrow">{question.eyebrow}</p>
      <h1 id="question-title">{question.prompt}</h1>
      <p className="stage-helper">{question.helper}</p>
      <div className="option-field">
        {question.options.map((option) => (
          <button
            className="option-button"
            key={option.value}
            type="button"
            onClick={() => onAnswer(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  )
}
