import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'

const deleteAvailabilityRule = async (axiosPrivate: AxiosInstance, id: string) => {
  const response = await axiosPrivate.delete(`/tutor/availability/rules/${id}`)
  return response.data
}

export default function useDeleteAvailabilityRule() {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const deleteAvailabilityRulesMutation = useMutation({
    mutationFn: (id: string) => deleteAvailabilityRule(axiosPrivate, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['availabilityRules'] }),
  })
  const handleDeleteAvailabilityRule = async (id: string) => {
    await deleteAvailabilityRulesMutation.mutateAsync(id)
  }
  return {
    handleDeleteAvailabilityRule,
    isPending: deleteAvailabilityRulesMutation.isPending,
  }
}
