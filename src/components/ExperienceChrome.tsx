import type { VisualStage } from '../lib/visualProfile'

interface ExperienceChromeProps {
  progress: number
  stage: VisualStage
  onHelp: () => void
  reducedMotion: boolean
  onToggleMotion: () => void
  children: React.ReactNode
}

export function ExperienceChrome({
  progress,
  stage,
  onHelp,
  reducedMotion,
  onToggleMotion,
  children,
}: ExperienceChromeProps) {
  return (
    <div className="experience-shell" data-scene={stage}>
      <header className="topbar">
        <span className="wordmark">造梦空间</span>
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
        className="visually-hidden"
        role="progressbar"
        aria-label="体验进度"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
      </div>
      <main className="experience-main">{children}</main>
      <footer className="privacy-note">声音只在本机改变画面，不录音，不保存。</footer>
    </div>
  )
}
