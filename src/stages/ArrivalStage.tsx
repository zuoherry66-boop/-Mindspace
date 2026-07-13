interface ArrivalStageProps {
  onStart: (withMicrophone: boolean) => void
}

export function ArrivalStage({ onStart }: ArrivalStageProps) {
  return (
    <section className="stage stage-arrival" aria-labelledby="arrival-title">
      <p className="stage-eyebrow">一次大约八分钟的情绪停靠</p>
      <h1 id="arrival-title">造梦空间</h1>
      <p className="arrival-lead">
        这里不会替你诊断，也不要求你立刻振作。让这个空间先陪你看清，正在发生什么。
      </p>
      <div className="arrival-actions">
        <button className="primary-action" type="button" onClick={() => onStart(false)}>
          安静进入
          <span aria-hidden="true">↗</span>
        </button>
        <button className="secondary-action" type="button" onClick={() => onStart(true)}>
          使用麦克风进入
        </button>
      </div>
      <p className="stage-footnote">
        麦克风仅分析音量来改变画面，不录音、不识别心理状态。你可以随时关闭或跳过。
      </p>
    </section>
  )
}
