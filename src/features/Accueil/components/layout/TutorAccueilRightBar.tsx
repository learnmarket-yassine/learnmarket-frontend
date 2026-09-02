import { Link, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import AvatarImg from '@/assets/images/avatar.png'
import { AuthUser } from '@/features/auth/store/types'
import useGetSparksBalance from '@/features/sparks/hooks/useGetSparksBalance'
import { getAssetUrl } from '@/lib/utils'

interface TutorAccueilRightBarProps {
  user?: AuthUser | null
  isLoading?: boolean
  profileCompleteness?: number
  proposalsCount?: number
}

const TutorAccueilRightBar: React.FC<TutorAccueilRightBarProps> = ({
  user,
  isLoading,
  proposalsCount = 0,
}) => {
  const navigate = useNavigate()
  const { data: sparksBalance, isLoading: isSparksLoading } = useGetSparksBalance()
  if (isLoading || !user) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-56 w-full rounded-3xl" />
        <Skeleton className="h-32 w-full rounded-3xl" />
      </div>
    )
  }

  const initial = user.firstname?.charAt(0) ?? ''
  const displayName = `${user.firstname} ${user.lastname?.charAt(0) ?? ''}.`
  return (
    <div className="space-y-20">
      {/* Profile summary  */}
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <Avatar className="h-20 w-20 cursor-pointer after:border-none">
          <AvatarImage src={getAssetUrl(user?.avatar) || AvatarImg} alt={user.firstname} />
          <AvatarFallback className="bg-[#2563EB] text-sm font-semibold text-white">
            {initial}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-[#1E293B]">{displayName}</h2>
          {user.headline && <p className="text-sm text-[#6B7280]">{user.headline}</p>}
        </div>

        <Link
          to="/profile"
          className="text-sm font-semibold text-[#2563EB] underline underline-offset-2 hover:text-[#143681]"
        >
          Complete your profile
        </Link>
      </div>

      <div className="space-y-3 rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <h1 className="flex items-center gap-2 text-lg font-bold">
          Sparks:
          <span className="font-semibold">
            {isSparksLoading ? (
              <Skeleton className="h-5 w-8" />
            ) : (
              (sparksBalance?.sparksBalance ?? 0)
            )}
          </span>
        </h1>
        <div className="flex w-full items-center justify-center">
          <Button
            type="submit"
            variant={'outline'}
            className="h-full w-full whitespace-nowrap rounded-full bg-white px-6 py-3 font-semibold text-[#2563EB] hover:bg-white hover:text-[#2563EB]"
            onClick={() => navigate('/sparks/buy')}
          >
            Buy Sparks
          </Button>
        </div>
      </div>

      <div className="space-y-3 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#1E293B]">Proposals</h3>
          <span className="rounded-full bg-white px-2.5 py-0.5 text-sm font-semibold text-[#143681]">
            {proposalsCount}
          </span>
        </div>
        <Link
          to="/proposals"
          className="block font-semibold text-[#2563EB] underline underline-offset-2 hover:text-[#143681]"
        >
          My Proposals
        </Link>
        <p className="text-sm text-[#6B7280]">
          Browse learning requests and get started on a proposal.
        </p>
      </div>
    </div>
  )
}

export default TutorAccueilRightBar
