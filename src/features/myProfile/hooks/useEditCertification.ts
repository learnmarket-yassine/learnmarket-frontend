import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Certification } from '../store/types'
import { CertificationFormData } from '../schemas'
import { toCertificationPayload } from '../utils/toCertificationPayload'
import ToastMessage from '@/components/layout/ToastMessage'

type EditCertificationVariables = {
  id: string
  payload: CertificationFormData
}

const useEditCertification = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  return useMutation({
    mutationFn: async ({ id, payload }: EditCertificationVariables): Promise<Certification> => {
      const response = await axiosPrivate.patch(
        `/tutor/certifications/${id}`,
        toCertificationPayload(payload)
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['UserInfo'] })
      ToastMessage({ type: 'success', message: 'Certification updated.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to update certification. Please try again.' })
    },
  })
}

export default useEditCertification
