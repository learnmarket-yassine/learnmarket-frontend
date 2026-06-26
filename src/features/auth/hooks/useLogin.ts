import { useStore } from '@/store/store'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from '@/lib/api/client'

type UserCredentials = {
  email: string
  password: string
}

const loginUser = async (data: UserCredentials) => {
  const response = await axios.post('/auth/login', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

const useLogin = () => {
  const setUser = useStore((state) => state.auth.setAuthenticationResult)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (userCredentials: UserCredentials) => await loginUser(userCredentials),
    onSuccess: (data) => {
      setUser(data)
      navigate('/')
    },
  })
}

export default useLogin
