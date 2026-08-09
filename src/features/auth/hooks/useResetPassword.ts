import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from '@/lib/api/client'
import { useStore } from '@/store/store'
import { ResetPasswordValues } from '../schemas'
import ToastMessage from '@/components/layout/ToastMessage'

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
      ToastMessage({ type: 'success', message: 'Your password has been reset successfully.' })
      navigate('/login')
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Could not reset your password. Please try again.' })
    },
  })
}

export default useResetPassword
