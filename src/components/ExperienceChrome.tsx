interface ExperienceChromeProps {
  progress: number
  onHelp: () => void
  reducedMotion: boolean
  onToggleMotion: () => void
  children: React.ReactNode
}

export function ExperienceChrome({
  progress,
  onHelp,
  reducedMotion,
  onToggleMotion,
  children,
}: ExperienceChromeProps) {
  return (
    <div className="experience-shell">
      <header className="topbar">
        <a className="wordmark" href="./" aria-label="造梦空间首页">
          <span className="wordmark-mark" aria-hidden="true" />
          <span>造梦空间</span>
          <small>MINDSPACE</small>
        </a>
        <div className="topbar-actions">
          <button className="quiet-control" type="button" onClick={onToggleMotion}>
            {reducedMotion ? '恢复动态' : '减少动态'}
          </button>
          <button className="help-control" type="button" onClick={onHelp}>
            退出 / 我需要真人帮助
          </button>
        </div>
      </header>
      <div
        className="progress-line"
        role="progressbar"
        aria-label="体验进度"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
      <main className="experience-main">{children}</main>
      <footer className="privacy-note">声音只在你的设备上形成视觉变化 · 本次体验不会保存内容</footer>
    </div>
  )
}
