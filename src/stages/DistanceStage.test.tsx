import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createInteractionSignal, type InteractionSignal } from '../lib/interaction'
import { DistanceStage } from './DistanceStage'

describe('DistanceStage', () => {
  it('lets the user place the feeling with a fully described keyboard slider', () => {
    const interactionRef = createRef<InteractionSignal>()
    interactionRef.current = createInteractionSignal()
    const onContinue = vi.fn()
    render(<DistanceStage reflection="" interactionRef={interactionRef} onContinue={onContinue} />)

    const core = screen.getByRole('slider', { name: '调整心事与自己的距离' })
    fireEvent.keyDown(core, { key: 'ArrowDown' })
    expect(interactionRef.current.distance).toBe(0.62)
    expect(core).toHaveAttribute('aria-valuetext', '有一点远')

    fireEvent.keyDown(core, { key: 'Home' })
    expect(interactionRef.current.distance).toBe(0)
    expect(core).toHaveAttribute('aria-valuenow', '0')
    expect(core).toHaveAttribute('aria-valuetext', '很近')

    fireEvent.keyDown(core, { key: 'End' })
    expect(interactionRef.current.distance).toBe(1)
    expect(core).toHaveAttribute('aria-valuenow', '100')
    expect(core).toHaveAttribute('aria-valuetext', '很远')
    fireEvent.click(screen.getByRole('button', { name: '就放在这里' }))
    expect(onContinue).toHaveBeenCalledOnce()
  })

  it('moves the knot along a depth diagonal instead of a progress track', () => {
    const interactionRef = createRef<InteractionSignal>()
    interactionRef.current = createInteractionSignal()
    const { container } = render(
      <DistanceStage reflection="" interactionRef={interactionRef} onContinue={vi.fn()} />,
    )
    const field = container.querySelector('.distance-field') as HTMLDivElement
    Object.defineProperties(field, {
      clientWidth: { configurable: true, value: 640 },
      clientHeight: { configurable: true, value: 480 },
    })

    const core = screen.getByRole('slider', { name: '调整心事与自己的距离' })
    fireEvent.keyDown(core, { key: 'ArrowDown' })

    expect(core.style.transform).toMatch(/translate3d\(-[\d.]+px, [\d.]+px, 0\)/)
  })
})
