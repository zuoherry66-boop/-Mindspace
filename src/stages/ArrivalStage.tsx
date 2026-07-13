interface ArrivalStageProps {
  onStart: () => void
}

export function ArrivalStage({ onStart }: ArrivalStageProps) {
  return (
    <section className="stage stage-arrival" aria-labelledby="arrival-title">
      <h1 id="arrival-title">造梦空间</h1>
      <p className="arrival-lead">不必解释。先让这束光接住你。</p>
      <button className="arrival-core-action" type="button" aria-label="触碰微光" onClick={onStart}>
        <span aria-hidden="true" />
        触碰微光
      </button>
    </section>
  )
}
