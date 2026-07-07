import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PersistLogin from './PersistLogin'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import VerifCodePage from './pages/VerifCodePage'
import MyProfilePage from './pages/myProfilePage'
import TutorOnboardingPage from './pages/TutorOnboardingPage'
import ConnectsPage from './pages/ConnectsPage'
import ConnectsPurchaseSuccessPage from './pages/ConnectsPurchaseSuccessPage'
import ConnectsPurchaseCancelledPage from './pages/ConnectsPurchaseCancelledPage'
import AnnoncesPage from './pages/AnnoncesPage'
import MyProposalsPage from './pages/MyProposalsPage'
import RequireAuth from './RequireAuth'
// import RequireTutorProfileComplete from './RequireTutorProfileComplete'
import Layout from './Layout'
import RequireTutorProfileComplete from './RequireTutorProfileComplete'

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
            <Route element={<RequireTutorProfileComplete />}>
              <Route path="/profile" element={<MyProfilePage />} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth />}>
          <Route path="/onboarding" element={<TutorOnboardingPage />} />
          <Route path="/annonces" element={<AnnoncesPage />} />
          <Route path="/proposals" element={<MyProposalsPage />} />
          <Route path="/connects" element={<ConnectsPage />} />
          <Route path="/connects/purchase/success" element={<ConnectsPurchaseSuccessPage />} />
          <Route path="/connects/purchase/cancelled" element={<ConnectsPurchaseCancelledPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
