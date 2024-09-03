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
    pid: 1,
    lpSymbol: 'WETH-USDC LP',
    lpAddress: '0x63a2254C67A93aF6E552F2C2f5F7f5099734f981',
    quoteToken: arbitrumTokens.weth,
    token: arbitrumTokens.usdc,
  },
  {
    pid: 2,
    lpSymbol: 'USDT-USDC LP',
    lpAddress: '0x2715dE6261dC4E2f5623721e31DABb4a375FBDA1',
    quoteToken: arbitrumTokens.usdt,
    token: arbitrumTokens.usdc,
  },
  {
    pid: 3,
    lpSymbol: 'WETH-USDT LP',
    lpAddress: '0xF06933523Baa0FB89691073c861216768cD3Df04',
    quoteToken: arbitrumTokens.weth,
    token: arbitrumTokens.usdt,
  },
  {
    pid: 4,
    lpSymbol: 'USDC-DAI LP',
    lpAddress: '0x77e4E2A1719DB27B4C4963d4Bf99cD4DEB12c355',
    quoteToken: arbitrumTokens.usdc,
    token: arbitrumTokens.dai,
  },
  {
    pid: 5,
    lpSymbol: 'WETH-DAI LP',
    lpAddress: '0xdc330F25A84888BC5d801aEF7F30EC1eb2140273',
    quoteToken: arbitrumTokens.weth,
    token: arbitrumTokens.dai,
  },
].map((p) => ({ ...p, lpAddress: p.lpAddress as `0x${string}`, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
