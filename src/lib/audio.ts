export function levelFromTimeDomain(samples: Uint8Array) {
  if (samples.length === 0) return 0

  const meanSquare = samples.reduce((sum, sample) => {
    const centered = (sample - 128) / 128
    return sum + centered * centered
  }, 0) / samples.length

  return Math.min(1, Math.sqrt(meanSquare) * 1.45)
}
