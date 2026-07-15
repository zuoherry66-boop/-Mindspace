import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createInteractionSignal, type InteractionSignal } from '../lib/interaction'
import { ReleaseStage } from './ReleaseStage'

function firePointer(
  target: Element,
  type: 'pointerdown' | 'pointermove' | 'pointerup',
  { clientX = 0, clientY = 0, pointerId }: { clientX?: number; clientY?: number; pointerId: number },
) {
  const event = new MouseEvent(type, { bubbles: true, clientX, clientY })
  Object.defineProperty(event, 'pointerId', { value: pointerId })
  fireEvent(target, event)
}

describe('ReleaseStage', () => {
  it('turns keyboard pressure into a live spatial signal', () => {
    const interactionRef = createRef<InteractionSignal>()
    interactionRef.current = createInteractionSignal()

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
    const surface = screen.getByRole('button', { name: '情绪释放空间：按住滑动或按住空格' })

    fireEvent.keyDown(surface, { key: ' ' })
    expect(interactionRef.current?.active).toBe(true)
    expect(interactionRef.current?.force).toBe(1)
    expect(interactionRef.current?.trace).toBeGreaterThan(0)
    expect(interactionRef.current?.tension).toBeGreaterThan(0)
    expect(interactionRef.current?.releaseEnergy).toBeGreaterThan(0)
    fireEvent.keyUp(surface, { key: ' ' })
    expect(interactionRef.current?.active).toBe(false)
  })

  it('ignores pointer hover and only records a held gesture', () => {
    const interactionRef = createRef<InteractionSignal>()
    interactionRef.current = createInteractionSignal()

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
    const surface = screen.getByRole('button', { name: '情绪释放空间：按住滑动或按住空格' })
    vi.spyOn(surface, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      right: 200,
      bottom: 200,
      left: 0,
      width: 200,
      height: 200,
      toJSON: () => ({}),
    })

    firePointer(surface, 'pointermove', { pointerId: 2, clientX: 140, clientY: 80 })
    expect(interactionRef.current.trace).toBe(0)
    expect(interactionRef.current.releaseEnergy).toBe(0)

    firePointer(surface, 'pointerdown', { pointerId: 2, clientX: 80, clientY: 100 })
    firePointer(surface, 'pointermove', { pointerId: 2, clientX: 160, clientY: 70 })
    firePointer(surface, 'pointerup', { pointerId: 2 })

    expect(interactionRef.current.trace).toBeGreaterThan(0)
    expect(interactionRef.current.tension).toBeGreaterThan(0)
    expect(interactionRef.current.releaseEnergy).toBeGreaterThan(0)
    expect(interactionRef.current.active).toBe(false)
  })

  it('keeps writing as an optional safety-aware path', () => {
    const onContinue = vi.fn()
    const interactionRef = createRef<InteractionSignal>()
    interactionRef.current = createInteractionSignal()

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
