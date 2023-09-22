# Functions: The Graph and Uniswap

- [Overview](#overview)
- [Quickstart](#quickstart)
  - [Requirements](#requirements)
  - [Steps](#steps)
- [For Beginners](#for-beginners)

# Overview

This use case demonstrates how to connect the [Graph](https://thegraph.com/) API and [Uniswap](https://uniswap.org/) router using [Chainlink Functions](https://docs.chain.link/chainlink-functions) to implement a trading strategy.

In particular, the example demonstrates how to retrieve three-day trading volume data from the WETH-USD pool in Uniswap V3 through a subgraph. It then uses Chainlink Functions to evaluate the liquidity based on the trading volume data.

If the liquidity of the pair is increasing, Chainlink functions triggers a function in `FunctionsConsumer.sol` to swap Wrapped Matic in the contract balance to Wrapped Ether.

Original idea behind the use case is that strong liquidity implies relatively safer assets as high liquidity assets are more easily traded and typically have lower price volatility. Therefore, decisions based on liquidity data from Uniswap pools can provide more reliable information to assess the risk asset swaps.

Under the scenario, using Chainlink Functions allows for a more accurate assessment of whether to exchange Wrapped Matic for WETH based on the current liquidity conditions, enabling better risk management.

In this use case, the reason for choosing to swap Wrapped matic to Wrapped Ether is that in the Polygon Mumbai testnet, only the the pair has sufficient liquidity for testing purposes. In production, you can choose any token pair to swap based on your needs and strategies.

# Quick Start

## Requirements

- Node.js version [18](https://nodejs.org/en/download/)

## Steps

1. Clone this repository to your local machine<br><br>
2. Open this directory in your command line, then run `npm install` to install all dependencies.<br><br>
3. Aquire a Github personal access token which allows reading and writing Gists.
   1. Visit [https://github.com/settings/tokens?type=beta](https://github.com/settings/tokens?type=beta) and click "Generate new token"
   2. Name the token and enable read & write access for Gists from the "Account permissions" drop-down menu. Do not enable any additional permissions.
   3. Click "Generate token" and copy the resulting personal access token for step 4.<br><br>
4. Aquire a [Graph key](https://thegraph.com/studio/apikeys/) which allows reading data indexed by subgraphs. Please do not forget to claim queries and make sure `FREE REMAINING: 1000` displayed in column "QUERIES TOTAL" of the key.
5. Set the required environment variables.
   1. Set an encryption password for your environment variables to a secure password by running:<br>`npx env-enc set-pw`<br>
   2. Use the command `npx env-enc set` to set the required environment variables (see [Environment Variable Management](#environment-variable-management)):
      - _GITHUB_API_TOKEN_ for your Github token obtained from step 3
      - _GRAPH_KEY_ for Graph key obtained from step 4
      - _PRIVATE_KEY_ for your development wallet
      - _POLYGON_MUMBAI_RPC_URL_, _ETHEREUM_SEPOLIA_RPC_URL_
   3. If desired, the `POLYGONSCAN_API_KEY` can be set in order to verify contracts`.<br><br>
6. There are two files to notice that the example will use:
   - _contracts/FunctionsConsumer.sol_ contains the smart contract that will receive the data and make the swap
   - _graph_request.js_ contains JavaScript code that will be executed by each node of the DON<br><br>
7. Test an end-to-end request and fulfillment locally by simulating it using:<br>`npx hardhat functions-simulate-script`<br><br>
8. Deploy and verify the client contract to an actual blockchain network by running:<br>`npx hardhat functions-deploy-consumer --network polygonMumbai --verify true`<br>**Note**: Make sure `POLYGONSCAN_API_KEY` is set if using `--verify true`, depending on which network is used.<br><br>
9. Create, fund & authorize a new Functions billing subscription by running:<br> `npx hardhat functions-sub-create --network polygonMumbai --amount 5 --contract <contract_address>`<br><br>**Note 1**: You have to go to Chainlink CCIP app to sign the term of use in the first time. </a>.<br><br>**Note 2**: Ensure your wallet has 5 LINK in your balance before running this command. Testnet LINK can be obtained at <a href="https://faucets.chain.link/">faucets.chain.link</a>.<br><br>**Note 3**: Please make sure that you are using polygon mumbai testnet. If you want to use the contract in other networks, change the line `if (block.chainid != 80001)` in the file `FunctionsConsumer.sol`.<br><br>
10. Transfer at least 0.1 WMATIC to contract FunctionsConsumer to make sure there is some WMATIC tokens in balance can be swapped. You need to add WMATIC into your Metamask before transfering, and the address of WMATIC on Polygon Mumbai is `0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889`. <br> Matic on Mumbai can be obtained at [alchemy faucet](https://mumbaifaucet.com/), and Matic can be swapped to Wrapped Matic(WMATIC) at [Uniswap on Mumbai](https://app.uniswap.org/#/swap). <br><br>
11. Make an on-chain request by running:<br>`npx hardhat functions-request --network polygonMumbai --contract <contract_address> --subid <subId> --callbackgaslimit 300000`. Please make sure you add the parameter `--gaslimit` and set it as 300k.

# For Beginners

- <b>Chainlink functions are still in beta test, please make sure the address you are using is in the [allowlist](https://chainlinkcommunity.typeform.com/requestaccess).</b>
- Please find [Subgraph](https://thegraph.com/explorer) used in the use case [here](https://thegraph.com/explorer/subgraphs/ELUcwgpm14LKPLrBRuVvPvNKHQ9HvwmtKgKSH6123cr7?view=Overview&chain=mainnet).
- Please find sample code for "Single Swaps" in Uniswap [here](https://docs.uniswap.org/contracts/v3/guides/swaps/single-swaps).
- The repo is a fork of [functions-hardhat-starter-kit](https://github.com/smartcontractkit/functions-hardhat-starter-kit), please find more use cases of Chainlink functions [here](https://docs.chain.link/chainlink-functions). For more detailed tutorials and examples, check out the [Chainlink Functions Tutorials](https://docs.chain.link/chainlink-functions/tutorials/) to get started.
