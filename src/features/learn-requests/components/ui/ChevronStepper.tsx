import { cn } from '@/lib/utils'

type ChevronStep = {
  stepNumber: number
  component: React.JSX.Element | null
  show: boolean
  name: string
  enabled: boolean
}

type ChevronStepperProps = {
  selected: number
  setSelected: (selected: number) => void
  steps: ChevronStep[]
}

const POINT_DEPTH = 12
const BORDER_WIDTH = 1

const buildClipPath = (isFirst: boolean, depth: number) =>
  isFirst
    ? `polygon(0 0, calc(100% - ${depth}px) 0, 100% 50%, calc(100% - ${depth}px) 100%, 0 100%)`
    : `polygon(0 0, calc(100% - ${depth}px) 0, 100% 50%, calc(100% - ${depth}px) 100%, 0 100%, ${depth}px 50%)`

const ChevronStepper: React.FC<ChevronStepperProps> = ({ selected, setSelected, steps }) => {
  const visibleSteps = steps.filter((step) => step.show)

  return (
    <div className="flex w-full items-center">
      {visibleSteps.map((step, index) => {
        const active = selected === step.stepNumber
        const isFirst = index === 0

        return (
          <div
            key={step.stepNumber}
            onClick={() => step.enabled && setSelected(step.stepNumber)}
            style={{
              clipPath: buildClipPath(isFirst, POINT_DEPTH),
              marginLeft: isFirst ? 0 : -POINT_DEPTH,
              zIndex: visibleSteps.length - index,
              padding: BORDER_WIDTH,
            }}
            className={cn(
              'relative flex w-full',
              step.enabled ? 'cursor-pointer' : 'cursor-not-allowed',
              'bg-[#d0d0d0]'
            )}
          >
            <div
              style={{ clipPath: buildClipPath(isFirst, POINT_DEPTH - BORDER_WIDTH) }}
              className={cn(
                'flex w-full items-center justify-center p-6 text-center text-sm font-semibold transition-colors',
                active
                  ? 'bg-[#1a46a7] text-white'
                  : step.enabled
                    ? 'bg-[#f6f6f6] text-[#1a46a7]'
                    : 'bg-[#f6f6f6] text-[#b0b0b0]'
              )}
            >
              <span className="truncate leading-tight">{step.name}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ChevronStepper
