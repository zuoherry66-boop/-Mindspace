import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

function answerCalibration() {
  fireEvent.click(screen.getByRole('button', { name: '沉下去' }))
  fireEvent.click(screen.getByRole('button', { name: '胸口' }))
  fireEvent.click(screen.getByRole('button', { name: '抓住，不想放弃' }))
  fireEvent.click(screen.getByRole('button', { name: '不甘' }))
}

describe('Mindspace experience', () => {
  it('keeps the user in control of the inferred emotion', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: '造梦空间' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '安静进入' }))
    answerCalibration()

    expect(screen.getByText(/我可能理解得不准确/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '不甘' }))
    expect(screen.getByRole('heading', { name: '把它放在这里' })).toBeInTheDocument()
  })

  it('interrupts the immersive flow when text signals immediate danger', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '安静进入' }))
    answerCalibration()
    fireEvent.click(screen.getByRole('button', { name: '不甘' }))
    fireEvent.change(screen.getByLabelText('写下一句此刻最难说的话'), {
      target: { value: '我真的活不下去了，想结束生命' },
    })
    fireEvent.click(screen.getByRole('button', { name: '让空间承受它' }))

    expect(screen.getByRole('heading', { name: '先确保你此刻安全' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /12356/ })).toHaveAttribute('href', 'tel:12356')
  })

  it('carries a safe reflection into one small real-world action', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '安静进入' }))
    answerCalibration()
    fireEvent.click(screen.getByRole('button', { name: '不甘' }))
    fireEvent.change(screen.getByLabelText('写下一句此刻最难说的话'), {
      target: { value: '我很努力，但事情还是没有成功。' },
    })
    fireEvent.click(screen.getByRole('button', { name: '让空间承受它' }))
    fireEvent.click(screen.getByRole('button', { name: '暂时放远一点' }))
    fireEvent.click(screen.getByRole('button', { name: '认真生活' }))
    fireEvent.change(screen.getByLabelText('给明天留一个很小的行动'), {
      target: { value: '明早出门走十分钟' },
    })
    fireEvent.click(screen.getByRole('button', { name: '留下这个下一步' }))

    expect(screen.getByRole('heading', { name: '微光没有替你回答' })).toBeInTheDocument()
    expect(screen.getByText('明早出门走十分钟')).toBeInTheDocument()
  })
})
