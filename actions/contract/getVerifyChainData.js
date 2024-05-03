"use server";

const VERIFY_CHAIN_DATA = [
  {
    chainId: 1,
    endpoint: "https://api.etherscan.io/api",
    apikey: process.env.ETHERSCAN_API,
  },
  {
    chainId: 10,
    endpoint: "https://api-optimistic.etherscan.io/api",
    apikey: process.env.OPTIMISTICSCAN_API,
  },
  {
    chainId: 420,
    endpoint: "https://api-optimistic.etherscan.io/api",
    apikey: process.env.OPTIMISTIC_GOERLI_SCAN_API,
  },
  {
    chainId: 137,
    endpoint: "https://api.polygonscan.com/api",
    apikey: process.env.POLYGONSCAN_API,
  },
  {
    chainId: 80001,
    endpoint: "https://api-testnet.polygonscan.com/api",
    apikey: process.env.POLYGON_MUMBAISCAN_API,
  },
  {
    chainId: 8453,
    endpoint: "https://api.basescan.org/api",
    apikey: process.env.BASESCAN_API,
  },
  {
    chainId: 59144,
    endpoint: "https://api.lineascan.build/api",
    apikey: process.env.LINEASCAN_API,
  },
  {
    chainId: 81457,
    endpoint: "https://api.blastscan.io/api",
    apikey: process.env.BLASTSCAN_API,
  },
  {
    chainId: 42161,
    endpoint: "https://api.arbiscan.io/api",
    apikey: process.env.ARBITSCAN_API,
  },
];

export default async function getVerifyChainData(_chainId) {
  return VERIFY_CHAIN_DATA.find((chain) => chain.chainId === _chainId);
}
