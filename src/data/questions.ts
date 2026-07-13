import type { QuestionKey } from '../lib/experience'

export interface QuestionOption {
  label: string
  value: string
}

export interface ReflectionQuestion {
  key: QuestionKey
  eyebrow: string
  prompt: string
  helper: string
  options: QuestionOption[]
}

export const reflectionQuestions: ReflectionQuestion[] = [
  {
    key: 'energy',
    eyebrow: '能量的方向',
    prompt: '它更像沉下去，还是让你停不下来？',
    helper: '不用解释原因，只选此刻更接近的一种。',
    options: [
      { label: '沉下去', value: 'sink' },
      { label: '停不下来', value: 'restless' },
      { label: '轻了一点', value: 'light' },
      { label: '说不清', value: 'unclear' },
    ],
  },
  {
    key: 'body',
    eyebrow: '身体的回声',
    prompt: '这种感觉，现在在身体哪里最明显？',
    helper: '身体有时比语言更早知道答案。',
    options: [
      { label: '胸口', value: 'chest' },
      { label: '喉咙', value: 'throat' },
      { label: '头部', value: 'head' },
      { label: '胃部', value: 'stomach' },
      { label: '全身', value: 'whole-body' },
      { label: '说不清', value: 'unclear' },
    ],
  },
  {
    key: 'impulse',
    eyebrow: '行动的冲动',
    prompt: '面对它，你现在更想做什么？',
    helper: '没有正确答案，也不需要让自己显得坚强。',
    options: [
      { label: '躲开', value: 'hide' },
      { label: '反击', value: 'fight' },
      { label: '抓住，不想放弃', value: 'hold-on' },
      { label: '只是停在这里', value: 'stay' },
    ],
  },
  {
    key: 'label',
    eyebrow: '靠近一个词',
    prompt: '如果暂时给它一个名字，哪个更接近？',
    helper: '这个词不是结论，你随时可以修改。',
    options: [
      { label: '悲伤', value: 'sad' },
      { label: '生气', value: 'angry' },
      { label: '恨意', value: 'hate' },
      { label: '不甘', value: 'unwilling' },
      { label: '无奈', value: 'helpless' },
      { label: '开心', value: 'happy' },
      { label: '说不清', value: 'unclear' },
    ],
  },
]

export const valueOptions = ['家人或关系', '尊严', '自由', '创作', '认真生活', '未来的自己']
