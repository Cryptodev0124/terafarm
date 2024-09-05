import { Box, Button, Card, Flex, NextLinkFromReactRouter, Text } from 'components'
import { AppHeader } from 'components/App'
import Page from 'components/Layout/Page'
import { useFarms, usePollFarmsWithUserData } from 'state/farms/hooks'
import { TokenImage, TokenPairImage } from 'components/TokenImage'
import ProgressBar from 'react-bootstrap/ProgressBar'
import 'bootstrap/dist/css/bootstrap.min.css'
import styled from 'styled-components'
import { style } from '@vanilla-extract/css'
import { width } from 'styled-system'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { bigint, number } from 'zod'
import { FarmWithStakedValue } from 'libraries/farms'
import { formatLpBalance } from 'utils/formatBalance'
import { FarmTableLiquidityProps } from './types'
import { AprProps } from './components/Apr'
import { HarvestAction, HarvestActionContainer } from './components/HarvestAction'
import StakedAction, { StakedContainer } from './components/StakedAction'

export const StyledAppBody = styled(Card)`
  margin: auto;
  border-radius: 8px;
  max-width: 1080px;
  width: 100%;
  padding: 16px 20px 28px 20px;
  z-index: 1;
`

const StyledBox = styled(Box)`
	display: flex; 
	flex-direction: column; 
	background: #101418; 
	margin-top: 30px; 
	border-radius: 16px; 
	padding: 20px;
`

export interface ActionPanelProps {
  apr: AprProps
  liquidity?: FarmTableLiquidityProps
  details: FarmWithStakedValue
  userDataReady: boolean
  expanded: boolean
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 0px;
  }
`

const ActionContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
    flex-wrap: wrap;
  }
`

const Farm = ({ pid }: { pid: number }) => {
  const { data: farmsLP, userDataLoaded, poolLength, regularCakePerBlock } = useFarms()
  usePollFarmsWithUserData()

  const farm = farmsLP.filter((f) => f.pid === pid)[0]

  const lpTotalSupply = farm?.lpTotalSupply?.toNumber() ?? 0
  const lpStaked = (farm?.userData?.stakedBalance ?? BIG_ZERO).div(10 **18).toNumber() ?? 0
  const lpPrice = farm?.lpTokenPrice?.toNumber() ?? 0
  const percentage = (lpStaked * 1e18) / lpTotalSupply * 100

  return (
      <StyledAppBody>
        <AppHeader title="Return Positions" backTo="/earn" noConfig />
        <StyledBox>
          <Flex justifyContent="space-between" width="100%">
						<Flex alignItems="center">
							<Flex width="40px" mr="12px">
								{farm?.isTokenOnly ? (
									<TokenImage width={36} height={36} token={farm?.token} mr="2px" />
								) : (
									<TokenPairImage
										width={40}
										height={40}
										variant="inverted"
										primaryToken={farm?.token}
										secondaryToken={farm?.quoteToken}
									/>
								)}
							</Flex>
							<Box>
								<Text>{farm?.lpSymbol}</Text>
								<Text>{lpStaked >= 1 ? lpStaked.toLocaleString() : lpStaked.toFixed(8)} staked</Text>
							</Box>
						</Flex>
            <Text>${(lpPrice * lpStaked).toLocaleString("en-US")}</Text>
          </Flex>
          <Flex justifyContent="cener" mt="20px" alignItems="center">
						<Box width="100%">
							<ProgressBar
								now={percentage} 
							/>
						</Box>
							<Text color="text" ml="12px">{percentage.toFixed(0)}%</Text>
          </Flex>
          <Flex width="100%" flexDirection={["column", null, "row"]} mt="20px">
						<Box ml={["0", null, "-12px"]} width="100%">
							<ActionContainer>
								<StakedContainer {...farm}>{(props) => <StakedAction {...props} />}</StakedContainer>
							</ActionContainer>
						</Box>
						<Box width="100%">
							<ActionContainer>
								<HarvestActionContainer {...farm}>{(props) => <HarvestAction {...props} userDataReady={Boolean(farm?.userData)} />}</HarvestActionContainer>
							</ActionContainer>
						</Box>
          </Flex>
          <Wrapper className="liquiditySec">
            <Button
              as={NextLinkFromReactRouter}
              to={farm?.isTokenOnly ? `https://app.uniswap.org/swap?outputCurrency=${farm.token.address}` : `https://app.uniswap.org/add/v2/${farm?.token.address}/${farm?.quoteToken.address}`}
							target='_blank'
              height="36px"
              variant="secondary"
              width="130px"
            >
              {farm?.isTokenOnly ? 'Get PYRO' : 'Add liqudity'}
            </Button>
          </Wrapper>
        </StyledBox>
			</StyledAppBody>
  )
}

export default Farm
