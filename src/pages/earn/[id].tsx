import { ChainId } from 'config/chains'
import { useRouter } from 'next/router'
import Farm from 'views/Farms/id'

const FarmPage = () => {
  const router = useRouter()

  const id = Number(router.query.id)
  return <Farm pid={id} />
}

FarmPage.chains = [ChainId.SEPOLIA]

export default FarmPage