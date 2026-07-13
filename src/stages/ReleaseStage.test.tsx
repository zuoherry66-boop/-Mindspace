import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { InteractionSignal } from '../lib/interaction'
import { ReleaseStage } from './ReleaseStage'

describe('ReleaseStage', () => {
  it('turns keyboard pressure into a live spatial signal', () => {
    const interactionRef = createRef<InteractionSignal>()
    interactionRef.current = { x: 0, y: 0, force: 0, velocity: 0, active: false, distance: 0.5 }

    render(
      <ReleaseStage
        emotion="生气"
        interactionRef={interactionRef}
        microphoneStatus="idle"
        microphoneLevel={0}
        onStartMicrophone={vi.fn()}
        onStopMicrophone={vi.fn()}
        onContinue={vi.fn()}
      />,
    )
    const surface = screen.getByRole('button', { name: '情绪释放空间：滑动指针或按住空格' })

    fireEvent.keyDown(surface, { key: ' ' })
    expect(interactionRef.current?.active).toBe(true)
    expect(interactionRef.current?.force).toBe(1)
    fireEvent.keyUp(surface, { key: ' ' })
    expect(interactionRef.current?.active).toBe(false)
  })

  it('keeps writing as an optional safety-aware path', () => {
    const onContinue = vi.fn()
    const interactionRef = createRef<InteractionSignal>()
    interactionRef.current = { x: 0, y: 0, force: 0, velocity: 0, active: false, distance: 0.5 }

    render(
      <ReleaseStage
        emotion="无奈"
        interactionRef={interactionRef}
        microphoneStatus="idle"
        microphoneLevel={0}
        onStartMicrophone={vi.fn()}
        onStopMicrophone={vi.fn()}
        onContinue={onContinue}
      />,
    )
    fireEvent.change(screen.getByLabelText('如果愿意，可以写下一句'), {
      target: { value: '我想伤害自己' },
    })
    fireEvent.click(screen.getByRole('button', { name: '我停下来了' }))

    expect(onContinue).toHaveBeenCalledWith('我想伤害自己')
  })
})
