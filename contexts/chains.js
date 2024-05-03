import { defineChain } from "viem";
import {
  mainnet,
  linea,
  lineaTestnet,
  polygon,
  base,
  optimism,
  polygonMumbai,
  arbitrum,
  zora,
  // optimismSepolia,
  // baseSepolia,
} from "wagmi/chains";

const mode = defineChain({
  id: 34443,
  name: "Mode",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://1rpc.io/mode"] },
    public: { http: ["https://mainnet.mode.network"] },
  },
  blockExplorers: {
    default: {
      name: "Explorer.mode.network",
      url: "https://explorer.mode.network",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 2465882,
    },
  },
});

const blast = defineChain({
  id: 81457,
  name: "Blast",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.blast.io"] },
    public: { http: ["https://rpc.blast.io"] },
  },
  blockExplorers: {
    default: {
      name: "Blastscan.io",
      url: "https://blastscan.io",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 88189,
    },
  },
});

const blastSepolia = defineChain({
  id: 168587773,
  name: "Blast Sepolia",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia.blast.io"] },
    public: { http: ["https://sepolia.blast.io"] },
  },
  blockExplorers: {
    default: {
      name: "Testnet.blastscan.io",
      url: "https://testnet.blastscan.io",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 756690,
    },
  },
});

export const TOCKABLE_CHAINS = [
  mainnet,
  optimism,
  base,
  mode,
  blast,
  blastSepolia,
  linea,
  lineaTestnet,
  polygon,
  polygonMumbai,
  zora,
  arbitrum,
  // optimismSepolia,
  // baseSepolia,
];
