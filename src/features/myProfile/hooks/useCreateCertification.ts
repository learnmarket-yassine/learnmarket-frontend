import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Certification } from '../store/types'
import { CertificationFormData } from '../schemas'
import { toCertificationPayload } from '../utils/toCertificationPayload'
import ToastMessage from '@/components/layout/ToastMessage'

const useCreateCertification = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  return useMutation({
    mutationFn: async (data: CertificationFormData): Promise<Certification> => {
      const response = await axiosPrivate.post(
        '/tutor/certifications',
        toCertificationPayload(data)
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
      ToastMessage({ type: 'success', message: 'Certification added.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to add certification. Please try again.' })
    },
  })
}

export default useCreateCertification
