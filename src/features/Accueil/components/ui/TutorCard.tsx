import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAssetUrl } from '@/lib/utils'
import { MessageCircle, Star } from 'lucide-react'

export type TutorPreview = {
  id: string
  name: string
  avatar?: string
  country: string
  rate: number
  rating: number
  sessions: number
  currentCourse: string
}

const TutorCard: React.FC<TutorPreview> = ({
  name,
  avatar,
  country,
  rate,
  rating,
  sessions,
  currentCourse,
}) => {
  return (
    <div className="rounded-xl border border-[#6B7280] p-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              <AvatarImage src={getAssetUrl(avatar)} alt={name} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-[#1E293B]">{name}</span>
              <span className="text-xs text-[#6B7280]">{country}</span>
            </div>
          </div>
          <MessageCircle className="h-4 w-4 cursor-pointer" />
        </div>
        <p className="text-sm font-bold">
          Current course: <span className="font-medium text-[#374151]">{currentCourse}</span>
        </p>
        <div className="flex items-center justify-between gap-3 text-[#374151]">
          <span className="font-medium">${rate}.00/hr</span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
            {rating.toFixed(2)}
          </span>
          <span>{sessions} sessions</span>
        </div>
      </div>
    </div>
  )
}

export default TutorCard
