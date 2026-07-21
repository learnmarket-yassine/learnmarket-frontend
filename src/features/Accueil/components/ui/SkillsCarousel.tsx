import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import SkillChip from '@/features/myProfile/components/ui/Skills/SkillChip'
import { Skill } from '@/types/skill'

interface SkillsSliderProps {
  skills?: { skill: Skill }[]
}

const SkillsSlider: React.FC<SkillsSliderProps> = ({ skills }) => {
  if (!skills || skills.length === 0) return null

  return (
    <Carousel opts={{ align: 'start', dragFree: true }} className="relative w-full">
      <CarouselContent className="px-8">
        {skills.map(({ skill }) => (
          <CarouselItem key={skill.id} className="basis-auto pl-2">
            <SkillChip key={skill.id} name={skill.name} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 h-8 w-8 rounded-full border-none bg-white text-[#1E293B] shadow-md hover:bg-white disabled:opacity-0" />
      <CarouselNext className="right-0 h-8 w-8 rounded-full border-none bg-white text-[#1E293B] shadow-md hover:bg-white disabled:opacity-0" />
    </Carousel>
  )
}

export default SkillsSlider
