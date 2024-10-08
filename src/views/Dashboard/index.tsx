import { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import {
  Text,
  Flex,
  Loading,
  SearchInput,
  Select,
  OptionProps,
  ButtonMenu,
  ButtonMenuItem,
  Button,
  NextLinkFromReactRouter,
  OpenNewIcon,
  Box,
} from 'components'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { arbitrumTokens, GTOKEN } from 'libraries/tokens'
import { useFarms, usePollFarmsWithUserData } from 'state/farms/hooks'
import useBUSDPrice from 'hooks/useBUSDPrice'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { DeserializedFarm, FarmWithStakedValue, filterFarmsByQuery } from 'libraries/farms'
import { BIG_ZERO } from 'utils/bigNumber'
import { getFarmApr } from 'utils/apr'
import orderBy from 'lodash/orderBy'
import { useUserFarmStakedOnly } from 'state/user/hooks'
import { useRouter } from 'next/router'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { pyroAbi } from 'config/abi/pyroAbi'
import { readContract } from 'viem/actions'
import { useTokenBalance } from 'state/wallet/hooks'
import Table from './components/FarmTable'
import { FarmTabButtons } from './components/FarmTabButtons'
import { FarmsContext } from './context'

const PageHeader = styled(Flex)`
  align-items: center;
  background: transparent;
  padding: 12px;
  border-radius: 16px;
  margin-top: 70px;
`

const StyledBox = styled(Box)`
  width: 100%;
  margin: auto;  
  margin-top: 50px;
  margin-bottom: 20px;
  background: #101418; 
  padding: 20px;
  border-radius: 16px;
`

const StyledFlex = styled(Flex)`
	display: flex; 
	flex-direction: column; 
	background: #101418; 
	border-radius: 16px; 
	padding: 20px;
  max-width: 500px;
  min-height: 600px;
  margin-top: 80px;
`

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 0;
    margin-bottom: 0;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
    margin-top: 12px;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
    margin-top: 12px;
  }
`

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`

const NUMBER_OF_FARMS_VISIBLE = 12

const Dashboard = () => {
  const { pathname, query: urlQuery } = useRouter()
  const { chainId } = useActiveChainId()
  const { data: farmsLP, userDataLoaded, poolLength, regularCakePerBlock } = useFarms()

  const _cakePrice = useBUSDPrice(GTOKEN[chainId])

  const cakePrice = useMemo(() => (_cakePrice ? new BigNumber(_cakePrice.toSignificant(6)) : BIG_ZERO), [_cakePrice])

  const [_query, setQuery] = useState('')
  const normalizedUrlSearch = useMemo(() => (typeof urlQuery?.search === 'string' ? urlQuery.search : ''), [urlQuery])
  const query = normalizedUrlSearch && !_query ? normalizedUrlSearch : _query
  const { address: account, isConnected } = useAccount()
  const [userBalance, setUserBalance] = useState(0)
  const [totalSp, setTotalSp]  = useState(0)
  const [sortOption, setSortOption] = useState('hot')
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const chosenFarmsLength = useRef(0)
  
  const isArchived = pathname.includes('archived')
  const isInactive = pathname.includes('history')
  const isActive = !isInactive && !isArchived
  
  usePollFarmsWithUserData()
  
  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded)
  
  // const [stakedOnly, setStakedOnly] = useUserFarmStakedOnly(isActive)
  const stakedOnly = true
  const activeFarms = farmsLP.filter((farm) => farm.multiplier !== '0X' && (!poolLength || poolLength > farm.pid))
  
  const inactiveFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.multiplier === '0X')
  const archivedFarms = farmsLP
  
  const stakedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )
  
  const stakedInactiveFarms = inactiveFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )
  
  const stakedArchivedFarms = archivedFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )
  
  const farmsList = useCallback(
    (farmsToDisplay: DeserializedFarm[]): FarmWithStakedValue[] => {
      const farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
          return farm
        }
        
        const totalLiquidity = farm.isTokenOnly
        ? new BigNumber(farm.lpTotalInQuoteToken).times(farm.tokenPriceBusd ?? 0)
        : new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteTokenPriceBusd)
        const { cakeRewardsApr, lpRewardsApr } = isActive
        ? getFarmApr(
          chainId,
          new BigNumber(farm.poolWeight ?? 0),
          cakePrice,
          totalLiquidity,
          farm.lpAddress,
          regularCakePerBlock ?? 0,
        )
        : { cakeRewardsApr: 0, lpRewardsApr: 0 }
        
        return { ...farm, apr: cakeRewardsApr ?? undefined, lpRewardsApr, liquidity: totalLiquidity }
      })
      
      return filterFarmsByQuery(farmsToDisplayWithAPR, query)
    },
    [query, isActive, chainId, cakePrice, regularCakePerBlock],
  )
  
  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }
  
  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)
  
  const chosenFarms = useMemo(() => {
    let chosenFs: FarmWithStakedValue[] = []
    if (isActive) {
      chosenFs = stakedOnly ? farmsList(stakedOnlyFarms) : farmsList(activeFarms)
    }
    if (isInactive) {
      chosenFs = stakedOnly ? farmsList(stakedInactiveFarms) : farmsList(inactiveFarms)
    }
    if (isArchived) {
      chosenFs = stakedOnly ? farmsList(stakedArchivedFarms) : farmsList(archivedFarms)
    }
    
    return chosenFs
  }, [
    activeFarms,
    farmsList,
    inactiveFarms,
    archivedFarms,
    isActive,
    isInactive,
    isArchived,
    stakedArchivedFarms,
    stakedInactiveFarms,
    stakedOnly,
    stakedOnlyFarms,
  ])
  
  const PYRObalance = useTokenBalance(account, arbitrumTokens.gtoken)?.toFixed(0)

  const PYROsupply = farmsLP?.[0]?.lpTotalSupply?.toString()

  const VolumesStaked = chosenFarms.map((farm) => {
    return (farm?.userData?.stakedBalance ?? BIG_ZERO).times(farm?.lpTokenPrice ?? BIG_ZERO).toNumber()
  })

  const TVLStaked = (VolumesStaked.reduce((p, c) => p + c, 0)/1e18).toFixed(0)

  const chosenFarmsMemoized = useMemo(() => {
    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.apr) + Number(farm.lpRewardsApr), 'desc')
        case 'earned':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.userData ? Number(farm.userData.earnings) : 0),
            'desc',
          )
        case 'liquidity':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc')
        default:
          return farms
      }
    }

    return sortFarms(chosenFarms).slice(0, numberOfFarmsVisible)
  }, [chosenFarms, sortOption, numberOfFarmsVisible])

  chosenFarmsLength.current = chosenFarmsMemoized.length

  useEffect(() => {
    if (isIntersecting) {
      setNumberOfFarmsVisible((farmsCurrentlyVisible) => {
        if (farmsCurrentlyVisible <= chosenFarmsLength.current) {
          return farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE
        }
        return farmsCurrentlyVisible
      })
    }
  }, [isIntersecting])

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const providerValue = useMemo(() => ({ chosenFarms: chosenFarmsMemoized }), [chosenFarmsMemoized])

  return (
    <>
      {!isConnected ? (
        <>
        <StyledFlex justifyContent="space-between" margin="auto" width="90%">
          <Box>
            <Text fontSize="28px" textAlign="center" mb="12px">Welcome to Terafarm</Text>
            <Text textAlign="center">Connect your wallet to Sepolia testnet.</Text>
          </Box>
          <Flex justifyContent="center">
            <img src="/images/logo1-2.png" width="200px" alt="logo" />
          </Flex>
          <Box>
            <Text fontSize="24px" textAlign="center">Disclaimer</Text>
            <Flex maxWidth="500px" margin="auto">
              <Text textAlign="center">
                Terafarm is a decentralized application and platform. It is not registered as a broker, dealer,
                investment advisor, or investment company in the US or any other jurisdiction.
              </Text>
            </Flex>
            <Flex justifyContent="center" mt="20px">
              <w3m-button size="sm" />
            </Flex>
          </Box>

        </StyledFlex>
          {/* <Wrapper className="firstScreen">
            <Wrapper style={{ width: '90%', paddingTop: '50px', paddingBottom: '150px', flexDirection: 'column' }}>
              <Flex>
                <Text fontSize="32px">Welcome to Terafarm</Text>
              </Flex>
              <Flex>
                <Text>Connect your wallet to Sepolia testnet.</Text>
              </Flex>
            </Wrapper>
            <Wrapper className="disclaimerSection">
              <Wrapper className="textSection">
                <Flex width="100%" alignItems="start">
                  <Text fontSize="24px">Disclaimer</Text>
                </Flex>
                <Flex marginBottom="60px">
                  <Text>
                    Terafarm is a decentralized application and platform. It is not registered as a broker, dealer,
                    investment advisor, or investment company in the US or any other jurisdiction.
                  </Text>
                </Flex>
              </Wrapper>
              <Flex>
                <w3m-button size="sm" />
              </Flex>
            </Wrapper>
          </Wrapper> */}
        </>
      ) : (
        <FarmsContext.Provider value={providerValue}>
            <Wrapper className='pageBody'>
              <StyledBox>
                <Flex flexDirection={["column", null, "row"]} justifyContent="space-evenly">
                <Flex flexDirection={["row", null, "column"]} justifyContent="center" alignItems="center">
                  <Text fontSize="18px" color='text'>Your PYRO</Text>
                  <Text fontSize='18px' ml={['10px', null, "0"]} color='#efc863'> {Number(PYRObalance).toLocaleString("en-US")} / {Number(PYROsupply).toPrecision(2)}</Text>
                </Flex>
                <Flex flexDirection={["row", null, "column"]} justifyContent="center" alignItems="center">
                  <Text fontSize="18px" color='text'>TVL staked</Text>
                  <Text fontSize='18px' ml={['10px', null, "0"]} color='#efc863'>${Number(TVLStaked).toLocaleString("en-US")}</Text>
                </Flex>
                </Flex>
              </StyledBox>
              {/* <ControlContainer>
                <ViewControls>
                  <FarmTabButtons hasStakeInFinishedFarms={stakedInactiveFarms.length > 0} />
                  <Wrapper>
                    <Flex width="max-content" flexDirection="column">
                      <ButtonMenu
                        activeIndex={stakedOnly ? 1 : 0}
                        scale="sm"
                        variant="primary"
                        onItemClick={() => setStakedOnly(!stakedOnly)}
                      >
                        <ButtonMenuItem>All</ButtonMenuItem>
                        <ButtonMenuItem>My</ButtonMenuItem>
                      </ButtonMenu>
                    </Flex>
                  </Wrapper>
                </ViewControls>
                <FilterContainer>
                  <LabelWrapper>
                    <Select
                      options={[
                        {
                          label: 'Hot',
                          value: 'hot',
                        },
                        {
                          label: 'APR',
                          value: 'apr',
                        },
                        {
                          label: 'Earned',
                          value: 'earned',
                        },
                        {
                          label: 'Liquidity',
                          value: 'liquidity',
                        },
                      ]}
                      onOptionChange={handleSortOptionChange}
                    />
                  </LabelWrapper>
                  <LabelWrapper style={{ marginLeft: 16 }}>
                    <SearchInput
                      initialValue={normalizedUrlSearch}
                      onChange={handleChangeQuery}
                      placeholder="Search Farms"
                    />
                  </LabelWrapper>
                </FilterContainer>
              </ControlContainer> */}
              <Flex width="100%" justifyContent="left">
                <Text fontSize="20px" bold textAlign="left" color="background">Farms you staked</Text>
              </Flex>
              <Table farms={chosenFarmsMemoized} cakePrice={cakePrice} userDataReady={userDataReady} />
              {account && !userDataLoaded && stakedOnly && (
                <Flex justifyContent="center">
                  <Loading />
                </Flex>
              )}
              {poolLength && <div ref={observerRef} />}
            </Wrapper>
        </FarmsContext.Provider>
      )}
    </>
  )
}

export default Dashboard
