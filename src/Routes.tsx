import { Routes, Route } from 'react-router-dom'
import AuthLayout from './features/auth/components/layout/AuthLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="login"
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      ></Route>
      <Route path="register" element={<RegisterPage />}></Route>
    </Routes>
  )
}

export default AppRoutes
