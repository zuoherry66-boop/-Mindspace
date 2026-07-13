import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useMicrophoneLevel } from './useMicrophoneLevel'

const originalMediaDevices = Object.getOwnPropertyDescriptor(navigator, 'mediaDevices')
const originalAudioContext = Object.getOwnPropertyDescriptor(window, 'AudioContext')

afterEach(() => {
  if (originalMediaDevices) Object.defineProperty(navigator, 'mediaDevices', originalMediaDevices)
  else Reflect.deleteProperty(navigator, 'mediaDevices')
  if (originalAudioContext) Object.defineProperty(window, 'AudioContext', originalAudioContext)
  else Reflect.deleteProperty(window, 'AudioContext')
})

describe('useMicrophoneLevel', () => {
  it('discards a late permission result after the user leaves the microphone flow', async () => {
    const stopTrack = vi.fn()
    const stream = { getTracks: () => [{ stop: stopTrack }] } as unknown as MediaStream
    let resolveStream: (stream: MediaStream) => void = () => undefined
    const pendingStream = new Promise<MediaStream>((resolve) => {
      resolveStream = resolve
    })
    const audioContext = vi.fn()

    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia: vi.fn(() => pendingStream) },
    })
    Object.defineProperty(window, 'AudioContext', {
      configurable: true,
      value: audioContext,
    })

    const { result } = renderHook(() => useMicrophoneLevel())
    let startPromise: Promise<void> = Promise.resolve()
    act(() => {
      startPromise = result.current.start()
    })
    act(() => result.current.stop())
    await act(async () => {
      resolveStream(stream)
      await startPromise
    })

    expect(stopTrack).toHaveBeenCalledOnce()
    expect(audioContext).not.toHaveBeenCalled()
    expect(result.current.status).toBe('idle')
  })
})
