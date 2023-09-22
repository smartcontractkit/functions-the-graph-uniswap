const graphKey = secrets.graphKey
const graphRequest = Functions.makeHttpRequest({
  url: `https://gateway-arbitrum.network.thegraph.com/api/${graphKey}/subgraphs/id/HUZDsRpEVP2AvzDCyzDHtdc64dyDxx8FQjzsmqSg4H3B`,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },

  data: {
    query: `{
                poolDayDatas(
                first:3
                orderBy: date
                orderDirection: desc
                where: {pool: "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640"}
                ) {
                id
                liquidity
                date
                volumeUSD
                tick
                }
            }`,
  },
})

const [graphResponse] = await Promise.all([graphRequest])
let liquidities = []
if (!graphResponse.error) {
  for (let i = 0; i < 3; i++) {
    liquidities.push(graphResponse.data.data.poolDayDatas[i].liquidity)
  }
} else {
  console.log("graphReponse Error, ", graphResponse)
}

// check if liquidity is increasing
// if it is increasing, return 1 and functionsConsumer trigger the function to swap WMATIC to WETH.
// if it is not, return 0 and functionsConsumer does nothing.
if (liquidities[0] > liquidities[1] && liquidities[0] > liquidities[2]) {
  console.log("liquidity is increasing")
  return Functions.encodeUint256(0)
}
return Functions.encodeUint256(1)
