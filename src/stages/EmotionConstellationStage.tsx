import type { EmotionLabel } from '../lib/experience'

interface EmotionConstellationStageProps {
  candidates: EmotionLabel[]
  onConfirm: (emotion: EmotionLabel) => void
}

const emotions: EmotionLabel[] = ['悲伤', '生气', '恨意', '不甘', '无奈', '开心', '说不清']

export function EmotionConstellationStage({
  candidates,
  onConfirm,
}: EmotionConstellationStageProps) {
  return (
    <section className="stage constellation-stage" aria-labelledby="constellation-title">
      <h1 id="constellation-title">哪个词靠你最近？</h1>
      <p className="visually-hidden">
        空间猜测可能接近{candidates.join('或')}，但最终选择由你决定。
      </p>
      <div className="emotion-constellation">
        <span className="constellation-center" aria-hidden="true" />
        {emotions.map((emotion, index) => (
          <button
            className={`emotion-star emotion-star-${index + 1}${candidates.includes(emotion) ? ' is-near' : ''}`}
            key={emotion}
            type="button"
            aria-label={emotion}
            onClick={() => onConfirm(emotion)}
          >
            <span aria-hidden="true" />
            {emotion}
          </button>
        ))}
      </div>
    </section>
  )
}
