import { useMemo, useState } from 'react'
import { ExperienceChrome } from './components/ExperienceChrome'
import { reflectionQuestions } from './data/questions'
import {
  createInitialExperience,
  deriveEmotionCandidates,
  recordAnswer,
  selectEmotion,
  type EmotionLabel,
} from './lib/experience'
import { assessSafety, normalizeUserText } from './lib/safety'
import { ArrivalStage } from './stages/ArrivalStage'
import { CalibrationStage } from './stages/CalibrationStage'
import { ClosureStage } from './stages/ClosureStage'
import { ConfirmationStage } from './stages/ConfirmationStage'
import { EmbodimentStage } from './stages/EmbodimentStage'
import { ExpressionStage } from './stages/ExpressionStage'
import { HelpStage } from './stages/HelpStage'
import { ValuesStage } from './stages/ValuesStage'

type Stage =
  | 'arrival'
  | 'calibration'
  | 'confirmation'
  | 'expression'
  | 'embodiment'
  | 'values'
  | 'closure'
  | 'help'

const stageProgress: Record<Stage, number> = {
  arrival: 0,
  calibration: 0.2,
  confirmation: 0.4,
  expression: 0.55,
  embodiment: 0.7,
  values: 0.85,
  closure: 1,
  help: 0,
}

export default function App() {
  const [stage, setStage] = useState<Stage>('arrival')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [experience, setExperience] = useState(createInitialExperience)
  const [prefersMicrophone, setPrefersMicrophone] = useState(false)
  const [reflection, setReflection] = useState('')
  const [chosenValue, setChosenValue] = useState('')
  const [action, setAction] = useState('')
  const [reducedMotion, setReducedMotion] = useState(false)

  const candidates = useMemo(() => deriveEmotionCandidates(experience), [experience])

  const reset = () => {
    setStage('arrival')
    setQuestionIndex(0)
    setExperience(createInitialExperience())
    setPrefersMicrophone(false)
    setReflection('')
    setChosenValue('')
    setAction('')
  }

  const answerQuestion = (answer: string) => {
    const question = reflectionQuestions[questionIndex]
    const nextExperience = recordAnswer(experience, question.key, answer)
    setExperience(nextExperience)
    if (questionIndex === reflectionQuestions.length - 1) {
      setStage('confirmation')
      return
    }
    setQuestionIndex((current) => current + 1)
  }

  const confirmEmotion = (emotion: EmotionLabel) => {
    setExperience((current) => selectEmotion(current, emotion))
    setStage('expression')
  }

  const acceptReflection = (input: string) => {
    const normalized = normalizeUserText(input)
    if (assessSafety(normalized) === 'urgent') {
      setStage('help')
      return
    }
    setReflection(normalized)
    setStage('embodiment')
  }

  const completeExperience = (value: string, nextAction: string) => {
    setChosenValue(value)
    setAction(normalizeUserText(nextAction))
    setStage('closure')
  }

  const content = (() => {
    switch (stage) {
      case 'arrival':
        return (
          <ArrivalStage
            onStart={(withMicrophone) => {
              setPrefersMicrophone(withMicrophone)
              setStage('calibration')
            }}
          />
        )
      case 'calibration':
        return (
          <CalibrationStage
            index={questionIndex}
            total={reflectionQuestions.length}
            question={reflectionQuestions[questionIndex]}
            onAnswer={answerQuestion}
          />
        )
      case 'confirmation':
        return <ConfirmationStage candidates={candidates} onConfirm={confirmEmotion} />
      case 'expression':
        return (
          <ExpressionStage
            emotion={experience.confirmedEmotion ?? candidates[0]}
            prefersMicrophone={prefersMicrophone}
            onContinue={acceptReflection}
          />
        )
      case 'embodiment':
        return <EmbodimentStage reflection={reflection} onContinue={() => setStage('values')} />
      case 'values':
        return <ValuesStage onComplete={completeExperience} />
      case 'closure':
        return <ClosureStage value={chosenValue} action={action} onRestart={reset} />
      case 'help':
        return <HelpStage onReturn={reset} />
    }
  })()

  return (
    <ExperienceChrome
      progress={stageProgress[stage]}
      onHelp={() => setStage('help')}
      reducedMotion={reducedMotion}
      onToggleMotion={() => setReducedMotion((current) => !current)}
    >
      <div className="ambient-placeholder" aria-hidden="true" data-stage={stage} />
      <div className={reducedMotion ? 'stage-layer reduce-motion' : 'stage-layer'} aria-live="polite">
        {content}
      </div>
    </ExperienceChrome>
  )
}
