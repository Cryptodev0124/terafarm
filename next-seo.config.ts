import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | Terafarm',
  defaultTitle: 'Terafarm',
  description:
    'Discover Terafarm, the leading DEX on Sepolia testnet with the best rewarding in DeFi.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@',
    site: '@',
  },
  openGraph: {
    title: 'Terafarm - A next evolution DeFi exchange on Sepolia testnet',
    description:
      'The most popular AMM on Sepolia testnet! Earn PYRO through yield farming, then stake it in Pools to earn more tokens!',
    images: [{ url: 'https://app.duckstail.com/logo.png' }],
  },
}
