import {
  linea,
  mainnet,
  polygon,
  arbitrum,
  base,
  zora,
  optimism,
  polygonMumbai,
  // optimismSepolia,
  // baseSepolia,
} from "wagmi/chains";

const blastSepolia = {
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
};

export const TOCKABLE_CHAINS = [
  linea,
  mainnet,
  polygon,
  arbitrum,
  base,
  zora,
  optimism,
  polygonMumbai,
  // optimismSepolia,
  // baseSepolia,
  blastSepolia,
];
