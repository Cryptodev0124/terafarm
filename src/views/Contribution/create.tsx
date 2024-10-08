import { useCallback, useMemo, useState } from 'react'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { CurrencyAmount, Token, Percent } from 'libraries/swap-sdk'
import {
  Button,
  Flex,
  Text,
  Box,
  OpenNewIcon,
  NextLinkFromReactRouter,
} from 'components'
import { useModal } from 'widgets/Modal'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { CommitButton } from 'components/CommitButton'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import { ROUTER_ADDRESS } from 'config/constants/exchange'
import { AutoColumn } from 'components/Layout/Column'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { AppHeader, AppBody } from 'components/App'
import { RowBetween } from 'components/Layout/Row'

import { PairState } from 'hooks/usePairs'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { useTransactionDeadline } from 'hooks/useTransactionDeadline'
import { useContributionProgram } from 'hooks/useContracts'
import { Field } from 'state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from 'state/mint/hooks'
import {
  useUserSlippageTolerance,
} from 'state/user/hooks'
import { calculateGasMargin } from 'utils'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import Dots from 'components/Loader/Dots'
import { CommonBasesType } from 'components/SearchModal/types'
import Page from 'components/Layout/Page'
import { ArbitrumBridgeBox } from 'views/Swap/components/styleds'
import PoolPriceBar from 'views/Pool/PoolPriceBar'
import ConfirmAddLiquidityModal from 'views/Contribution/components/ConfirmAddLiquidityModal'
import { useCurrencySelectRoute } from 'views/Contribution/useCurrencySelectRoute'
import { useContribution } from './hooks/useLocks'

export default function AddLiquidity({ currencyA, currencyB }) {
  const { account, chainId } = useAccountActiveChain()
  const { isWrongNetwork } = useActiveWeb3React()

  const { open } = useWeb3Modal()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts: mintParsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
    addError,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  // modal and loading
  const [{ attemptingTxn, liquidityErrorMessage, txHash }, setLiquidityState] = useState<{
    attemptingTxn: boolean
    liquidityErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    attemptingTxn: false,
    liquidityErrorMessage: undefined,
    txHash: undefined,
  })

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Token> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {},
  )

  const { handleCurrencyASelect, handleCurrencyBSelect } = useCurrencySelectRoute()

  const parsedAmounts = mintParsedAmounts

  // get formatted amounts
  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
      [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    }),
    [
      dependentField,
      independentField,
      noLiquidity,
      otherTypedValue,
      parsedAmounts,
      typedValue,
    ],
  )

  const {
    approvalState: approvalA,
    approveCallback: approveACallback,
  } = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS[chainId])
  const {
    approvalState: approvalB,
    approveCallback: approveBCallback,
  } = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS[chainId])

  const routerContract = useContributionProgram()

  async function onAdd() {
    if (!chainId || !account || !routerContract) return

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = mintParsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    // const amountsMin = {
    //   [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
    //   [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    // }

    let estimate: any
    let method: any
    let args: Array<string | string[] | number | bigint>
    let value: bigint | null
    if (currencyA?.isNative || currencyB?.isNative) {
      const tokenBIsNative = currencyB?.isNative
      estimate = routerContract.estimateGas.createNewLockWithETH
      method = routerContract.write.createNewLockWithETH
      args = [
        (tokenBIsNative ? currencyA : currencyB)?.wrapped?.address ?? '', // token
        (tokenBIsNative ? parsedAmountA : parsedAmountB).quotient.toString(), // token desired
        // amountsMin[tokenBIsNative ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        // amountsMin[tokenBIsNative ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        // account,
        // Number(deadline[0]).toString(),
      ]
      value = (tokenBIsNative ? parsedAmountB : parsedAmountA).quotient
    } else {
      estimate = routerContract.estimateGas.createNewLock
      method = routerContract.write.createNewLock
      args = [
        currencyA?.wrapped?.address ?? '',
        currencyB?.wrapped?.address ?? '',
        parsedAmountA.quotient.toString(),
        parsedAmountB.quotient.toString(),
        // amountsMin[Field.CURRENCY_A].toString(),
        // amountsMin[Field.CURRENCY_B].toString(),
        // account,
        // Number(deadline[0]).toString(),
      ]
      value = null
    }

    setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
    await estimate(args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
          // gasPrice,
        }).then((response: `0x${string}`) => {
          setLiquidityState({ attemptingTxn: false, liquidityErrorMessage: undefined, txHash: response })
        }),
      )
      .catch((err) => {
        if (err && err.code !== 4001) {
          console.error(`Add Liquidity failed`, err, args, value)
        }
        setLiquidityState({
          attemptingTxn: false,
          liquidityErrorMessage:
            err && err.code !== 4001
              ? `Add liquidity failed: ${transactionErrorToUserReadableMessage(err)}`
              : undefined,
          txHash: undefined,
        })
      })
  }

  const pendingText = `Supplying ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? ''} ${currencies[Field.CURRENCY_A]?.symbol ?? ''} and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? ''} ${currencies[Field.CURRENCY_B]?.symbol ?? ''}`

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
  }, [onFieldAInput, txHash])

  const [onPresentAddLiquidityModal] = useModal(
    <ConfirmAddLiquidityModal
      title='You will contribute'
      customOnDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      pendingText={pendingText}
      currencyToAdd={pair?.liquidityToken}
      allowedSlippage={allowedSlippage}
      onAdd={onAdd}
      parsedAmounts={parsedAmounts}
      currencies={currencies}
      liquidityErrorMessage={liquidityErrorMessage}
      price={price}
      noLiquidity={noLiquidity}
      poolTokenPercentage={poolTokenPercentage}
      liquidityMinted={liquidityMinted}
    />,
    true,
    true,
    'addLiquidityModal',
  )

  const contribution = useContribution(parsedAmounts[Field.CURRENCY_A], parsedAmounts[Field.CURRENCY_B])
  const errorContribution = contribution.lt(1) ? "Insufficient Contribution" : undefined

  const isValid = !error && !addError && !errorContribution
  const errorText = error ?? addError ?? errorContribution

  const buttonDisabled =
    !isValid ||
    (approvalA !== ApprovalState.APPROVED) ||
    (approvalB !== ApprovalState.APPROVED)

  const showFieldAApproval =
    (approvalA === ApprovalState.NOT_APPROVED || approvalA === ApprovalState.PENDING)
  const showFieldBApproval =
    (approvalB === ApprovalState.NOT_APPROVED || approvalB === ApprovalState.PENDING)

  const shouldShowApprovalGroup = (showFieldAApproval || showFieldBApproval) && isValid

  return (
    <Page>
      <Flex justifyContent="center" flexDirection="column" alignItems="center" mt="40px">
        <AppBody>
          <AppHeader
            title='Contribute'
            backTo='/cp'
          />
          <AutoColumn style={{marginTop: "10px"}}>
            <CurrencyInputPanel
              showBUSD
              onInputBlur={undefined}
              error={false}
              disabled={false}
              beforeButton={<></>}
              onCurrencySelect={handleCurrencyASelect}
              value={formattedAmounts[Field.CURRENCY_A]}
              onUserInput={onFieldAInput}
              onPercentInput={(percent) => {
                if (maxAmounts[Field.CURRENCY_A]) {
                  onFieldAInput(maxAmounts[Field.CURRENCY_A]?.multiply(new Percent(percent, 100)).toExact() ?? '')
                }
              }}
              onMax={() => {
                onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
              }}
              showQuickInputButton
              showMaxButton
              maxAmount={maxAmounts[Field.CURRENCY_A]}
              currency={currencies[Field.CURRENCY_A]}
              id="add-liquidity-input-tokena"
              showCommonBases
              commonBasesType={CommonBasesType.LIQUIDITY}
            />
            <Flex my="-12px" justifyContent="center" zIndex="2">
              <img src="/images/plus.png" width="36px" alt="plus" />
            </Flex>
            <CurrencyInputPanel
              showBUSD
              onInputBlur={undefined}
              error={false}
              beforeButton={<></>}
              onCurrencySelect={handleCurrencyBSelect}
              value={formattedAmounts[Field.CURRENCY_B]}
              onUserInput={onFieldBInput}
              onPercentInput={(percent) => {
                if (maxAmounts[Field.CURRENCY_B]) {
                  onFieldBInput(maxAmounts[Field.CURRENCY_B]?.multiply(new Percent(percent, 100)).toExact() ?? '')
                }
              }}
              onMax={() => {
                onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
              }}
              showQuickInputButton
              showMaxButton
              maxAmount={maxAmounts[Field.CURRENCY_B]}
              currency={currencies[Field.CURRENCY_B]}
              id="add-liquidity-input-tokenb"
              showCommonBases
              commonBasesType={CommonBasesType.LIQUIDITY}
            />
            <Flex mt="12px" mx="4px" justifyContent="space-between">
              <Text>Minimum contribution</Text>
              <Text>$100,000</Text>
            </Flex>
            <Flex mx="4px" justifyContent="space-between">
              <Text color='primary'>You will contribute</Text>
              <Text color='primary'>${contribution.toFixed(0)}</Text>
            </Flex>

            {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
              <Box my='20px'>
                <PoolPriceBar
                  currencies={currencies}
                  poolTokenPercentage={poolTokenPercentage}
                  noLiquidity={noLiquidity}
                  price={price}
                />
              </Box>
            )}
            {!account ? (
              <Button
                width="100%"
                variant='primary'
                height="48px"
                onClick={() => open()}
              >
                <Text fontSize="16px">
                  Connect Wallet
                </Text>
              </Button>
            ) : isWrongNetwork ? (
              <CommitButton height="58px" />
            ) : (
              <AutoColumn gap="md">
                {shouldShowApprovalGroup && (
                  <RowBetween style={{ gap: '8px' }}>
                    {showFieldAApproval && (
                      <Button
                        onClick={approveACallback}
                        disabled={approvalA === ApprovalState.PENDING}
                        width="100%"
                        height="58px"
                        variant='secondary'
                      >
                        {approvalA === ApprovalState.PENDING ? (
                          <Dots>Enabling {currencies[Field.CURRENCY_A]?.symbol ?? 'Unknown'}</Dots>
                        ) : (
                          `Enable ${currencies[Field.CURRENCY_A]?.symbol ?? 'Unknown'}`
                        )}
                      </Button>
                    )}
                    {showFieldBApproval && (
                      <Button
                        onClick={approveBCallback}
                        disabled={approvalB === ApprovalState.PENDING}
                        width="100%"
                        height="58px"
                        variant='secondary'
                      >
                        {approvalB === ApprovalState.PENDING ? (
                          <Dots>Enabling {currencies[Field.CURRENCY_B]?.symbol ?? 'Unknown'}</Dots>
                        ) : (
                          `Enable ${currencies[Field.CURRENCY_B]?.symbol ?? 'Unknown'}`
                        )}
                      </Button>
                    )}
                  </RowBetween>
                )}
                <CommitButton
                  variant={!isValid ? 'danger' : 'primary'}
                  onClick={() => {
                    setLiquidityState({
                      attemptingTxn: false,
                      liquidityErrorMessage: undefined,
                      txHash: undefined,
                    })
                    onPresentAddLiquidityModal()
                  }}
                  disabled={buttonDisabled}
                  height="58px"
                >
                  {errorText || 'Contribute'}
                </CommitButton>
              </AutoColumn>
            )}
          </AutoColumn>
        </AppBody>
      </Flex>
      <Flex justifyContent="center" mt="10px">
        <ArbitrumBridgeBox
          as={NextLinkFromReactRouter}
          to='https://bridge.arbitrum.io/'
          target='_blink'
          p="12px"
        >
          <Flex alignItems="center">
            <img 
              src='/images/arbitrumBridge.png' 
              width="40px" 
              height="40px" 
              alt="bridgeIcon" 
              style={{borderRadius: "12px"}}
            />
            <Box ml="10px">
              <Text fontSize="16px" lineHeight="1.2" color="primaryDark">Arbitrum token bridge</Text>
              <Text fontSize="14px" lineHeight="1.2" color="primaryDark">Deposit tokens to the Arbitrum network.</Text>
            </Box>
          </Flex>
          <Flex mr="10px">
            <OpenNewIcon color="primaryDark" />
          </Flex>
        </ArbitrumBridgeBox>
      </Flex>
    </Page>
  )
}
