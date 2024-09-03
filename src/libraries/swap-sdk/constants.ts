import { ChainId } from 'config/chains'
import { Percent } from 'libraries/swap-sdk-core'
import { ERC20Token } from './entities/token'

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const FACTORY_ADDRESS = '0x7E0987E5b3a30e3f2828572Bb659A548460a3003'

export const FACTORY_ADDRESS_MAP: Record<number, `0x${string}`> = {
  [ChainId.SEPOLIA]: FACTORY_ADDRESS,
}
export const INIT_CODE_HASH = '0x4156ccc01dad273e6c65c4335c428a2ff4a4b0c95a9a228f6bfed45a069d3fe7'

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
