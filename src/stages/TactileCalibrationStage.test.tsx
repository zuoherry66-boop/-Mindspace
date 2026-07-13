import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createInteractionSignal, type InteractionSignal } from '../lib/interaction'
import { TactileCalibrationStage } from './TactileCalibrationStage'

describe('TactileCalibrationStage', () => {
  it('lets keyboard users move and release the emotion core', () => {
    const onComplete = vi.fn()
    const interactionRef = createRef<InteractionSignal>()
    interactionRef.current = createInteractionSignal()

    render(<TactileCalibrationStage interactionRef={interactionRef} onComplete={onComplete} />)
    const core = screen.getByRole('button', { name: '情绪核：使用方向键移动，按回车确认' })

    fireEvent.keyDown(core, { key: 'ArrowLeft' })
    fireEvent.keyDown(core, { key: 'ArrowDown' })
    fireEvent.keyDown(core, { key: 'Enter' })

    expect(onComplete).toHaveBeenCalledWith({ x: -0.18, y: 0.18 })
  })
})
