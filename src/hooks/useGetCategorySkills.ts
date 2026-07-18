import { useQuery } from '@tanstack/react-query'
import { AxiosInstance } from 'axios'
import useAxiosPrivate from './useAxiosPrivate'
import { Skill } from '@/types/skill'

type CategorySkillsInputType = {
  axiosPrivate: AxiosInstance
  categoryId: string
}

const getCategorySkills = async ({
  axiosPrivate,
  categoryId,
}: CategorySkillsInputType): Promise<Skill[]> => {
  const response = await axiosPrivate.get(`/categories/${categoryId}/skills`)
  return response.data
}

const useGetCategorySkills = (categoryId: string | null) => {
  const axiosPrivate = useAxiosPrivate()

  return useQuery({
    queryKey: ['categorySkills', categoryId],
    queryFn: () =>
      getCategorySkills({
        axiosPrivate,
        categoryId: categoryId!,
      }),
    enabled: !!categoryId,
  })
}

export default useGetCategorySkills
