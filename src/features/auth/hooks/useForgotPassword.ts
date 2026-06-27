import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from '@/lib/api/client'
import { useStore } from '@/store/store'
import { ForgotPasswordValues } from '../schemas'

const forgotPassword = async (data: ForgotPasswordValues) => {
  const response = await axios.post('/auth/forgot-password', data)
  return response.data
}

const useForgotPassword = () => {
  const navigate = useNavigate()
  const { setCurrentStep } = useStore((state) => state.auth)

  return useMutation({
    mutationFn: (data: ForgotPasswordValues) => forgotPassword(data),
    onSuccess: (_, variables) => {
      setCurrentStep(2)
      navigate(`/verif-code?email=${variables.email}`)
    },
  })
}

export default useForgotPassword
