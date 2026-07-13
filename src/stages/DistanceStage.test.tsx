import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createInteractionSignal, type InteractionSignal } from '../lib/interaction'
import { DistanceStage } from './DistanceStage'

describe('DistanceStage', () => {
  it('lets the user place the feeling farther away with the keyboard', () => {
    const interactionRef = createRef<InteractionSignal>()
    interactionRef.current = createInteractionSignal()
    const onContinue = vi.fn()
    render(<DistanceStage reflection="" interactionRef={interactionRef} onContinue={onContinue} />)

    const core = screen.getByRole('slider', { name: '调整心事与自己的距离' })
    fireEvent.keyDown(core, { key: 'ArrowDown' })
    expect(interactionRef.current.distance).toBe(0.62)
    fireEvent.click(screen.getByRole('button', { name: '就放在这里' }))
    expect(onContinue).toHaveBeenCalledOnce()
  })
})
