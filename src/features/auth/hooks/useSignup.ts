import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from '@/lib/api/client'
import { SignupFormData } from '../schemas'
import ToastMessage from '@/components/layout/ToastMessage'

type SignupCredentials = SignupFormData & { role: string }

const signupUser = async (data: SignupCredentials) => {
  const response = await axios.post('/auth/signup', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

const useSignup = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (userCredentials: SignupCredentials) => await signupUser(userCredentials),
    onSuccess: () => {
      ToastMessage({
        type: 'success',
        message: 'Your account has been created successfully. Please log in.',
      })
      navigate('/login')
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Could not create your account. Please try again.' })
    },
  })
}

export default useSignup
