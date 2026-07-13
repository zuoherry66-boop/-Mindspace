import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

function enterAndNameEmotion() {
  fireEvent.click(screen.getByRole('button', { name: '按住进入造梦空间' }))
  const core = screen.getByRole('button', { name: '情绪核：使用方向键移动，按回车确认' })
  fireEvent.keyDown(core, { key: 'ArrowLeft' })
  fireEvent.keyDown(core, { key: 'ArrowDown' })
  fireEvent.keyDown(core, { key: 'Enter' })
  fireEvent.click(screen.getByRole('button', { name: '不甘' }))
}

describe('Mindspace animation-first experience', () => {
  it('moves from tactile sensing to a user-owned emotion word', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: '先别解释' })).toBeInTheDocument()
    enterAndNameEmotion()

    expect(screen.getByRole('heading', { name: '让它动起来' })).toBeInTheDocument()
    expect(screen.getByText('不甘')).toBeInTheDocument()
  })

  it('moves focus into each new scene without exposing wizard chrome', () => {
    render(<App />)

    expect(screen.queryByText('MINDSPACE')).not.toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: '体验进度' })).toHaveClass('visually-hidden')

    fireEvent.click(screen.getByRole('button', { name: '按住进入造梦空间' }))

    expect(document.activeElement).toHaveAttribute('data-stage', 'calibration')
  })

  it('interrupts the visual flow when optional writing signals immediate danger', () => {
    render(<App />)
    enterAndNameEmotion()

    fireEvent.change(screen.getByLabelText('如果愿意，可以写下一句'), {
      target: { value: '我真的活不下去了，想结束生命' },
    })
    fireEvent.click(screen.getByRole('button', { name: '我停下来了' }))

    expect(screen.getByRole('heading', { name: '先确保你此刻安全' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /12356/ })).toHaveAttribute('href', 'tel:12356')
  })

  it('reaches meaning through distance and value lights', () => {
    render(<App />)
    enterAndNameEmotion()

    fireEvent.click(screen.getByRole('button', { name: '我停下来了' }))
    fireEvent.click(screen.getByRole('button', { name: '就放在这里' }))
    fireEvent.click(screen.getByRole('button', { name: '认真生活' }))
    fireEvent.change(screen.getByLabelText('明天的一个小行动'), {
      target: { value: '明早拉开窗帘' },
    })
    fireEvent.click(screen.getByRole('button', { name: '留给明天' }))

    expect(screen.getByRole('heading', { name: '你没有消失' })).toBeInTheDocument()
    expect(screen.getByText('明早拉开窗帘')).toBeInTheDocument()
  })
})
