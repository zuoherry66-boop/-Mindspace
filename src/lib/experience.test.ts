import { describe, expect, it } from 'vitest'
import {
  createInitialExperience,
  deriveEmotionCandidates,
  recordAnswer,
  selectEmotion,
} from './experience'

describe('emotion reflection engine', () => {
  it('prioritizes a directly chosen emotion while keeping a secondary nuance', () => {
    let state = createInitialExperience()
    state = recordAnswer(state, 'energy', 'restless')
    state = recordAnswer(state, 'impulse', 'hold-on')
    state = recordAnswer(state, 'label', 'unwilling')

    expect(deriveEmotionCandidates(state)).toEqual(['不甘', '生气'])
  })

  it('keeps uncertainty visible when answers do not support a confident label', () => {
    let state = createInitialExperience()
    state = recordAnswer(state, 'energy', 'unclear')
    state = recordAnswer(state, 'impulse', 'stay')
    state = recordAnswer(state, 'label', 'unclear')

    expect(deriveEmotionCandidates(state)).toEqual(['说不清', '无奈'])
  })

  it('lets the user override the engine suggestion', () => {
    const state = selectEmotion(createInitialExperience(), '悲伤')

    expect(state.confirmedEmotion).toBe('悲伤')
  })
})
