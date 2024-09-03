import { Dispatch, SetStateAction } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Flex } from 'components'
import { useToast } from 'contexts'
import { launchpadFactoryABI } from 'config/abi/launchpadFactory'
import { getLaunchpadFactoryAddress } from 'utils/addressHelpers'
import { publicClient } from 'utils/viem'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { AutoRow } from 'components/Layout/Row'
import CircleLoader from 'components/Loader/CircleLoader'
import { ToastDescriptionWithTx } from 'components/Toast'
import { parseEther, zeroAddress } from 'viem'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ApprovalState } from 'hooks/useApproveCallback'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCurrentBlock } from 'state/block/hooks'
import useCreateLaunchpad from '../../hooks/useCreatePad'
import { Presale, FinishData, LaunchpadFormView, Socials, TokenData } from '../../types'
import { fee } from '../../constants'

const StyledFlex = styled(Flex)`
  width: 100%;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

interface SendCommitButtonPropsType {
  tokenData: TokenData
  deFiData: Presale
  socials: Socials
  account: string
  approval: ApprovalState
  approveCallback: () => Promise<any>
  approvalSubmitted: boolean
  setApprovalSubmitted: (b: boolean) => void
  swapInputError: string | undefined
  setPresale: Dispatch<SetStateAction<FinishData>>
  setModalView: Dispatch<SetStateAction<LaunchpadFormView>>
}

export default function SendCommitButton({
  tokenData,
  deFiData,
  socials,
  account,
  approval,
  approveCallback,
  approvalSubmitted,
  setApprovalSubmitted,
  swapInputError,
  setPresale,
  setModalView
}: SendCommitButtonPropsType) {
  const {chainId} = useActiveChainId()

  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const currentBlock = useCurrentBlock()

  const { onCreateLaunchpad } = useCreateLaunchpad()

  const handlePrev = async () => {
    setModalView(LaunchpadFormView.Socials)
  }

  const handleCommit = async () => {
    const receipt = await fetchWithCatchTxError(() => onCreateLaunchpad(
      [
        new BigNumber(Date.parse(`${deFiData.startTime.replace("T", " ")} GMT`)).div(1000).toFixed(),
        new BigNumber(Date.parse(`${deFiData.endTime.replace("T", " ")} GMT`)).div(1000).toFixed(),
        new BigNumber(deFiData.softCap).times(10**tokenData.currency.decimals).toFixed(),
        new BigNumber(deFiData.hardCap).times(10**tokenData.currency.decimals).toFixed(),
        new BigNumber(deFiData.minimumBuy).times(10**tokenData.currency.decimals).toFixed(),
        new BigNumber(deFiData.maximumBuy).times(10**tokenData.currency.decimals).toFixed(),
        new BigNumber(deFiData.presaleRate).times(10**tokenData.tokenDecimals).toFixed(),
        new BigNumber(Number(deFiData.listingRate)).times(10**tokenData.tokenDecimals).toFixed(),
        new BigNumber(Number(deFiData.liquidity)).times(10).toFixed(),
        new BigNumber(Number(deFiData.lockTime)).times(24*3600).toFixed(),
        new BigNumber(tokenData.mainFee).toFixed(),
        new BigNumber(tokenData.tokenFee).toFixed()
      ], 
      [
        tokenData.tokenAddress,
        tokenData.currency.isNative ? zeroAddress : tokenData.currency.wrapped.address,
        deFiData.router ?? zeroAddress,
        deFiData.refundType ? zeroAddress : account
      ],
      [
        socials.description,
        socials.logoUrl,
        socials.website,
        socials.facebook,
        socials.twitter,
        socials.github,
        socials.telegram,
        socials.instagram,
        socials.discord,
        socials.reddit,
        socials.youtube,
        socials.whitelist
      ],
      [
        deFiData.whitelist,
        tokenData.mainFee === "50",
        tokenData.listingOption
      ],
      parseEther(fee[chainId])
    ))

    setApprovalSubmitted(false)

    if (receipt?.status) {
      toastSuccess(
        `Launchpad Created!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          You've just created launchpad for {tokenData.tokenSymbol}
        </ToastDescriptionWithTx>,
      )

      const logs = await publicClient({chainId}).getContractEvents({
        address: getLaunchpadFactoryAddress(chainId),
        abi: launchpadFactoryABI,
        eventName: 'NewLaunchpadCreated',
        fromBlock: BigInt(currentBlock)
      })

      const id = logs.filter((log) => log.transactionHash === receipt.transactionHash)?.[0]?.args?.launchpad?.toString() ?? ""

      if (id !== "") setPresale({address: id})
      setModalView(LaunchpadFormView.Finish)
    }
  }

  if (!account) {
    return <ConnectWalletButton />
  }

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED))

  const isValid = !swapInputError

  const approved = approval === ApprovalState.APPROVED

  if (showApproveFlow) {
    return (
      <>
        <StyledFlex>
          {showApproveFlow && <CommitButton
            variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
            onClick={approveCallback}
            disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
            width="100%"
            marginX="10px"
            height="48px"
          >
            {approval === ApprovalState.PENDING ? (
              <AutoRow gap="6px" justify="center">
                Enabling <CircleLoader stroke="white" />
              </AutoRow>
            ) : approvalSubmitted && approved ? (
              `${tokenData.tokenSymbol} Enabled`
            ) : (
              `Enable ${tokenData.tokenSymbol ?? ''}`
            )}
          </CommitButton>}
        </StyledFlex>
        <StyledFlex>
          <CommitButton
            variant='secondary'
            onClick={handlePrev}
            width="100%"
            id="swap-button"
            marginX="10px"
            height="48px"
          >
            Prev
          </CommitButton>
          <CommitButton
            variant='primary'
            onClick={handleCommit}
            width="100%"
            id="swap-button"
            disabled={!isValid || !approved || pendingTx}
            marginX="10px"
            height="48px"
          >
            {
              pendingTx ? 
                <AutoRow gap="6px" justify="center">
                  Confirming <CircleLoader stroke="white" />
                </AutoRow> 
              : 
                'Confirm'
            }
          </CommitButton>
        </StyledFlex>
      </>
    )
  }

  return (
    <StyledFlex>
      <CommitButton
        variant='secondary'
        onClick={handlePrev}
        width="100%"
        id="swap-button"
        margin="10px"
        height="48px"
      >
        Prev
      </CommitButton>
      <CommitButton
        variant='primary'
        onClick={handleCommit}
        id="swap-button"
        width="100%"
        margin="10px"
        disabled={!isValid || !approved || pendingTx}
        height="48px"
      >
        {swapInputError ||
          (pendingTx ? 
            <AutoRow gap="6px" justify="center">
              Confirming <CircleLoader stroke="white" />
            </AutoRow>
          : 
          'Confirm'
          )
        }
      </CommitButton>
    </StyledFlex>
  )
}
