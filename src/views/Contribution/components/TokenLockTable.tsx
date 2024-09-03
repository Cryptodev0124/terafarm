import BigNumber from "bignumber.js";
import { Fragment } from "react";
import { Button, Flex, NextLinkFromReactRouter, Text } from "components";
import { TokenPairImage } from "components/TokenImage";
import styled from "styled-components";
import { useToken } from "hooks/Tokens";
import Divider from "components/Divider";

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 0.5em;
  align-items: center;

  padding: 0 12px;

  grid-template-columns: 4fr 3fr 1fr;

  @media screen and (max-width: 670px) {
    grid-template-columns: 4fr 3fr 1fr;
  }
`

const TableWrapper = styled(Flex)`
  width: 100%;
  padding-top: 16px;
  flex-direction: column;
  background-color: ${({ theme }) => theme.card.background};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  ${({ theme }) => theme.mediaQueries.md} {
    border-radius: 8px;
  }
`

const DataRow: React.FC<React.PropsWithChildren<{ data: any}>> = ({ data }) => {
  const url = `/cp/id/${data.id}`
  const primaryToken = useToken(data.token0)
  const secondaryToken = useToken(data.token1)

  if (!data.id) return <></>

  const unlockDate = new Date(data.lockDate * 1000).toISOString().replace("T", ",").replace(".000Z", "")

  return (
    <>
    <ResponsiveGrid>
      <Flex alignItems="center">
        <TokenPairImage width={40} height={40} variant="inverted" primaryToken={primaryToken ?? undefined} secondaryToken={secondaryToken ?? undefined} />
        <Flex flexDirection="column" ml="10px">
          <Text small>{`${data.symbol0} / ${data.symbol1}`}</Text>
          <Text color="textDisabled" small>${new BigNumber(data.contribute).div(10 ** 18).decimalPlaces(0, 1).toNumber().toLocaleString()}</Text>
        </Flex>
      </Flex>
      <Text fontWeight={400}>{unlockDate}</Text>
      <NextLinkFromReactRouter to={url}>
        <Button
          width="100%"
          variant="text"
        >View</Button>
      </NextLinkFromReactRouter>
    </ResponsiveGrid>
    <Divider />
    </>
  )
}

const TokenLockTable: React.FC<
  React.PropsWithChildren<{
    data: any[]
    length: number
  }>
> = ({ data }) => {
  // const maxPage = Number.isNaN(length) ? 1 : Math.floor(length / MAX_ITEMS) + (length % MAX_ITEMS === 0 ? 0 : 1)

  return (
    <TableWrapper>
      <ResponsiveGrid>
        <Text color="secondary" fontSize="12px">
          Lock
        </Text>
        <Text color="secondary" fontSize="12px">
          Unlock Date (UTC)
        </Text>
        <Text color="secondary" fontSize="12px">
          {" "}
        </Text>
      </ResponsiveGrid>

      <Divider />

      {data.map((row, index) => {
        if (row) {
          const key = `contribute-lock-${index}`
          return (
            <Fragment key={key}>
              <DataRow data={row} />
            </Fragment>
          )
        }
        return null
      })}
    </TableWrapper>
  )
}

export default TokenLockTable