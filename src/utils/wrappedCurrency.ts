import { ChainId } from 'config/chains'
import { Currency, CurrencyAmount, Token, WNATIVE } from 'libraries/swap-sdk'

export { unwrappedToken } from 'libraries/tokens'

export function wrappedCurrency(
  currency: Currency | undefined | null,
  chainId: ChainId | undefined,
): Token | undefined {
  return chainId && currency?.isNative ? WNATIVE[chainId] : currency?.isToken ? currency : undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount<Currency> | undefined,
  chainId: ChainId | undefined,
): CurrencyAmount<Token> | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? CurrencyAmount.fromRawAmount(token, currencyAmount.quotient) : undefined
}
