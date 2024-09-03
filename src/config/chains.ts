import memoize from 'lodash/memoize'

import {
  Chain,
  arbitrum,
  sepolia,
} from 'wagmi/chains'

export enum ChainId {
  // ARBITRUM = 42161,
  SEPOLIA = 11155111,
}

export const CHAIN_QUERY_NAME: Record<ChainId, string> = {
  // [ChainId.ARBITRUM]: 'arb',
  [ChainId.SEPOLIA]: 'sepolia',
}

const CHAIN_QUERY_NAME_TO_ID = Object.entries(CHAIN_QUERY_NAME).reduce((acc, [chainId, chainName]) => {
  return {
    [chainName.toLowerCase()]: chainId as unknown as ChainId,
    ...acc,
  }
}, {} as Record<string, ChainId>)

export const CHAINS: [Chain, ...Chain[]] = [
  // mainnet,
  // arbitrum
  sepolia
]

export const PUBLIC_NODES: Record<ChainId, string[] | readonly string[]> = {
  [ChainId.SEPOLIA]: [
    ...sepolia.rpcUrls.default.http,
    'https://ethereum-sepolia-rpc.publicnode.com',
    'https://endpoints.omniatech.io/v1/eth/sepolia/public',
  ],
}

export const getChainId = memoize((chainName: string) => {
  if (!chainName) return undefined
  return CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] ? +CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] : undefined
})