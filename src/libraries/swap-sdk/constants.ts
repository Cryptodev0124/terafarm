import { ChainId } from 'config/chains'
import { Percent } from 'libraries/swap-sdk-core'
import { ERC20Token } from './entities/token'

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const FACTORY_ADDRESS = '0xC892fa4Cf6B7273D835fe8689922245f6Daa99dC'

export const FACTORY_ADDRESS_MAP: Record<number, `0x${string}`> = {
  [ChainId.SEPOLIA]: FACTORY_ADDRESS,
}
export const INIT_CODE_HASH = '0x24b922868d766783a6de067da98fe472069c9d67c0ce795f5d0cc7ecb7d05315'

export const INIT_CODE_HASH_MAP: Record<number, `0x${string}`> = {
  [ChainId.SEPOLIA]: INIT_CODE_HASH,
}

export const WETH9 = {
  [ChainId.SEPOLIA]: new ERC20Token(
    ChainId.SEPOLIA,
    '0xdd13E55209Fd76AfE204dBda4007C227904f0a81',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
}

export const WNATIVE: Record<number, ERC20Token> = {
  [ChainId.SEPOLIA]: WETH9[ChainId.SEPOLIA],
}

export const NATIVE: Record<
  number,
  {
    name: string
    symbol: string
    decimals: number
  }
> = {
  [ChainId.SEPOLIA]: { name: 'Ether', symbol: 'ETH', decimals: 18 },
}
