import { ChainId } from 'config/chains'
import { ERC20Token } from 'libraries/swap-sdk'

export const GTOKEN_ARB = new ERC20Token(
  ChainId.SEPOLIA,
  '0xb98E36B9310861d4D586bE06c957AD700B78a861',
  18,
  'PYRO',
  'Pyro Token',
)

export const USDC_ARB = new ERC20Token(
  ChainId.SEPOLIA,
  '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  6,
  'USDC',
  'USD Coin',
)

export const USDT_ARB = new ERC20Token(
  ChainId.SEPOLIA,
  '0x8deffc91657a9a51BB0CF5d442e52e1f6701004A',
  6,
  'USDT',
  'Tether USD',
  'https://tether.to/',
)

export const DAI_ARB = new ERC20Token(
  ChainId.SEPOLIA,
  '0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6',
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
