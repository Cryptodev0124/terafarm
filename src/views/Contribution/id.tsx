import BigNumber from 'bignumber.js'
import { Text, Box, Card, LinkExternal, Flex, Button } from 'components'
import { useModal } from 'widgets/Modal'
import getTimePeriods from 'utils/getTimePeriods'
import styled from 'styled-components'
import { useAccount } from 'wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getBlockExploreLink } from 'utils'
import Page from 'components/Layout/Page'
import { AppHeader } from 'components/App'
import FormContainer from './components/FormContainer'
import UnlockModal from './components/UnlockModal'
import useCountdown from '../../hooks/useCountdown'
import { useLock } from './hooks/useLocks'

export const StyledAppBody = styled(Card)`
  margin: auto;
  margin-top: 10px;
  padding: 12px 8px 16px 8px;
  border-radius: 8px;
  max-width: 1080px;
  width: 100%;
  z-index: 1;
`

const accountEllipsis = (address: string) => {
  return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : null
}

const StyledBox = styled(Box)`
  background: ${({theme}) => theme.colors.backgroundAlt2};
  border: 1px solid ${({theme}) => theme.colors.primary};
  border-radius: 4px;
  padding: 4px;
`

const padTime = (num: number, pos: number) => num.toString().padStart(pos, '0')

const formatRoundTime = (secondsBetweenBlocks: number) => {
  const { totalDays, hours, minutes, seconds } = getTimePeriods(secondsBetweenBlocks)
  const minutesSeconds = `${padTime(totalDays, 3)}:${padTime(hours, 2)}:${padTime(minutes, 2)}:${padTime(seconds, 2)}`

  return minutesSeconds
}

const LockById = ({id} : {id: string}) => {
  const {chainId} = useActiveChainId()
  const { address: account } = useAccount()
  const lockInfo = useLock(BigInt(id ?? 0))

  const { secondsRemaining } = useCountdown(Number(lockInfo.lockDate) + 720*24*3600)
  
  const countdown = formatRoundTime(secondsRemaining).split(":")

  const [onPresentUnlockModal] = useModal(
    <UnlockModal
      lockInfo={lockInfo}
    />,
    true,
    true,
    `lock-unlock-modal-${id}`,
  )

  return (
    <Page>
      <StyledAppBody mt="16px">
        <AppHeader
          title=''
          backTo='/cp'
          noConfig
        />
        <Box pb="20px">
          <Flex width="100%" justifyContent="center" mb="12px">
            <Text color="primary" bold fontSize="18px">Unlock in</Text>
          </Flex>
          <Flex width="100%" justifyContent="center">
            <StyledBox><Text fontSize="18px">{countdown[0]}</Text></StyledBox>
            <StyledBox ml="5px"><Text fontSize="18px">{countdown[1]}</Text></StyledBox>
            <StyledBox ml="5px"><Text fontSize="18px">{countdown[2]}</Text></StyledBox>
            <StyledBox ml="5px"><Text fontSize="18px">{countdown[3]}</Text></StyledBox>
          </Flex>
        </Box>
        <Box p="12px" position="inherit">
          <FormContainer>
            <Box mt="12px">
              <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                <Text color="primary">Pair Address</Text>
                <LinkExternal href={getBlockExploreLink(lockInfo.pair, 'address', chainId)}>
                  <Text color="primary">{accountEllipsis(lockInfo.pair)}</Text>
                </LinkExternal>
              </Flex>
              <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                <Text color="primary">Pair Name</Text>
                <Text>{lockInfo.symbol0} / {lockInfo.symbol1}</Text>
              </Flex>
              <Box mt="12px">
                <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                  <Text color="primary">Amount Locked</Text>
                  <Text>{new BigNumber(lockInfo.locked).minus(lockInfo.vested).div(10 ** 18).toJSON()}</Text>
                </Flex>
                <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                  <Text color="primary">Contribution</Text>
                  <Text>${new BigNumber(lockInfo.contribute).div(10 ** 18).toFixed(0)}</Text>
                </Flex>
                <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                  <Text color="primary">Owner</Text>
                  <LinkExternal href={getBlockExploreLink(lockInfo.owner, 'address', chainId)}>
                    <Text color="primary">{accountEllipsis(lockInfo.owner)}</Text>
                  </LinkExternal>
                </Flex>
                <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                  <Text color="primary">Lock Date</Text>
                  <Text>{new Date(Number(lockInfo.lockDate) * 1000).toLocaleString()}</Text>
                </Flex>
                <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                  <Text color="primary">Unlocked Amount</Text>
                  <Text>{new BigNumber(lockInfo.vested).div(10 ** 18).toJSON()}</Text>
                </Flex>
              </Box>
            </Box>
          </FormContainer>
        </Box>
        <Box px="12px" position="inherit">
          {lockInfo.owner === account && <FormContainer>
            <Flex width="100%" alignItems="center" flexDirection={["column", "column", "row"]}>
              <Box mr={["0", "0", "15px"]} mb={["10px", "10px", "0"]} width="100%">
                <Button
                  width="100%"
                  height="48px"
                  variant='primary'
                  disabled={Number(lockInfo.lockDate) * 1000 + 720*24*3600*1000 >= Date.now()}
                  onClick={() => {}}
                ><Text color="text" fontSize="14px">Claim</Text></Button>
              </Box>
              <Box width="100%">
                <Button
                  width="100%"
                  height="48px"
                  variant='primary'
                  disabled={Number(lockInfo.lockDate) * 1000 >= Date.now() }
                  onClick={onPresentUnlockModal}
                ><Text color="text" fontSize="14px">Unlock</Text></Button>
              </Box>
            </Flex>
          </FormContainer>}
        </Box>
      </StyledAppBody>
    </Page>
  )
}

export default LockById
