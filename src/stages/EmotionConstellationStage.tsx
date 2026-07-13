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
      <p className="stage-eyebrow">空间只作猜测</p>
      <h1 id="constellation-title">哪个词更贴近？</h1>
      <p className="constellation-note">名字由你决定。</p>
      <div className="emotion-field" aria-label="可选择的情绪词">
        {emotions.map((emotion, index) => (
          <button
            className={`emotion-word emotion-word-${index + 1}${candidates.includes(emotion) ? ' is-suggested' : ''}`}
            key={emotion}
            type="button"
            aria-label={emotion}
            onClick={() => onConfirm(emotion)}
          >
            {emotion}
          </button>
        ))}
      </div>
    </section>
  )
}
