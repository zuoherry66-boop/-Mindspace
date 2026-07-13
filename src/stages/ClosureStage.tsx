interface ClosureStageProps {
  value: string
  action: string
  onRestart: () => void
}

export function ClosureStage({ value, action, onRestart }: ClosureStageProps) {
  return (
    <section className="stage stage-closure" aria-labelledby="closure-title">
      <p className="stage-eyebrow">你仍然在乎 · {value}</p>
      <h1 id="closure-title">微光没有替你回答</h1>
      <div className="closure-copy">
        <p>你不需要证明痛苦是有意义的。</p>
        <p>但你刚刚看见了：痛苦之外，你仍然在乎。</p>
      </div>
      <div className="action-keepsake">
        <span>留给明天</span>
        <strong>{action}</strong>
      </div>
      <button className="secondary-action" type="button" onClick={onRestart}>
        重新进入空间
      </button>
    </section>
  )
}
