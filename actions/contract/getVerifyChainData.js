"use server";
import {
  linea,
  baseGoerli,
  mainnet,
  polygon,
  optimism,
  optimismGoerli,
  base,
  polygonMumbai,
} from "wagmi/chains";

const VERIFY_CHAIN_DATA = [
  {
    chainId: mainnet.id,
    endpoint: "https://api.etherscan.io/api",
    apikey: process.env.ETHERSCAN_API,
  },
  {
    chainId: optimism.id,
    endpoint: "https://api-optimistic.etherscan.io/api",
    apikey: process.env.OPTIMISTICSCAN_API,
  },
  {
    chainId: optimismGoerli.id,
    endpoint: "https://api-optimistic.etherscan.io/api",
    apikey: process.env.OPTIMISTIC_GOERLI_SCAN_API,
  },
  {
    chainId: polygon.id,
    endpoint: "https://api.polygonscan.com/api",
    apikey: process.env.POLYGONSCAN_API,
  },
  {
    chainId: polygonMumbai.id,
    endpoint: "https://api-testnet.polygonscan.com/api",
    apikey: process.env.POLYGON_MUMBAISCAN_API,
  },
  {
    chainId: base.id,
    endpoint: "https://api.basescan.org/api",
    apikey: process.env.BASESCAN_API,
  },
  {
    chainId: baseGoerli.id,
    endpoint: "https://api-goerli.basescan.org",
    apikey: process.env.BASE_GOERLISCAN_API,
  },
  {
    chainId: linea.id,
    endpoint: "",
    apikey: process.env.LINEASCAN_API,
  },
];

export default async function getVerifyChainData(_chainId) {
  const chaindata = VERIFY_CHAIN_DATA.find(
    (chain) => chain.chainId === _chainId
  );
  return chaindata;
}
