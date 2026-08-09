import { useMutation } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useStore } from '@/store/store'
import ToastMessage from '@/components/layout/ToastMessage'

type RemovePortfolioMediaVariables = {
  itemId: string
  mediaId: string
}

const useRemovePortfolioMedia = () => {
  const axiosPrivate = useAxiosPrivate()
  const { user, setUser } = useStore((state) => state.auth)

  return useMutation({
    mutationFn: async ({
      itemId,
      mediaId,
    }: RemovePortfolioMediaVariables): Promise<RemovePortfolioMediaVariables> => {
      await axiosPrivate.delete(`/tutor/portfolio/${itemId}/media/${mediaId}`)
      return { itemId, mediaId }
    },
    onSuccess: ({ itemId, mediaId }) => {
      if (!user?.tutorProfile) return

      setUser({
        ...user,
        tutorProfile: {
          ...user.tutorProfile,
          portfolio: user.tutorProfile.portfolio.map((item) =>
            item.id === itemId
              ? { ...item, media: (item.media ?? []).filter((media) => media.id !== mediaId) }
              : item
          ),
        },
      })
      ToastMessage({ type: 'success', message: 'File deleted.' })
    },
    onError: () => {
      ToastMessage({ type: 'error', message: 'Failed to delete file. Please try again.' })
    },
  })
}

export default useRemovePortfolioMedia
