import { useState } from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import { 
  Button,
  AutoRenewIcon,
  Box,
  Text,
  Flex,
  Slider,
} from "components";
import { Modal, ModalActions } from "widgets/Modal";
import { useToast } from "contexts";
import useCatchTxError from "hooks/useCatchTxError";
import { ToastDescriptionWithTx } from "components/Toast";
import useLock from "../hooks/useAction";

const BorderCard = styled.div`
  border: solid 1px ${({ theme }) => theme.colors.cardBorder};
  border-radius: 8px;
  padding: 16px;
`

interface DepositModalProps {
  lockInfo: any
  onDismiss?: () => void
}

const UnlockModal: React.FC<React.PropsWithChildren<DepositModalProps>> = ({
  lockInfo,
  onDismiss,
}) => {
  const { fetchWithCatchTxError } = useCatchTxError()
  const { toastSuccess } = useToast()
  const [pendingTx, setPendingTx] = useState(false)

  const { onUnlock, onUnlockETH } = useLock()

  const [percentage, setPercentage] = useState(0)

  const unlockContribute = new BigNumber(lockInfo.contribute).times(percentage).div(10 ** 20)
  const unlockAmount = new BigNumber(lockInfo.locked).minus(lockInfo.vested).times(percentage).div(10 ** 2)
  const withdrawable = new BigNumber(lockInfo.withdrawable)
  const penalty = unlockAmount.gt(withdrawable) ? new BigNumber(unlockAmount).minus(withdrawable).times(lockInfo.penalty).div(10 ** 3) : new BigNumber(0)
  const penaltyA = unlockContribute.div(unlockAmount).times(penalty)

  const onConfirm = async () => {
    const receipt = await fetchWithCatchTxError(() => onUnlock(lockInfo.id, unlockAmount.toFixed(0)))

    if (receipt?.status) {
      toastSuccess(
        'Unlocked!',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          You have unlocked contribution.
        </ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <Modal title="Unlock" onDismiss={onDismiss}>
      <Box width={["100%", "100%", "100%", "420px"]}>
        <BorderCard style={{ padding: '8px', marginBottom: '12px' }}>
          <Flex alignItems="center" justifyContent="space-between">
            <Slider
              name="lp-amount"
              min={0}
              max={100}
              value={percentage}
              onValueChanged={(e) => setPercentage(e)}
              width="100%"
            />
            <Box width="60px">
              <Text fontSize="20px" style={{ lineHeight: 1 }} mb="4px" textAlign="right">
                {percentage.toFixed(0)}%
              </Text>
            </Box>
          </Flex>
          <Flex flexWrap="wrap" justifyContent="right">
            <Button 
              variant="text" 
              scale="sm" 
              onClick={() => setPercentage(25)}
              height="24px"
            >
              25%
            </Button>
            <Button 
              variant="text" 
              scale="sm" 
              onClick={() => setPercentage(50)}
              height="24px"
            >
              50%
            </Button>
            <Button 
              variant="text" 
              scale="sm" 
              onClick={() => setPercentage(75)}
              height="24px"
            >
              75%
            </Button>
            <Button 
              variant="text" 
              scale="sm" 
              onClick={() => setPercentage(100)}
              height="24px"
            >
              Max
            </Button>
          </Flex>
        </BorderCard>
        <Flex justifyContent="space-between">
          <Text>Your Contribution</Text>
          <Text>${new BigNumber(lockInfo.contribute).div(10 ** 18).toFixed(0)}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>You will unlock</Text>
          <Text>${unlockContribute.toFixed(0)}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Penalty</Text>
          <Text>{penaltyA.toFixed(0)}</Text>
        </Flex>
        <ModalActions>
          <Button variant="secondary" onClick={onDismiss} width="100%" height="36px" disabled={pendingTx}>
            Cancel
          </Button>
          {pendingTx ? (
            <Button width="100%" isLoading={pendingTx} height="36px" variant="primary" endIcon={<AutoRenewIcon spin color="currentColor" />}>
              Confirming
            </Button>
          ) : (
            <Button
              width="100%"
              height="36px"
              variant="primary"
              onClick={async () => {
                setPendingTx(true);
                await onConfirm();
                onDismiss?.();
                setPendingTx(false);
              }}
            >
              Confirm
            </Button>
          )}
        </ModalActions>
      </Box>
    </Modal>
  );
};

export default UnlockModal;
