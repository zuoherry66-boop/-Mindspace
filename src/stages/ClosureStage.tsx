interface ClosureStageProps {
  value: string
  action: string
  onRestart: () => void
}

export function ClosureStage({ value, action, onRestart }: ClosureStageProps) {
  return (
    <section className="stage stage-closure" aria-labelledby="closure-title">
      <h1 id="closure-title">你还在这里</h1>
      <p className="closure-value">{value}</p>
      <p className="closure-copy">情绪没有消失，但你看见了仍然在乎的方向。</p>
      <div className="action-keepsake">
        <span>留给明天</span>
        <strong>{action}</strong>
      </div>
      <button className="settle-action" type="button" onClick={onRestart}>再次进入</button>
    </section>
  )
}
