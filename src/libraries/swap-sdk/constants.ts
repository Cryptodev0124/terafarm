import { ChainId } from 'config/chains'
import { Percent } from 'libraries/swap-sdk-core'
import { ERC20Token } from './entities/token'

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const FACTORY_ADDRESS = '0xf1D7CC64Fb4452F05c498126312eBE29f30Fbcf9'

export const FACTORY_ADDRESS_MAP: Record<number, `0x${string}`> = {
  [ChainId.SEPOLIA]: FACTORY_ADDRESS,
}
export const INIT_CODE_HASH = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'

export const INIT_CODE_HASH_MAP: Record<number, `0x${string}`> = {
  [ChainId.SEPOLIA]: INIT_CODE_HASH,
}

export const WETH9 = {
  [ChainId.SEPOLIA]: new ERC20Token(
    ChainId.SEPOLIA,
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
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
