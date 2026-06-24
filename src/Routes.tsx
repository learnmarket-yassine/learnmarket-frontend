import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />}></Route>
      <Route path="signup" element={<RegisterPage />}></Route>
    </Routes>
  )
}

export default AppRoutes
