import { Button, Card, Flex, NextLinkFromReactRouter, Text } from 'components'
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
  const lpStaked = farm?.lpTotalInQuoteToken?.toNumber() ?? 0
  const lpPrice = farm?.lpTokenPrice?.toNumber() ?? 0
  const percentage = (lpStaked * 1e18) / lpTotalSupply

  console.log("farm", farm)

  return (
    <div className="mainPage1">
      <StyledAppBody>
        <Wrapper>
          <AppHeader title="Return Positions" backTo="/earn" noConfig />
        </Wrapper>
      </StyledAppBody>
      <Wrapper style={{ display: 'flex', flexDirection: 'column' }}>
        {/* <Wrapper>
          <Flex>
            <img src="/images/refui.png" alt="" width="90%" style={{ margin: 'auto' }} />
          </Flex>
        </Wrapper> */}
        <Wrapper className="actionPanel">
          <Wrapper className="pairInfo">
            <Flex style={{ width: '100%' }}>
              <Flex className="pairImg">
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
              <Flex style={{ display: 'flex', flexDirection: 'column' }}>
                <Flex color="white" paddingBottom="5px">
                  {farm?.lpSymbol}
                </Flex>
                <Flex color="#fffff2">{lpStaked} LP</Flex>
              </Flex>
            </Flex>
            <Flex>
              <Text>${lpPrice * lpStaked}</Text>
            </Flex>
          </Wrapper>
          <Wrapper className="progress1">
            <Flex style={{ width: '100%' }}>
              <ProgressBar className="progressBar1" now={percentage} label={`${percentage}%`} />
            </Flex>
          </Wrapper>
          <Wrapper className="actions">
            <Flex className="stakeAction">
              <ActionContainer>
                <StakedContainer {...farm}>{(props) => <StakedAction {...props} />}</StakedContainer>
              </ActionContainer>
            </Flex>
            <Flex className="stakeAction">
              <ActionContainer>
                <HarvestActionContainer {...farm}>{(props) => <HarvestAction {...props} userDataReady={Boolean(farm?.userData)} />}</HarvestActionContainer>
              </ActionContainer>
            </Flex>
          </Wrapper>
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
        </Wrapper>
      </Wrapper>
    </div>
  )
}

export default Farm
