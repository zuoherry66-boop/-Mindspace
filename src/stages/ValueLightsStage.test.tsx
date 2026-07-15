import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createInteractionSignal, type InteractionSignal } from '../lib/interaction'
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

  it('offers a low-effort action and also allows leaving without a task', () => {
    const onComplete = vi.fn()
    const interactionRef = createRef<InteractionSignal>()
    interactionRef.current = createInteractionSignal()
    render(<ValueLightsStage interactionRef={interactionRef} onComplete={onComplete} />)

    const value = screen.getByRole('button', { name: '创作' })
    fireEvent.focus(value)
    expect(interactionRef.current.anchor).toBe(3)
    fireEvent.click(value)

    fireEvent.click(screen.getByRole('button', { name: '记下一句话' }))
    fireEvent.click(screen.getByRole('button', { name: '留给明天' }))
    expect(onComplete).toHaveBeenLastCalledWith('创作', '记下一句话')

    onComplete.mockClear()
    fireEvent.click(screen.getByRole('button', { name: '暂时不安排' }))
    expect(onComplete).toHaveBeenCalledWith('创作', '')
  })
})
