import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createInteractionSignal, type InteractionSignal } from '../lib/interaction'
import { TactileCalibrationStage } from './TactileCalibrationStage'

function firePointer(
  target: Element,
  type: 'pointerdown' | 'pointerup',
  { clientX, clientY, pointerId }: { clientX: number; clientY: number; pointerId: number },
) {
  const event = new MouseEvent(type, { bubbles: true, clientX, clientY })
  Object.defineProperty(event, 'pointerId', { value: pointerId })
  fireEvent(target, event)
}

describe('TactileCalibrationStage', () => {
  it('lets keyboard users explore before explicitly confirming the direction', () => {
    const onComplete = vi.fn()
    const interactionRef = createRef<InteractionSignal>()
    interactionRef.current = createInteractionSignal()

    render(<TactileCalibrationStage interactionRef={interactionRef} onComplete={onComplete} />)
    const core = screen.getByRole('button', { name: '情绪核：使用方向键移动，按回车确认' })

    fireEvent.keyDown(core, { key: 'ArrowLeft' })
    fireEvent.keyDown(core, { key: 'ArrowDown' })

    expect(onComplete).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: '停在这个方向' }))

    expect(onComplete).toHaveBeenCalledWith({ x: -0.18, y: 0.18 })
  })

  it('does not leave the stage on the first pointer release', () => {
    const onComplete = vi.fn()
    const interactionRef = createRef<InteractionSignal>()
    interactionRef.current = createInteractionSignal()

    const { container } = render(
      <TactileCalibrationStage interactionRef={interactionRef} onComplete={onComplete} />,
    )
    const field = container.querySelector('.tactile-field') as HTMLDivElement
    vi.spyOn(field, 'getBoundingClientRect').mockReturnValue({
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

    firePointer(field, 'pointerdown', { pointerId: 1, clientX: 170, clientY: 100 })
    firePointer(field, 'pointerup', { pointerId: 1, clientX: 170, clientY: 100 })

    expect(onComplete).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: '停在这个方向' })).toBeInTheDocument()
  })
})
