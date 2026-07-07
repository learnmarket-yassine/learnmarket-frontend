import { useQuery } from '@tanstack/react-query'
import axios from '@/lib/api/client'
import { ConnectsPackage } from '../types'

const useConnectsPackages = () =>
  useQuery({
    queryKey: ['ConnectsPackages'],
    queryFn: async (): Promise<ConnectsPackage[]> => {
      const response = await axios.get('/connects/packages')
      return response.data
    },
  })

export default useConnectsPackages
