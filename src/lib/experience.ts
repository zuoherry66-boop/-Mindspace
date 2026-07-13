export type EmotionLabel =
  | '悲伤'
  | '生气'
  | '恨意'
  | '不甘'
  | '无奈'
  | '开心'
  | '说不清'

export type QuestionKey = 'energy' | 'body' | 'impulse' | 'label'

export interface ExperienceState {
  answers: Partial<Record<QuestionKey, string>>
  confirmedEmotion: EmotionLabel | null
}

const emotionOrder: EmotionLabel[] = [
  '悲伤',
  '生气',
  '恨意',
  '不甘',
  '无奈',
  '开心',
  '说不清',
]

const directLabels: Record<string, EmotionLabel> = {
  sad: '悲伤',
  angry: '生气',
  hate: '恨意',
  unwilling: '不甘',
  helpless: '无奈',
  happy: '开心',
  unclear: '说不清',
}

export function createInitialExperience(): ExperienceState {
  return { answers: {}, confirmedEmotion: null }
}

export function recordAnswer(
  state: ExperienceState,
  question: QuestionKey,
  answer: string,
): ExperienceState {
  return {
    ...state,
    answers: { ...state.answers, [question]: answer },
  }
}

export function selectEmotion(
  state: ExperienceState,
  emotion: EmotionLabel,
): ExperienceState {
  return { ...state, confirmedEmotion: emotion }
}

export function deriveEmotionCandidates(state: ExperienceState): EmotionLabel[] {
  const scores = new Map(emotionOrder.map((emotion) => [emotion, 0]))
  const add = (emotion: EmotionLabel, score: number) => {
    scores.set(emotion, (scores.get(emotion) ?? 0) + score)
  }

  switch (state.answers.energy) {
    case 'sink':
      add('悲伤', 2)
      add('无奈', 1)
      break
    case 'restless':
      add('生气', 2)
      add('不甘', 1)
      break
    case 'light':
      add('开心', 3)
      break
    case 'unclear':
      add('说不清', 2)
      break
  }

  switch (state.answers.impulse) {
    case 'hide':
      add('悲伤', 2)
      add('无奈', 1)
      break
    case 'fight':
      add('生气', 2)
      add('恨意', 1)
      break
    case 'hold-on':
      add('不甘', 2)
      add('生气', 1)
      break
    case 'stay':
      add('无奈', 2)
      add('说不清', 1)
      break
  }

  const direct = state.answers.label && directLabels[state.answers.label]
  if (direct) add(direct, direct === '说不清' ? 4 : 6)

  const ranked = emotionOrder
    .map((emotion, index) => ({ emotion, index, score: scores.get(emotion) ?? 0 }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ emotion }) => emotion)

  if (ranked.length === 0) return ['说不清']
  if (ranked.length === 1) return ranked
  return ranked.slice(0, 2)
}
