import { useNavigate } from 'react-router-dom'
import AuthHeader from './AuthHeader'
import AuthImg from '@/assets/images/login.png'

type AuthLayoutProps = {
  children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const navigate = useNavigate()
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <img src={AuthImg} alt="" className="absolute inset-0 h-full w-full object-cover" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="container relative z-10 flex min-h-screen flex-col pb-16 pt-8">
        {/* Header */}
        <AuthHeader
          buttonLabel="Signup"
          onButtonClick={() => {
            navigate('/register')
          }}
        />

        {/* Main content */}
        <main className="mt-8 flex flex-1">
          {/* Left */}
          <section className="flex flex-1 items-end">
            <div className="flex max-w-2xl flex-col gap-4 text-white">
              <h1 className="text-4xl font-bold">Learn. Teach. Grow together.</h1>

              <p className="text-2xl">
                Connect with mentors and learners in a trusted space designed for personalized
                growth.
              </p>
            </div>
          </section>
          {/* Right */}
          {children}
        </main>
      </div>
    </div>
  )
}

export default AuthLayout
