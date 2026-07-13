import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ValueLightsStage } from './ValueLightsStage'

describe('ValueLightsStage', () => {
  it('turns one chosen light into a small next action', () => {
    const onComplete = vi.fn()
    render(<ValueLightsStage onComplete={onComplete} />)

    fireEvent.click(screen.getByRole('button', { name: '认真生活' }))
    fireEvent.change(screen.getByLabelText('明天的一个小行动'), {
      target: { value: '拉开窗帘' },
    })
    fireEvent.click(screen.getByRole('button', { name: '留给明天' }))

    expect(onComplete).toHaveBeenCalledWith('认真生活', '拉开窗帘')
  })
})
