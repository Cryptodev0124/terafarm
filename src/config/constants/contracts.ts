import { ChainId } from 'config/chains'

export default {
  masterChef: {
    [ChainId.SEPOLIA]: '0x6Bcf4D93af17e3F949D8db7fB2f08Aa9dE283554',
  },
  multiCall: {
    [ChainId.SEPOLIA]: '0xA706813a37cC24F5b7A2013cF1CDd136a1b44f7F',
  },
  multisender: {
    11155111: '0x5cce03fcbe62ac9d77b594201c5ccb7f952069e8'
  },
  locker: {
    11155111: '0x83696B8968a9D0F075Ac23ca37aF76442B66A30e',
  },
  launchpadFactory: {
    11155111: '0x7e3F6966D370A0E4370529adC12868eedd515e29',
  },
  contribution: {
    11155111: '0x140C951040439276bf96Bb9bc801B83704f09E6c',
  },
  smartRouter: {
    11155111: '0xE80EBc294cC42DC1ccc1FF1b5A684593c80a0b01',
  }
} as const satisfies Record<string, Record<number, `0x${string}`>>
