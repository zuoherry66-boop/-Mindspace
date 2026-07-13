export type SafetyLevel = 'normal' | 'urgent'

const urgentPatterns = [
  /想死/u,
  /不想活/u,
  /活不下去/u,
  /结束生命/u,
  /自杀/u,
  /伤害自己/u,
  /伤害别人/u,
  /杀了(?:他|她|他们|她们|别人)/u,
  /kill\s+(?:myself|someone)/iu,
  /suicid(?:e|al)/iu,
]

export function normalizeUserText(input: string): string {
  return input.trim().replace(/\s+/gu, ' ').slice(0, 500)
}

export function assessSafety(input: string): SafetyLevel {
  const normalized = normalizeUserText(input)
  return urgentPatterns.some((pattern) => pattern.test(normalized))
    ? 'urgent'
    : 'normal'
}
