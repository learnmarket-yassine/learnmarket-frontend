import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PersistLogin from './PersistLogin'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import VerifCodePage from './pages/VerifCodePage'
import MyProfilePage from './pages/myProfilePage'
import OnboardingPage from './pages/OnboardingPage'
import RequireAuth from './RequireAuth'
import Layout from './Layout'
import RequireProfileComplete from './RequireProfileComplete'
import RequireRole from './RequireRole'
import TutorAvailabilityPage from './pages/TutorAvailabilityPage'
import BookingFlowPage from './pages/BookingFlowPage'
import CreateLearnRequestPage from './pages/CreateLearnRequestPage'
import MyLearningRequestsPage from './pages/LearningRequestPage'
import AccueilPage from './pages/AccueilPage'

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
          <Route index element={<Navigate to="/accueil" replace />} />
          <Route element={<RequireAuth />}>
            <Route element={<RequireProfileComplete />}>
              <Route path="/learning-requests" element={<MyLearningRequestsPage />} />
              <Route path="/profile" element={<MyProfilePage />} />
              <Route path="/accueil" element={<AccueilPage />} />
              <Route element={<RequireRole role="TUTOR" />}>
                <Route path="/availability" element={<TutorAvailabilityPage />} />
              </Route>
              <Route element={<RequireRole role="LEARNER" />}>
                <Route path="/proposals/:proposalId/book" element={<BookingFlowPage />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth />}>
          <Route element={<RequireProfileComplete />}>
            <Route path="/learn-request/create" element={<CreateLearnRequestPage />} />
            <Route path="/learn-request/edit/:id" element={<CreateLearnRequestPage />} />
          </Route>
        </Route>
      </Route>
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
