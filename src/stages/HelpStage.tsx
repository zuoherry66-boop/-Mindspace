interface HelpStageProps {
  onReturn: () => void
}

export function HelpStage({ onReturn }: HelpStageProps) {
  return (
    <section className="stage stage-help" aria-labelledby="help-title">
      <p className="stage-eyebrow">此刻不需要独自承担</p>
      <h1 id="help-title">先确保你此刻安全</h1>
      <p className="help-lead">
        如果你可能伤害自己或别人，请先离开独处的环境，联系一个能够陪在你身边的人。
      </p>
      <div className="support-links">
        <a href="tel:12356">
          <span>全国统一心理援助热线</span>
          <strong>12356</strong>
        </a>
        <a href="tel:120">
          <span>存在即时人身危险</span>
          <strong>120</strong>
        </a>
        <a href="tel:110">
          <span>需要立即安全协助</span>
          <strong>110</strong>
        </a>
      </div>
      <p className="help-note">造梦空间不能替代专业人员或紧急服务，也不会要求你继续完成体验。</p>
      <button className="secondary-action" type="button" onClick={onReturn}>
        返回安全起点
      </button>
    </section>
  )
}
