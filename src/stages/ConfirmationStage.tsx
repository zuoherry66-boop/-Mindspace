import type { EmotionLabel } from '../lib/experience'

interface ConfirmationStageProps {
  candidates: EmotionLabel[]
  onConfirm: (emotion: EmotionLabel) => void
}

const allEmotions: EmotionLabel[] = ['悲伤', '生气', '恨意', '不甘', '无奈', '开心', '说不清']

export function ConfirmationStage({ candidates, onConfirm }: ConfirmationStageProps) {
  return (
    <section className="stage stage-confirmation" aria-labelledby="confirmation-title">
      <p className="stage-eyebrow">情绪星图 · 仍由你决定</p>
      <h1 id="confirmation-title">
        它听起来有一点像
        <span className="candidate-line">{candidates.join('，也混着一点')}</span>
      </h1>
      <p className="stage-helper">我可能理解得不准确。哪个词更接近？</p>
      <div className="emotion-field">
        {allEmotions.map((emotion) => (
          <button
            className={candidates.includes(emotion) ? 'emotion-button is-suggested' : 'emotion-button'}
            key={emotion}
            type="button"
            aria-label={emotion}
            onClick={() => onConfirm(emotion)}
          >
            {emotion}
            {candidates.includes(emotion) && <small aria-hidden="true">比较接近</small>}
          </button>
        ))}
      </div>
    </section>
  )
}
