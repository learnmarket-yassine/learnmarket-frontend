import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Certification } from '../store/types'
import { CertificationFormData } from '../schemas'
import { toCertificationPayload } from '../utils/toCertificationPayload'

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
    },
  })
}

export default useCreateCertification
