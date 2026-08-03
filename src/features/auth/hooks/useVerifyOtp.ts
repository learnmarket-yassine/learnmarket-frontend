import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from '@/lib/api/client'
import { useStore } from '@/store/store'
import { VerifCodeValues } from '../schemas'
import ToastMessage from '@/components/layout/ToastMessage'

const verifyOtp = async (data: VerifCodeValues) => {
  const response = await axios.post('/auth/verify-otp', data)
  return response.data
}

const useVerifyOtp = () => {
  const navigate = useNavigate()
  const { setCurrentStep } = useStore((state) => state.auth)

  return useMutation({
    mutationFn: (data: VerifCodeValues) => verifyOtp(data),
    onSuccess: (data) => {
      setCurrentStep(3)
      ToastMessage({ type: 'success', message: 'Your code has been verified successfully.' })
      navigate(`/reset-password?token=${data.resetToken}`)
    },
    onError: () => {
      ToastMessage({
        type: 'error',
        message: 'Invalid or expired verification code. Please try again.',
      })
    },
  })
}

export default useVerifyOtp
