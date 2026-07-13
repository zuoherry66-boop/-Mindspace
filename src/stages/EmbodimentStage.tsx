interface EmbodimentStageProps {
  reflection: string
  onContinue: () => void
}

export function EmbodimentStage({ reflection, onContinue }: EmbodimentStageProps) {
  const displayedReflection = reflection || '我暂时还不想把它说出来。'

  return (
    <section className="stage stage-embodiment" aria-labelledby="embodiment-title">
      <p className="stage-eyebrow">心事具象化</p>
      <h1 id="embodiment-title" className="visually-hidden">选择此刻与心事的距离</h1>
      <blockquote>{displayedReflection}</blockquote>
      <p className="stage-helper">面对它，不等于现在就必须解决它。</p>
      <div className="embodiment-actions">
        <button className="option-button" type="button" onClick={onContinue}>
          靠近看看
        </button>
        <button className="option-button" type="button" onClick={onContinue}>
          暂时放远一点
        </button>
        <button className="option-button" type="button" onClick={onContinue}>
          我还没准备好
        </button>
      </div>
    </section>
  )
}
