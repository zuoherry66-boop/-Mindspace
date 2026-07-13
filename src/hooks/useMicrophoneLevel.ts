import { useCallback, useEffect, useRef, useState } from 'react'
import { levelFromTimeDomain } from '../lib/audio'

export type MicrophoneStatus = 'idle' | 'requesting' | 'active' | 'denied' | 'unavailable'

export function useMicrophoneLevel() {
  const [status, setStatus] = useState<MicrophoneStatus>('idle')
  const [level, setLevel] = useState(0)
  const cleanupRef = useRef<() => void>(() => undefined)
  const requestRef = useRef(0)

  const stop = useCallback(() => {
    requestRef.current += 1
    cleanupRef.current()
    cleanupRef.current = () => undefined
    setLevel(0)
    setStatus('idle')
  }, [])

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || !window.AudioContext) {
      setStatus('unavailable')
      return
    }

    cleanupRef.current()
    const requestId = requestRef.current + 1
    requestRef.current = requestId
    setStatus('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false },
      })
      if (requestId !== requestRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }
      const context = new AudioContext()
      const analyser = context.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.75
      context.createMediaStreamSource(stream).connect(analyser)
      const samples = new Uint8Array(analyser.fftSize)
      let frame = 0
      let running = true
      let lastPublished = 0

      const read = (time = 0) => {
        if (!running) return
        analyser.getByteTimeDomainData(samples)
        if (time - lastPublished >= 50) {
          lastPublished = time
          setLevel((previous) => previous * 0.68 + levelFromTimeDomain(samples) * 0.32)
        }
        frame = requestAnimationFrame(read)
      }

      cleanupRef.current = () => {
        running = false
        cancelAnimationFrame(frame)
        stream.getTracks().forEach((track) => track.stop())
        void context.close()
      }
      setStatus('active')
      read()
    } catch {
      if (requestId === requestRef.current) setStatus('denied')
    }
  }, [])

  useEffect(() => () => {
    requestRef.current += 1
    cleanupRef.current()
  }, [])

  return { status, level, start, stop }
}
