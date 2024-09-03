import { ChainId } from 'config/chains'

export default {
  masterChef: {
    [ChainId.SEPOLIA]: '0xAd55EDBeB57fDD66DB9789FE801E5dE8BB55149E',
  },
  multiCall: {
    [ChainId.SEPOLIA]: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
  multisender: {
    42161: '0x5cce03fcbe62ac9d77b594201c5ccb7f952069e8'
  },
  locker: {
    42161: '0x83696B8968a9D0F075Ac23ca37aF76442B66A30e',
  },
  launchpadFactory: {
    42161: '0x7e3F6966D370A0E4370529adC12868eedd515e29',
  },
  contribution: {
    42161: '0x140C951040439276bf96Bb9bc801B83704f09E6c',
  },
  smartRouter: {
    42161: '0xE80EBc294cC42DC1ccc1FF1b5A684593c80a0b01',
  }
} as const satisfies Record<string, Record<number, `0x${string}`>>
