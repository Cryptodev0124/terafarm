import { useCallback } from 'react'
import { unlockLiquidity, unlockLiquidityETH } from 'utils/calls/contribute'
import { useContributionProgram } from 'hooks/useContracts'

const useLock = () => {
  const locker = useContributionProgram()

  const handleUnlock = useCallback(
    async (id, amount) => {
      return unlockLiquidity(locker, id, amount)
    },
    [locker],
  )

  const handleUnlockETH = useCallback(
    async (id, amount) => {
      return unlockLiquidityETH(locker, id, amount)
    },
    [locker],
  )

  return { 
    onUnlock: handleUnlock,
    onUnlockETH: handleUnlockETH
  }
}

export default useLock
