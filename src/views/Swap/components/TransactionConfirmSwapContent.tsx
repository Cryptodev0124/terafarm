import { useCallback, useMemo, memo } from 'react'
import { Currency, Trade, TradeType } from 'libraries/swap-sdk'
import { ConfirmationModalContent } from 'widgets/ConfirmationModalContent'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { computeTradePriceBreakdown, computeSlippageAdjustedAmounts } from 'utils/exchange'
import { Field } from 'state/swap/actions'
import SwapModalFooter from './SwapModalFooter'
import SwapModalHeader from './SwapModalHeader'

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(
  tradeA: Trade<Currency, Currency, TradeType>,
  tradeB: Trade<Currency, Currency, TradeType>,
): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !tradeA.inputAmount.currency.equals(tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !tradeA.outputAmount.currency.equals(tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  )
}

const TransactionConfirmSwapContent = ({
  trade,
  originalTrade,
  allowedSlippage,
  onConfirm,
  currencyBalances,
}) => {
  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade],
  )

  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage],
  )

  const isEnoughInputBalance = useMemo(() => {
    if (trade?.tradeType !== TradeType.EXACT_OUTPUT) return null

    const isInputBalanceExist = !!(currencyBalances && currencyBalances[Field.INPUT])
    const isInputBalanceBNB = isInputBalanceExist && currencyBalances[Field.INPUT].currency.isNative
    const inputCurrencyAmount = isInputBalanceExist
      ? isInputBalanceBNB
        ? maxAmountSpend(currencyBalances[Field.INPUT])
        : currencyBalances[Field.INPUT]
      : null
    return inputCurrencyAmount && slippageAdjustedAmounts && slippageAdjustedAmounts[Field.INPUT]
      ? inputCurrencyAmount.greaterThan(slippageAdjustedAmounts[Field.INPUT]) ||
          inputCurrencyAmount.equalTo(slippageAdjustedAmounts[Field.INPUT])
      : false
  }, [currencyBalances, trade, slippageAdjustedAmounts])

  const { priceImpactWithoutFee } = useMemo(() => {
    return computeTradePriceBreakdown(trade)
  }, [trade])

  const modalHeader = useCallback(() => {
    return trade ? (
      <SwapModalHeader
        inputAmount={trade.inputAmount}
        outputAmount={trade.outputAmount}
        tradeType={trade.tradeType}
        priceImpactWithoutFee={priceImpactWithoutFee}
        allowedSlippage={allowedSlippage}
        isEnoughInputBalance={isEnoughInputBalance}
        showAcceptChanges={showAcceptChanges}
      />
    ) : null
  }, [
    allowedSlippage,
    showAcceptChanges,
    trade,
    isEnoughInputBalance,
    priceImpactWithoutFee,
  ])

  const modalBottom = useCallback(() => {
    const SwapModalF = SwapModalFooter

    return trade ? (
      <SwapModalF
        onConfirm={onConfirm}
        trade={trade}
        disabledConfirm={showAcceptChanges}
        slippageAdjustedAmounts={slippageAdjustedAmounts}
        isEnoughInputBalance={isEnoughInputBalance}
      />
    ) : null
  }, [onConfirm, showAcceptChanges, trade, isEnoughInputBalance, slippageAdjustedAmounts])

  return <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
}

export default memo(TransactionConfirmSwapContent)
