import { arbitrumTokens } from 'libraries/tokens'
import { SerializedFarmConfig } from '..'

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'PYRO',
    lpAddress: '0xb98E36B9310861d4D586bE06c957AD700B78a861',
    quoteToken: arbitrumTokens.usdt,
    token: arbitrumTokens.gtoken,
    isTokenOnly: true,
  },
  {
    pid: 2,
    lpSymbol: 'WETH-USDT LP',
    lpAddress: '0xe2714a24c574eDa7a8Bb58CF0c3dF0e8106c5472',
    quoteToken: arbitrumTokens.weth,
    token: arbitrumTokens.usdt,
  },
  {
    pid: 3,
    lpSymbol: 'PYRO-USDT LP',
    lpAddress: '0x884c715dc44EbC6AA9D4A8A876B15E8e5cBD2E3f',
    quoteToken: arbitrumTokens.usdt,
    token: arbitrumTokens.gtoken,
  },
  {
    pid: 4,
    lpSymbol: 'WETH-USDC LP',
    lpAddress: '0x63a2254C67A93aF6E552F2C2f5F7f5099734f981',
    quoteToken: arbitrumTokens.weth,
    token: arbitrumTokens.usdc,
  },
].map((p) => ({ ...p, lpAddress: p.lpAddress as `0x${string}`, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
