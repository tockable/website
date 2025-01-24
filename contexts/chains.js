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
  holesky,
  arbitrumNova,
  canto,
  optimismSepolia,
  cronos,
} from "viem/chains";

const mevm = defineChain({
  id: 30732,
  name: "MEVM Testnet",
  network: "mevmtestnet",
  nativeCurrency: { name: "Move", symbol: "MOVE", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mevm.devnet.imola.movementlabs.xyz"] },
    public: { http: ["https://mevm.devnet.imola.movementlabs.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "Explorer.devnet.imola.movementlabs.xyz",
      url: "https://explorer.devnet.imola.movementlabs.xyz/#/?network=testnet",
    },
  },
});

const mode = defineChain({
  id: 34443,
  name: "Mode",
  network: "mode",
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
  network: "balst",
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
  network: "balstsepolia",
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

const lineaSepolia = defineChain({
  id: 59141,
  network: "lineasepolia",
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
  contracts: {},
});

const fraxtal = defineChain({
  id: 252,
  iconUrl:
    "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/fraxtal.svg",
  name: "Fraxtal",
  network: "fraxtal",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.frax.com"] },
    public: { http: ["https://rpc.frax.com"] },
  },
  blockExplorers: {
    default: {
      name: "Fraxscan.com",
      url: "https://fraxscan.com",
    },
  },
  contracts: {},
});

const apechain = defineChain({
  id: 33139,
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/18876.png",
  name: "Apechain",
  network: "apechain",
  nativeCurrency: { name: "ApeCoin", symbol: "APE", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://apechain.calderachain.xyz/http"] },
    public: { http: ["https://apechain.calderachain.xyz/http"] },
  },
  blockExplorers: {
    default: {
      name: "Apescan.io",
      url: "https://apescan.io",
    },
  },
  contracts: {},
});

const apechainCurtis = defineChain({
  id: 33111,
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/18876.png",
  name: "Apechain Curtis",
  network: "apechaincurtis",
  nativeCurrency: { name: "Ape", symbol: "APE", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://curtis.rpc.caldera.xyz/http"] },
    public: { http: ["https://curtis.rpc.caldera.xyz/http"] },
  },
  blockExplorers: {
    default: {
      name: "Curtis.explorer.caldera.xyz.io",
      url: "https://curtis.explorer.caldera.xyz",
    },
  },
  contracts: {},
});

const berachainBartio = defineChain({
  id: 80084,
  name: "Berachain bArtio",
  network: "berachainbartio",
  nativeCurrency: { name: "Bera", symbol: "BERA", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://bartio.rpc.berachain.com/"] },
    public: { http: ["https://bartio.rpc.berachain.com/"] },
  },
  blockExplorers: {
    default: {
      name: "Bartio.beratrail.io",
      url: "https://bartio.beratrail.io",
    },
  },
  contracts: {},
});

const bevm = defineChain({
  id: 11501,
  name: "BEVM",
  network: "bevm",
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
  contracts: {},
});

const bob = defineChain({
  id: 60808,
  name: "BOB",
  network: "bob",
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
  contracts: {},
});

const lineaMainnet = defineChain({
  ...linea,
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/27657.png",
});

const taiko = defineChain({
  id: 167000,
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/31525.png",
  name: "Taiko",
  network: "taiko",
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

const forma = defineChain({
  id: 984122,
  name: "Forma",
  network: "forma",
  nativeCurrency: { name: "Tia", symbol: "TIA", decimals: 6 },
  rpcUrls: {
    default: { http: ["https://rpc.forma.art"] },
    public: { http: ["https://rpc.forma.art"] },
  },
  blockExplorers: {
    default: {
      name: "Explorer.forma.art",
      url: "https://explorer.forma.art",
    },
  },
  contracts: {},
});

const formaTestnet = defineChain({
  id: 984123,
  name: "Forma Sketchpad",
  network: "formasketchpad",
  nativeCurrency: { name: "Tia", symbol: "TIA", decimals: 6 },
  rpcUrls: {
    default: { http: ["https://rpc.sketchpad-1.forma.art"] },
    public: { http: ["https://rpc.sketchpad-1.forma.art"] },
  },
  blockExplorers: {
    default: {
      name: "Explorer.sketchpad-1.forma.art",
      url: "https://explorer.sketchpad-1.forma.art",
    },
  },
  contracts: {},
});

//https://api-explorer-verify.testnet.abs.xyz/contract_verification
// const abstractTestnet = defineChain({
//   id: 11124,
//   name: "Abstract Testnet",
//   nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
//   rpcUrls: {
//     default: { http: ["https://api.testnet.abs.xyz"] },
//     public: { http: ["https://api.testnet.abs.xyz"] },
//   },
//   blockExplorers: {
//     default: {
//       name: "Explorer.testnet.abs.xyz",
//       url: "https://explorer.testnet.abs.xyz",
//     },
//   },
//   contracts: {},
// });

const unichainTestnet = defineChain({
  id: 11124,
  iconUrl: "https://www.gas.zip/chains-64x64/logoUnichain.png",
  name: "Unichain Sepolia",
  network: "unichainsepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia.unichain.org"] },
    public: { http: ["https://sepolia.unichain.org"] },
  },
  blockExplorers: {
    default: {
      name: "Sepolia.uniscan.xyz",
      url: "https://sepolia.uniscan.xyz",
    },
  },
  contracts: {},
});

const kaia = defineChain({
  id: 8217,
  name: "Kaia",
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/32880.png",
  network: "kaia",
  nativeCurrency: { name: "Kaia", symbol: "KAIA", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://public-en.node.kaia.io"] },
    public: { http: ["https://public-en.node.kaia.io"] },
  },
  blockExplorers: {
    default: {
      name: "Kaiascan.io",
      url: "https://kaiascan.io",
    },
  },
  contracts: {},
});

const morphl2 = defineChain({
  id: 2818,
  name: "Morph L2",
  network: "morphl2",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc-quicknode.morphl2.io"] },
    public: { http: ["https://rpc-quicknode.morphl2.io"] },
  },
  blockExplorers: {
    default: {
      name: "Explorer.morphl2.io",
      url: "https://explorer.morphl2.io",
    },
  },
  contracts: {},
});

const worldchain = defineChain({
  id: 480,
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/13502.png",
  name: "Worldchain",
  network: "worldchain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["worldchain-mainnet.g.alchemy.com/public"] },
    public: { http: ["worldchain-mainnet.g.alchemy.com/public"] },
  },
  blockExplorers: {
    default: {
      name: "Worldscan.org",
      url: "https://worldscan.org",
    },
  },
  contracts: {},
});

// const chainbaseTestnet = defineChain({
//   id: 2233,
//   name: "Chainbase Sepolia",
//   nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
//   rpcUrls: {
//     default: { http: ["https://rpc-quicknode-holesky.morphl2.io"] },
//     public: { http: ["https://rpc-quicknode-holesky.morphl2.io"] },
//   },
//   blockExplorers: {
//     default: {
//       name: "Testnet.explorer.chainbase.com",
//       url: "https://testnet.explorer.chainbase.com",
//     },
//   },
//   contracts: {},
// });

const ink = defineChain({
  id: 57073,
  iconUrl: "https://avatars.githubusercontent.com/u/168584369?s=200&v=4",
  name: "Ink",
  network: "ink",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc-gel.inkonchain.com"] },
    public: { http: ["https://rpc-gel.inkonchain.com"] },
  },
  blockExplorers: {
    default: {
      name: "Explorer.inkonchain.com",
      url: "https://explorer.inkonchain.com",
    },
  },
  contracts: {},
});

const lisk = defineChain({
  id: 1135,
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/1214.png",
  name: "Lisk",
  network: "lisk",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.api.lisk.com"] },
    public: { http: ["https://rpc.api.lisk.com"] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout.lisk.com",
      url: "https://blockscout.lisk.com",
    },
  },
  contracts: {},
});

const morphHolesky = defineChain({
  id: 2810,
  name: "Morph Holesky",
  network: "morphholesky",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc-quicknode-holesky.morphl2.io"] },
    public: { http: ["https://rpc-quicknode-holesky.morphl2.io"] },
  },
  blockExplorers: {
    default: {
      name: "Explorer-holesky.morphl2.io",
      url: "https://explorer-holesky.morphl2.io",
    },
  },
  contracts: {},
});

const baseSepolia = defineChain({
  id: 84532,
  name: "Base Sepolia",
  network: "basesepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia.base.org"] },
    public: { http: ["https://sepolia.base.org"] },
  },
  blockExplorers: {
    default: {
      name: "Sepolia.basescan.org",
      url: "https://sepolia.basescan.org",
    },
  },
  contracts: {},
});

const rootstock = defineChain({
  id: 30,
  iconUrl:
    "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/rootstock.svg",
  name: "Rootstock",
  network: "rootstock",
  nativeCurrency: { name: "Rootstock Bitcoin", symbol: "RBTC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rootstock-mainnet.public.blastapi.io"] },
    public: { http: ["https://rootstock-mainnet.public.blastapi.io"] },
  },
  blockExplorers: {
    default: {
      name: "Explorer.rootstock.io",
      url: "https://explorer.rootstock.io",
    },
  },
  contracts: {},
});

const soneium = defineChain({
  id: 1868,
  name: "Soneium",
  network: "soneium",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.soneium.org"] },
    public: { http: ["https://rpc.soneium.org"] },
  },
  blockExplorers: {
    default: {
      name: "Soneium.blockscout.com",
      url: "https://soneium.blockscout.com",
    },
  },
  contracts: {},
});

const superposition = defineChain({
  id: 55244,
  name: "Superposition",
  network: "superposition",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.superposition.so"] },
    public: { http: ["https://rpc.superposition.so"] },
  },
  blockExplorers: {
    default: {
      name: "Explorer.superposition.so",
      url: "https://explorer.superposition.so",
    },
  },
  contracts: {},
});

const rari = defineChain({
  id: 1380012617,
  name: "Rari",
  network: "rari",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet.rpc.rarichain.org/http"] },
    public: { http: ["https://mainnet.rpc.rarichain.org/http"] },
  },
  blockExplorers: {
    default: {
      name: "Mainnet.explorer.rarichain.org",
      url: "https://mainnet.explorer.rarichain.org",
    },
  },
  contracts: {},
});

const mint = defineChain({
  id: 185,
  name: "Mint",
  network: "mint",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.mintchain.io"] },
    public: { http: ["https://rpc.mintchain.io"] },
  },
  blockExplorers: {
    default: {
      name: "Explorer.mintchain.io",
      url: "https://explorer.mintchain.io",
    },
  },
  contracts: {},
});

const degen = defineChain({
  id: 666666666,
  name: "Degen Chain",
  network: "degen",
  nativeCurrency: { name: "Degen", symbol: "DEGEN", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.degen.tips"] },
    public: { http: ["https://rpc.degen.tips"] },
  },
  blockExplorers: {
    default: {
      name: "Explorer.degen.tips",
      url: "https://explorer.degen.tips",
    },
  },
  contracts: {},
});

const redstone = defineChain({
  id: 690,
  name: "Redstone",
  network: "redstone",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.redstonechain.com"] },
    public: { http: ["https://rpc.redstonechain.com"] },
  },
  blockExplorers: {
    default: {
      name: "Explorer.redstone.xyz",
      url: "https://explorer.redstone.xyz",
    },
  },
  contracts: {},
});

const funkichain = defineChain({
  id: 33979,
  name: "Funki Mainnet",
  network: "funkichain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc-mainnet.funkichain.com"] },
    public: { http: ["https://rpc-mainnet.funkichain.com"] },
  },
  blockExplorers: {
    default: {
      name: "Funkiscan.io",
      url: "https://funkiscan.io",
    },
  },
  contracts: {},
});

const b3 = defineChain({
  id: 8333,
  name: "B3 Mainnet",
  network: "b3",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet-rpc.b3.fun/http"] },
    public: { http: ["https://mainnet-rpc.b3.fun/http"] },
  },
  blockExplorers: {
    default: {
      name: "Explorer.b3.fun",
      url: "https://explorer.b3.fun",
    },
  },
  contracts: {},
});

const hychain = defineChain({
  id: 2911,
  name: "HYCHAIN Mainnet",
  network: "hychain",
  nativeCurrency: { name: "Hytopia", symbol: "TOPIA", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.hychain.com/http"] },
    public: { http: ["https://rpc.hychain.com/http"] },
  },
  blockExplorers: {
    default: {
      name: "Explorer.hychain.com",
      url: "https://explorer.hychain.com",
    },
  },
  contracts: {},
});

const cyber = defineChain({
  id: 7560,
  name: "Cyber Mainnet",
  network: "cyber",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.cyber.co"] },
    public: { http: ["https://rpc.cyber.co"] },
  },
  blockExplorers: {
    default: {
      name: "Cyberscan.co",
      url: "https://cyberscan.co",
    },
  },
  contracts: {},
});

const sei = defineChain({
  id: 1329,
  name: "Sei",
  network: "sei",
  nativeCurrency: { name: "Sei", symbol: "SEI", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://evm-rpc.sei-apis.com"] },
    public: { http: ["https://evm-rpc.sei-apis.com"] },
  },
  blockExplorers: {
    default: {
      name: "Seiscan.app",
      url: "https://www.seiscan.app",
    },
  },
  contracts: {},
});

const manta = defineChain({
  id: 169,
  name: "Manta",
  network: "manta",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://pacific-rpc.manta.network/http"] },
    public: { http: ["https://pacific-rpc.manta.network/http"] },
  },
  blockExplorers: {
    default: {
      name: "Pacific-explorer.manta.network",
      url: "https://pacific-explorer.manta.network",
    },
  },
  contracts: {},
});

const ham = defineChain({
  id: 5112,
  name: "Ham",
  network: "ham",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.ham.fun"] },
    public: { http: ["https://rpc.ham.fun"] },
  },
  blockExplorers: {
    default: {
      name: "Explorer.ham.fun",
      url: "https://explorer.ham.fun",
    },
  },
  contracts: {},
});

const sanko = defineChain({
  id: 1996,
  name: "Sanko",
  network: "sanko",
  nativeCurrency: { name: "Dream Machine Token", symbol: "DMT", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet.sanko.xyz"] },
    public: { http: ["https://mainnet.sanko.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "Explorer.sanko.xyz/",
      url: "https://explorer.sanko.xyz/",
    },
  },
  contracts: {},
});

// const treasure = defineChain({
//   id: 61166,
//   name: "Treasure",
//   network: "treasure",
//   nativeCurrency: { name: "Magic", symbol: "MAGIC", decimals: 18 },
//   rpcUrls: {
//     default: { http: ["https://rpc.treasure.lol"] },
//     public: { http: ["https://rpc.treasure.lol"] },
//   },
//   blockExplorers: {
//     default: {
//       name: "Treasurescan.io",
//       url: "https://treasurescan.io",
//     },
//   },
//   contracts: {},
// });

// const shape = defineChain({
//   id: 360,
//   name: "Shape",
//   network: "shape",
//   nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
//   rpcUrls: {
//     default: { http: ["https://mainnet.shape.network"] },
//     public: { http: ["https://mainnet.shape.network"] },
//   },
//   blockExplorers: {
//     default: {
//       name: "Shapescan.xyz",
//       url: "https://shapescan.xyz",
//     },
//   },
//   contracts: {},
// });

// const arenaz = defineChain({
//   id: 7897,
//   name: "Arena-z",
//   network: "arena-z",
//   nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
//   rpcUrls: {
//     default: { http: ["https://rpc.arena-z.gg"] },
//     public: { http: ["https://rpc.arena-z.gg"] },
//   },
//   blockExplorers: {
//     default: {
//       name: "Explorer.arena-z.gg",
//       url: "https://explorer.arena-z.gg",
//     },
//   },
//   contracts: {},
// });

export const TOCKABLE_CHAINS = {
  testnet: [
    mainnet,
    sepolia,
    holesky,
    // mevm,
    unichainTestnet,
    berachainBartio,
    apechainCurtis,
    baseSepolia,
    formaTestnet,
    polygonMumbai,
    blastSepolia,
    lineaSepolia,
    optimismSepolia,
    morphHolesky,
  ],
  mainnet: [
    mainnet,
    optimism,
    base,
    zora,
    ink,
    arbitrum,
    soneium,
    worldchain,
    rootstock,
    bob,
    apechain,
    forma,
    manta,
    superposition,
    rari,
    redstone,
    mint,
    sanko,
    // shape,
    // arenaz,
    ham,
    b3,
    sei,
    funkichain,
    // treasure,
    cronos,
    degen,
    hychain,
    cyber,
    polygon,
    kaia,
    canto,
    lisk,
    arbitrumNova,
    taiko,
    morphl2,
    lineaMainnet,
    bevm,
    mode,
    fraxtal,
    blast,
  ],
};
