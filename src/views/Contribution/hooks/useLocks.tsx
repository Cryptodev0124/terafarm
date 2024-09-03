import { useMemo } from 'react'
import { Address, erc20Abi, zeroAddress } from 'viem'
import { Currency, CurrencyAmount } from 'libraries/swap-sdk-core'
import { useMultipleContractSingleData, useSingleCallResult, useSingleContractMultipleData } from 'state/multicall/hooks'
import { useContributionProgram, useSmartRouter } from 'hooks/useContracts'
import { lpTokenABI } from 'config/abi/lpTokenAbi'
import BigNumber from 'bignumber.js'

// returns undefined if fails to get contract,
// or contract service fee cannot be fetched
export function useTotalContribution(): string | undefined {
  const contract = useContributionProgram()

  const count: string | undefined = useSingleCallResult({contract, functionName: 'getTotalContrubution'})?.result?.toString()

  return useMemo(
    () => count,
    [count],
  )
}

export function useLock(id: bigint) {
  const contract = useContributionProgram()

  const lockInfo = useSingleCallResult({
    contract,
    functionName: 'lockInfo',
    args: useMemo(() => [id] as const, [id]),
  }).result

  const unlockInfo = useSingleCallResult({
    contract,
    functionName: 'calculateUnlockInformation',
    args: useMemo(() => [id] as const, [id]),
  }).result

  const contrs = useSingleCallResult({
    contract,
    functionName: 'getContributionById',
    args: useMemo(() => [id] as const, [id]),
  }).result

	const token0 = useMultipleContractSingleData(
    {addresses: [lockInfo?.[1]],
    abi: lpTokenABI,
    functionName: 'token0',}
  )?.map((t) => t?.result)?.[0]

  const token1 = useMultipleContractSingleData(
    {addresses: [lockInfo?.[1]],
    abi: lpTokenABI,
    functionName: 'token1',}
  )?.map((t) => t?.result)?.[0]

  const name0 = useMultipleContractSingleData(
    {addresses: [token0],
    abi: lpTokenABI,
    functionName: 'name',}
  )?.map((t) => t?.result)?.[0]

  const name1 = useMultipleContractSingleData(
    {addresses: [token1],
    abi: erc20Abi,
    functionName: 'name',}
  )?.map((t) => t?.result)?.[0]

  const symbol0 = useMultipleContractSingleData(
    {addresses: [token0],
    abi: erc20Abi,
    functionName: 'symbol',}
  )?.map((t) => t?.result)?.[0]

  const symbol1 = useMultipleContractSingleData(
    {addresses: [token1],
    abi: erc20Abi,
    functionName: 'symbol',}
  )?.map((t) => t?.result)?.[0]

  const decimals0 = useMultipleContractSingleData(
    {addresses: [token0],
    abi: erc20Abi,
    functionName: 'decimals',}
  )?.map((t) => t?.result)?.[0]

  const decimals1 = useMultipleContractSingleData(
    {addresses: [token1],
    abi: erc20Abi,
    functionName: 'decimals',}
  )?.map((t) => t?.result)?.[0]

  return {
    id: lockInfo?.[0].toString(),
    pair: lockInfo?.[1].toString(),
    token0,
    token1,
    name0,
    name1,
    symbol0,
    symbol1,
    decimals0,
    decimals1,
    owner: lockInfo?.[2],
    locked: lockInfo?.[3].toString(),
    lockDate: lockInfo?.[4].toString(),
    vested: lockInfo?.[5].toString(),
    claimed: lockInfo?.[6],
    withdrawable: unlockInfo?.[0].toString(),
    penalty: unlockInfo?.[1].toString(),
    contribute: contrs?.toString()
  }
}

export function useLocksOfUser(user?: Address): any[] {
  const contract = useContributionProgram()

  const ids = useSingleCallResult({contract, functionName: 'getLockIdsOfUser', args: useMemo(() => [user ?? zeroAddress] as const, [user])})?.result

  const lockInfos = useSingleContractMultipleData({
    contract,
    functionName: 'lockInfo',
    args: useMemo(() => (ids ?? []).map((id) => [id] as const), [ids]),
  })

	const unlockInfos = useSingleContractMultipleData({
    contract,
    functionName: 'calculateUnlockInformation',
    args: useMemo(() => (ids ?? []).map((id) => [id] as const), [ids]),
  })

	const contrs = useSingleContractMultipleData({
    contract,
    functionName: 'getContributionById',
    args: useMemo(() => (ids ?? []).map((id) => [id] as const), [ids]),
  })

	const token0s = useMultipleContractSingleData(
    {addresses: lockInfos.map((l) => l.result?.[1]),
    abi: lpTokenABI,
    functionName: 'token0',}
  )?.map((t) => t?.result)

  const token1s = useMultipleContractSingleData(
    {addresses: lockInfos.map((l) => l.result?.[1]),
    abi: lpTokenABI,
    functionName: 'token1',}
  )?.map((t) => t?.result)

  const name0s = useMultipleContractSingleData(
    {addresses: token0s?.map((r) => r),
    abi: lpTokenABI,
    functionName: 'name',}
  )?.map((t) => t?.result)

  const name1s = useMultipleContractSingleData(
    {addresses: token1s?.map((r) => r),
    abi: erc20Abi,
    functionName: 'name',}
  )?.map((t) => t?.result)

  const symbol0s = useMultipleContractSingleData(
    {addresses: token0s?.map((r) => r),
    abi: erc20Abi,
    functionName: 'symbol',}
  )?.map((t) => t?.result)

  const symbol1s = useMultipleContractSingleData(
    {addresses: token1s?.map((r) => r),
    abi: erc20Abi,
    functionName: 'symbol',}
  )?.map((t) => t?.result)

  const decimals0s = useMultipleContractSingleData(
    {addresses: token0s?.map((r) => r),
    abi: erc20Abi,
    functionName: 'decimals',}
  )?.map((t) => t?.result)

  const decimals1s = useMultipleContractSingleData(
    {addresses: token1s?.map((r) => r),
    abi: erc20Abi,
    functionName: 'decimals',}
  )?.map((t) => t?.result)

  return useMemo(
    () => lockInfos.map((r, i) => {
			return {
				id: lockInfos[i].result?.[0].toString(),
				pair: lockInfos[i].result?.[1],
				token0: token0s[i],
				token1: token1s[i],
				name0: name0s[i],
				name1: name1s[i],
				symbol0: symbol0s[i],
				symbol1: symbol1s[i],
				decimals0: decimals0s[i],
				decimals1: decimals1s[i],
				owner: lockInfos[i].result?.[2],
				locked: lockInfos[i].result?.[3].toString(),
				lockDate: lockInfos[i].result?.[4].toString(),
				vested: lockInfos[i].result?.[5].toString(),
				claimed: lockInfos[i].result?.[6].toString(),
				withdrawable: unlockInfos[i].result?.[0].toString(),
				penalty: unlockInfos[i].result?.[1].toString(),
				contribute: contrs[i].result?.toString()
			}
		}),
    [lockInfos, unlockInfos, token0s, token1s, name0s, name1s, symbol0s, symbol1s, decimals0s, decimals1s, contrs],
  )
}

export function useContributionById(id?: bigint): string | undefined {
  const contract = useContributionProgram()

  const contribution = useSingleCallResult({contract, functionName: 'getContributionById', args: useMemo(() => [id] as const, [id])})?.result

  return useMemo(
    () => contribution,
    [contribution],
  )
}

export function useAvailablePair(pair?: Address): boolean {
	const contract = useContributionProgram()

  const contribution = useSingleCallResult({contract, functionName: 'availablePairs', args: useMemo(() => [pair] as const, [pair])})?.result

	return useMemo(
    () => contribution,
    [contribution],
  )
}

export function useUnlockInformation(id?: bigint): any {
	const contract = useContributionProgram()

  const result = useSingleCallResult({contract, functionName: 'calculateUnlockInformation', args: useMemo(() => [id] as const, [id])})?.result

	return useMemo(
    () => result,
    [result],
  )
}

export function useContribution(amount0?: CurrencyAmount<Currency>, amount1?: CurrencyAmount<Currency>) {
	const contract = useSmartRouter()
	const prices = useSingleContractMultipleData({
    contract,
    functionName: 'tokenPrice',
    args: useMemo(() => [[amount0?.currency.wrapped.address ?? zeroAddress], [amount1?.currency.wrapped.address ?? zeroAddress]] as const, [amount0, amount1]),
  }).map((p) => p?.result)

	const contribution0 = new BigNumber(amount0?.toExact() ?? 0).times(prices[0]?.[1].toString()).div(10 ** Number(prices[0]?.[0].toString()));
	const contribution1 = new BigNumber(amount1?.toExact() ?? 0).times(prices[1]?.[1].toString()).div(10 ** Number(prices[1]?.[0].toString()));
  
  return contribution0.plus(contribution1)
}