import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EmotionConstellationStage } from './EmotionConstellationStage'

describe('EmotionConstellationStage', () => {
  it('keeps the final emotion choice with the user', () => {
    const onConfirm = vi.fn()
    render(<EmotionConstellationStage candidates={['悲伤', '无奈']} onConfirm={onConfirm} />)

    fireEvent.click(screen.getByRole('button', { name: '不甘' }))

    expect(onConfirm).toHaveBeenCalledWith('不甘')
  })
})
