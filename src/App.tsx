import { useEffect, useMemo, useRef, useState } from 'react'
import { DreamCanvas } from './components/DreamCanvas'
import { ExperienceChrome } from './components/ExperienceChrome'
import { useMicrophoneLevel } from './hooks/useMicrophoneLevel'
import {
  createInitialExperience,
  deriveEmotionCandidates,
  recordAnswer,
  selectEmotion,
  type EmotionLabel,
} from './lib/experience'
import { interpretGesture, type GesturePoint } from './lib/gesture'
import { createInteractionSignal, settleInteraction } from './lib/interaction'
import { assessSafety, normalizeUserText } from './lib/safety'
import type { VisualStage as Stage } from './lib/visualProfile'
import { ArrivalStage } from './stages/ArrivalStage'
import { ClosureStage } from './stages/ClosureStage'
import { DistanceStage } from './stages/DistanceStage'
import { EmotionConstellationStage } from './stages/EmotionConstellationStage'
import { HelpStage } from './stages/HelpStage'
import { ReleaseStage } from './stages/ReleaseStage'
import { TactileCalibrationStage } from './stages/TactileCalibrationStage'
import { ValueLightsStage } from './stages/ValueLightsStage'

const stageProgress: Record<Stage, number> = {
  arrival: 0,
  calibration: 0.18,
  confirmation: 0.36,
  expression: 0.54,
  embodiment: 0.72,
  values: 0.88,
  closure: 1,
  help: 0,
}

export default function App() {
  const [stage, setStage] = useState<Stage>('arrival')
  const [experience, setExperience] = useState(createInitialExperience)
  const [reflection, setReflection] = useState('')
  const [chosenValue, setChosenValue] = useState('')
  const [action, setAction] = useState('')
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  )
  const interactionRef = useRef(createInteractionSignal())
  const stageLayerRef = useRef<HTMLDivElement>(null)
  const microphone = useMicrophoneLevel()
  const candidates = useMemo(() => deriveEmotionCandidates(experience), [experience])

  const resetInteraction = () => {
    Object.assign(interactionRef.current, createInteractionSignal())
  }

  const moveToStage = (nextStage: Stage) => {
    settleInteraction(interactionRef.current)
    interactionRef.current.trace = Math.max(interactionRef.current.trace, stageProgress[nextStage])
    setStage(nextStage)
  }

  useEffect(() => {
    interactionRef.current.trace = Math.max(interactionRef.current.trace, stageProgress[stage])
    stageLayerRef.current?.focus({ preventScroll: true })
  }, [stage])

  const reset = () => {
    microphone.stop()
    resetInteraction()
    setStage('arrival')
    setExperience(createInitialExperience())
    setReflection('')
    setChosenValue('')
    setAction('')
  }

  const completeGesture = (point: GesturePoint) => {
    const meaning = interpretGesture(point)
    let next = recordAnswer(experience, 'energy', meaning.energy)
    next = recordAnswer(next, 'body', meaning.body)
    next = recordAnswer(next, 'impulse', meaning.impulse)
    setExperience(next)
    interactionRef.current.tension = Math.max(interactionRef.current.tension, Math.hypot(point.x, point.y))
    moveToStage('confirmation')
  }

  const confirmEmotion = (emotion: EmotionLabel) => {
    setExperience((current) => selectEmotion(current, emotion))
    moveToStage('expression')
  }

  const finishRelease = (input: string) => {
    microphone.stop()
    settleInteraction(interactionRef.current)
    const normalized = normalizeUserText(input)
    if (assessSafety(normalized) === 'urgent') {
      moveToStage('help')
      return
    }
    setReflection(normalized)
    moveToStage('embodiment')
  }

  const finishValues = (value: string, nextAction: string) => {
    setChosenValue(value)
    setAction(normalizeUserText(nextAction))
    moveToStage('closure')
  }

  const content = (() => {
    switch (stage) {
      case 'arrival':
        return <ArrivalStage onStart={() => moveToStage('calibration')} />
      case 'calibration':
        return <TactileCalibrationStage interactionRef={interactionRef} onComplete={completeGesture} />
      case 'confirmation':
        return <EmotionConstellationStage candidates={candidates} onConfirm={confirmEmotion} />
      case 'expression':
        return (
          <ReleaseStage
            emotion={experience.confirmedEmotion ?? candidates[0] ?? '说不清'}
            interactionRef={interactionRef}
            microphoneStatus={microphone.status}
            microphoneLevel={microphone.level}
            onStartMicrophone={() => void microphone.start()}
            onStopMicrophone={microphone.stop}
            onContinue={finishRelease}
          />
        )
      case 'embodiment':
        return (
          <DistanceStage
            reflection={reflection}
            interactionRef={interactionRef}
            onContinue={() => {
              moveToStage('values')
            }}
          />
        )
      case 'values':
        return <ValueLightsStage interactionRef={interactionRef} onComplete={finishValues} />
      case 'closure':
        return <ClosureStage value={chosenValue} action={action} onRestart={reset} />
      case 'help':
        return <HelpStage onReturn={reset} />
    }
  })()

  return (
    <ExperienceChrome
      progress={stageProgress[stage]}
      stage={stage}
      onHelp={() => {
        microphone.stop()
        moveToStage('help')
      }}
      reducedMotion={reducedMotion}
      onToggleMotion={() => setReducedMotion((current) => !current)}
    >
      <DreamCanvas
        stage={stage}
        emotion={experience.confirmedEmotion ?? candidates[0] ?? '说不清'}
        microphoneLevel={microphone.level}
        interactionRef={interactionRef}
        reducedMotion={reducedMotion}
      />
      <div
        key={stage}
        ref={stageLayerRef}
        className={reducedMotion ? 'stage-layer reduce-motion' : 'stage-layer'}
        data-stage={stage}
        tabIndex={-1}
        aria-live="polite"
      >
        {content}
      </div>
    </ExperienceChrome>
  )
}
