import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PersistLogin from './PersistLogin'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import VerifCodePage from './pages/VerifCodePage'
import MyProfilePage from './pages/myProfilePage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route path="login" element={<LoginPage />}></Route>
      </Route>
      <Route path="forgot-password" element={<ForgotPasswordPage />}></Route>
      <Route path="reset-password" element={<ResetPasswordPage />}></Route>
      <Route path="verif-code" element={<VerifCodePage />}></Route>
      <Route path="signup" element={<RegisterPage />}></Route>
      {/* <Route element={<PersistLogin />}> */}
      <Route path="my-profile" element={<MyProfilePage />}></Route>
      {/* </Route> */}
    </Routes>
  )
}

export default AppRoutes
