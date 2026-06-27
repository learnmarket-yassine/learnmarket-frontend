import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from '@/lib/api/client'
import { useStore } from '@/store/store'
import { ResetPasswordValues } from '../schemas'

const resetPassword = async (data: ResetPasswordValues) => {
  const response = await axios.post('/auth/reset-password', data)
  return response.data
}

const useResetPassword = () => {
  const navigate = useNavigate()
  const { setCurrentStep } = useStore((state) => state.auth)

  return useMutation({
    mutationFn: (data: ResetPasswordValues) => resetPassword(data),
    onSuccess: () => {
      setCurrentStep(1)
      navigate('/login')
    },
  })
}

export default useResetPassword
