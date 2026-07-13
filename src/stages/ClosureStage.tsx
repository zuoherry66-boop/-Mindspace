interface ClosureStageProps {
  value: string
  action: string
  onRestart: () => void
}

export function ClosureStage({ value, action, onRestart }: ClosureStageProps) {
  return (
    <section className="stage stage-closure" aria-labelledby="closure-title">
      <p className="stage-eyebrow">这道痕迹一直在</p>
      <h1 id="closure-title">你没有消失</h1>
      <p className="closure-copy">情绪还在。你也还在。</p>
      <p className="closure-value">你仍然在乎：<strong>{value}</strong></p>
      <div className="action-keepsake">
        <span>留给明天</span>
        <strong>{action || '给自己留一点空间'}</strong>
      </div>
      <button className="settle-action" type="button" onClick={onRestart}>重新走近自己</button>
    </section>
  )
}
