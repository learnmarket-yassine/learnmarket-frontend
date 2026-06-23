import { Routes, Route } from 'react-router-dom'
import AuthLayout from './features/auth/components/layout/AuthLayout'
import LoginPage from './pages/LoginPage'

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
    </Routes>
  )
}

export default AppRoutes
