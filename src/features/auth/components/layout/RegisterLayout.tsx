import AuthHeader from './AuthHeader'
import RoleSwitcher from '../ui/RoleSwitcher'
import RoleCard from '../ui/RoleCard'
import LearnerImg from '@/assets/images/Learner_image.png'
import TutorImg from '@/assets/images/Tutor_image.png'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/store'
import useGetUser from '../../hooks/useGetUser'
import { useEffect } from 'react'

type RegisterLayoutProps = {
  children: React.ReactNode
}

const RegisterLayout = ({ children }: RegisterLayoutProps) => {
  const { role, setRole } = useStore((state) => state.auth)
  const navigate = useNavigate()
  const auth = useStore((state) => state.auth.authenticationResult?.token)
  const user = useStore((state) => state.auth.user)
  const getUserQuery = useGetUser()
  useEffect(() => {
    if (auth && getUserQuery.data) {
      navigate('/', { replace: true })
    }
  }, [auth, user, navigate, getUserQuery.isLoading, getUserQuery.data])
  return auth && !user ? (
    <div className="flex h-full w-full items-center justify-center"> ...loading</div>
  ) : (
    <div className="min-h-screen bg-[#f7f7f7] py-8">
      <div className="container">
        <AuthHeader
          onButtonClick={() => {
            navigate('/login')
          }}
          buttonLabel="login"
        />
      </div>

      <main className="mt-6">
        <div className="relative grid grid-cols-2 gap-4">
          <RoleSwitcher role={role} setRole={setRole} />

          {/* LEFT */}
          {role === 'LEARNER' ? (
            children
          ) : (
            <RoleCard
              variant="left"
              title="I want to teach"
              description="Share your expertise, create structured learning plans, and grow your mentoring business."
              image={TutorImg}
            />
          )}

          {/* RIGHT */}

          {role === 'TUTOR' ? (
            children
          ) : (
            <RoleCard
              variant="right"
              title="I want to learn"
              description="Find mentors, receive personalized learning plans, and track your progress securely."
              image={LearnerImg}
            />
          )}
        </div>
      </main>
    </div>
  )
}
export default RegisterLayout
