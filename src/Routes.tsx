import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PersistLogin from './PersistLogin'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import VerifCodePage from './pages/VerifCodePage'
import MyProfilePage from './pages/myProfilePage'
import TutorOnboardingPage from './pages/TutorOnboardingPage'
import RequireAuth from './RequireAuth'
import RequireTutorProfileComplete from './RequireTutorProfileComplete'
import Layout from './Layout'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route path="login" element={<LoginPage />}></Route>
        <Route path="signup" element={<RegisterPage />}></Route>
      </Route>
      <Route path="forgot-password" element={<ForgotPasswordPage />}></Route>
      <Route path="reset-password" element={<ResetPasswordPage />}></Route>
      <Route path="verif-code" element={<VerifCodePage />}></Route>
      <Route element={<PersistLogin />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/profile" replace />} />
          <Route element={<RequireAuth />}>
            <Route path="/onboarding" element={<TutorOnboardingPage />} />
            <Route element={<RequireTutorProfileComplete />}>
              <Route path="/profile" element={<MyProfilePage />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
