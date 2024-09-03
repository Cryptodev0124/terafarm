import { ChainId } from 'config/chains'
import { ERC20Token } from 'libraries/swap-sdk'

export const GTOKEN_ARB = new ERC20Token(
  ChainId.SEPOLIA,
  '0xcBC8e435993af38950a708Be002e1A6d1280132B',
  18,
  'DKO',
  'Duckstail Token',
  'https://duckstail.com/',
)

export const USDC_ARB = new ERC20Token(
  ChainId.SEPOLIA,
  '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  6,
  'USDC',
  'USD Coin',
)

export const USDT_ARB = new ERC20Token(
  ChainId.SEPOLIA,
  '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  6,
  'USDT',
  'Tether USD',
  'https://tether.to/',
)

export const DAI_ARB = new ERC20Token(
  ChainId.SEPOLIA,
  '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  18,
  'DAI',
  'Dai Stablecoin',
  'https://makerdao.com/',
)

export const WBTC_ARB = new ERC20Token(
  ChainId.SEPOLIA,
  '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  8,
  'WBTC',
  'Wrapped BTC',
)

export const GTOKEN = {
  [ChainId.SEPOLIA]: GTOKEN_ARB,
}

export const USDC = {
  [ChainId.SEPOLIA]: USDC_ARB,
}

export const USDT = {
  [ChainId.SEPOLIA]: USDT_ARB,
}

export const DAI = {
  [ChainId.SEPOLIA]: DAI_ARB,
}

export const PCB_ARB = new ERC20Token(
  ChainId.SEPOLIA,
  '0x02caEFC9083AFCD630beFdB2e67EC73FC3b2B42B',
  18,
  'PCB',
  'PentaCoin',
)

export const PCB = {
  [ChainId.SEPOLIA]: PCB_ARB,
}
