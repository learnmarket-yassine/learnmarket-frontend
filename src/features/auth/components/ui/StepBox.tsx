type StepBoxProps = {
  isCompleted: boolean
  allCompleted: boolean
}

const StepBox = ({ isCompleted, allCompleted }: StepBoxProps) => {
  const bgColor = allCompleted ? 'bg-[#31B652]' : isCompleted ? 'bg-[#225AD6]' : 'bg-[#B0B5BF]'

  return <div className={`h-[10px] w-[78px] rounded-full ${bgColor}`} />
}

export default StepBox
