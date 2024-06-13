import { defineChain } from "viem";
import {
  mainnet,
  linea,
  polygon,
  base,
  optimism,
  polygonMumbai,
  arbitrum,
  zora,
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

// const blastSepolia = defineChain({
//   id: 168587773,
//   name: "Blast Sepolia",
//   nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
//   rpcUrls: {
//     default: { http: ["https://sepolia.blast.io"] },
//     public: { http: ["https://sepolia.blast.io"] },
//   },
//   blockExplorers: {
//     default: {
//       name: "Testnet.blastscan.io",
//       url: "https://testnet.blastscan.io",
//     },
//   },
//   contracts: {
//     multicall3: {
//       address: "0xcA11bde05977b3631167028862bE2a173976CA11",
//       blockCreated: 756690,
//     },
//   },
// });

const bevm = defineChain({
  id: 11501,
  name: "BEVM",
  nativeCurrency: { name: "Bitcoin", symbol: "BTC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc-mainnet-1.bevm.io"] },
    public: { http: ["https://rpc-mainnet-1.bevm.io"] },
  },
  blockExplorers: {
    default: {
      name: "Scan-mainnet.bevm.io",
      url: "https://scan-mainnet.bevm.io",
    },
  },
  contracts: {
    // multicall3: {
    //   address: "0xcA11bde05977b3631167028862bE2a173976CA11",
    //   blockCreated: 756690,
    // },
  },
});

const bob = defineChain({
  id: 60808,
  name: "BOB",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.gobob.xyz"] },
    public: { http: ["https://rpc.gobob.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "Explorer.gobob.xyz",
      url: "https://explorer.gobob.xyz",
    },
  },
  contracts: {
    // multicall3: {
    //   address: "0xcA11bde05977b3631167028862bE2a173976CA11",
    //   blockCreated: 756690,
    // },
  },
});

const taiko = defineChain({
  id: 167000,
  name: "Taiko",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.mainnet.taiko.xyz"] },
    public: { http: ["https://rpc.mainnet.taiko.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "Taikoscan.io",
      url: "https://taikoscan.io",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 11269,
    },
  },
});

export const TOCKABLE_CHAINS = [
  mainnet,
  optimism,
  base,
  zora,
  taiko,
  bob,
  arbitrum,
  blast,
  linea,
  bevm,
  mode,
  polygon,
  polygonMumbai,
];
