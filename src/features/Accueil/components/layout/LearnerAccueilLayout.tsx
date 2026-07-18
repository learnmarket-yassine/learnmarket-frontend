import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/store'
import { Plus } from 'lucide-react'

type LearnerAccueilPageLayoutProps = {
  children: React.ReactNode
}

const LearnerAccueilPageLayout: React.FC<LearnerAccueilPageLayoutProps> = ({ children }) => {
  const user = useStore((state) => state.auth.user)

  return (
    <div className="flex flex-col gap-10">
      <div className="relative overflow-hidden rounded-2xl bg-[#143681] px-8 py-10 text-white">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/5" />
        <div className="relative flex flex-col space-y-6">
          <span className="text-lg font-medium text-white/70">
            Welcome back{user ? `, ${user.firstname}` : ''}
          </span>
          <h1 className="text-3xl font-bold leading-tight">
            Tell us what you want to learn, we'll find the right tutor.
          </h1>
          <p className="text-white/80">
            Post a learning request with your goals and budget, and start receiving proposals from
            qualified tutors in your area of interest.
          </p>
          <Button
            asChild
            className="w-fit rounded-full bg-white px-6 py-5 font-bold text-[#143681] hover:bg-white/90"
          >
            <Link to="/learn-request/create">
              <Plus className="h-4 w-4" />
              Post a learning request
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex flex-1 flex-col space-y-12">{children}</div>
    </div>
  )
}

export default LearnerAccueilPageLayout
