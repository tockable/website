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
  sepolia,
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

const lineasepolia = defineChain({
  id: 59141,
  name: "Linea Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.sepolia.linea.build"] },
    public: { http: ["https://rpc.sepolia.linea.build"] },
  },
  blockExplorers: {
    default: {
      name: "Sepolia.lineascan.build",
      url: "https://sepolia.lineascan.build/",
    },
  },
  contracts: {
    // multicall3: {
    //   address: "0xcA11bde05977b3631167028862bE2a173976CA11",
    //   blockCreated: 756690,
    // },
  },
});
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

const lineaMainnet = defineChain({
  ...linea,
  iconUrl:
    "https://camo.githubusercontent.com/277b146c3be551531afca6f304866ebd1cb3b4d7c5c6fc49c704e2975d6d8f14/68747470733a2f2f696d616765732e7a656e68756275736572636f6e74656e742e636f6d2f3630333665343238363463393433643333333163316632372f32373639383237332d613166652d343662632d396336382d343334333439653663323132",
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
  arbitrum,
  polygon,
  polygonMumbai,
  taiko,
  bob,
  blast,
  lineaMainnet,
  bevm,
  mode,
  sepolia,
  lineasepolia,
];
