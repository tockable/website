const BASE_FEE = {
  ETH_TOCKABLE: Number(process.env.NEXT_PUBLIC_ETH_TOCKABLE),
  ETH_REGULAR: Number(process.env.NEXT_PUBLIC_ETH_REGULAR),
  POLYGON_TOCKABLE: Number(process.env.NEXT_PUBLIC_POLYGON_TOCKABLE),
  POLYGON_REGULAR: Number(process.env.NEXT_PUBLIC_POLYGON_REGULAR),
  BTC_TOCKABLE: Number(process.env.NEXT_PUBLIC_BTC_TOCKABLE),
  BTC_REGULAR: Number(process.env.NEXT_PUBLIC_BTC_REGULAR),
  TIA_TOCKABLE: Number(process.env.NEXT_PUBLIC_TIA_TOCKABLE),
  TIA_REGULAR: Number(process.env.NEXT_PUBLIC_TIA_REGULAR),
  KAIA_TOCKABLE: Number(process.env.NEXT_PUBLIC_KAIA_TOCKABLE),
  KAIA_REGULAR: Number(process.env.NEXT_PUBLIC_KAIA_REGULAR),
  APE_TOCKABLE: Number(process.env.NEXT_PUBLIC_APE_TOCKABLE),
  APE_REGULAR: Number(process.env.NEXT_PUBLIC_APE_REGULAR),
  CANTO_TOCKABLE: Number(process.env.NEXT_PUBLIC_CANTO_TOCKABLE),
  CANTO_REGULAR: Number(process.env.NEXT_PUBLIC_CANTO_REGULAR),
  CRO_TOCKABLE: Number(process.env.NEXT_PUBLIC_CRO_TOCKABLE),
  CRO_REGULAR: Number(process.env.NEXT_PUBLIC_CRO_REGULAR),
  DEGEN_TOCKABLE: Number(process.env.NEXT_PUBLIC_DEGEN_TOCKABLE),
  DEGEN_REGULAR: Number(process.env.NEXT_PUBLIC_DEGEN_REGULAR),
  TOPIA_TOCKABLE: Number(process.env.NEXT_PUBLIC_TOPIA_TOCKABLE),
  TOPIA_REGULAR: Number(process.env.NEXT_PUBLIC_TOPIA_REGULAR),
  SEI_TOCKABLE: Number(process.env.NEXT_PUBLIC_SEI_TOCKABLE),
  SEI_REGULAR: Number(process.env.NEXT_PUBLIC_SEI_REGULAR),
};

export const chainData = [
  {
    chainId: 1,
    url: "https://etherscan.io",
    verifyurl: "https://etherscan.io/verifyContract",
    name: "Ethereum",
    scan: "Etherscan.io",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 10,
    url: "https://optimistic.etherscan.io",
    verifyurl: "https://optimistic.etherscan.io/verifyContract",
    name: "Optimism",
    scan: "Optimistic.etherscan.io",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 11155420,
    url: "https://sepolia-optimism.etherscan.io/",
    name: "Optimism Sepolia'",
    scan: "Sepolia-optimism.etherscan.io/",
    verifyurl: "https://sepolia-optimism.etherscan.io/verifycontract",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 137,
    url: "https://polygonscan.com",
    verifyurl: "https://polygonscan.com/verifyContract",
    name: "Polygon",
    scan: "Polygonscan.com",
    nativeToken: "MATIC",
    base_fee: BASE_FEE.POLYGON_TOCKABLE,
    regular_base_fee: BASE_FEE.POLYGON_REGULAR,
  },
  {
    chainId: 80001,
    url: "https://mumbai.polygonscan.com",
    verifyurl: "https://mumbai.polygonscan.com/verifyContract",
    name: "Polygon mumbai",
    scan: "Mumbai.polygonscan.com",
    nativeToken: "MATIC",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 8453,
    url: "https://basescan.org",
    name: "Base",
    scan: "Basescan.org",
    verifyurl: "https://basescan.org/verifyContract",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 84532,
    url: "https://sepolia.basescan.org",
    name: "Base Sepolia",
    scan: "Sepolia.basescan.org",
    verifyurl: "https://sepolia.basescan.org/verifyContract",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 59144,
    url: "https://lineascan.build",
    name: "Linea Mainnet",
    scan: "Lineascan.build",
    verifyurl: "https://lineascan.build/verifyContract",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 168587773,
    url: "https://sepolia.blastscan.io",
    name: "Blast Sepolia",
    scan: "Sepolia.blastscan.io",
    verifyurl: "https://sepolia.blastscan.io/verifyContract",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 59140,
    url: "https://goerli.lineascan.build",
    name: "Linea Goerli",
    scan: "Goerli.lineascan.build",
    verifyurl: "https://goerli.lineascan.build/verifyContract",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 81457,
    url: "https://blastscan.io",
    name: "Blast",
    scan: "Blastscan.io",
    verifyurl: "https://blastscan.io/verifyContract",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 34443,
    url: "https://modescan.io",
    verifyurl: "https://modescan.io/verifycontract",
    name: "Mode",
    scan: "Modescan.io",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 7777777,
    url: "https://zorascan.zyx",
    verifyurl: "https://zorascan.xyz/verifycontract",
    name: "Zora",
    scan: "Zorascan.xyz",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 42161,
    url: "https://arbiscan.io",
    verifyurl: "https://arbiscan.io/verifyContract",
    name: "Arbitrum One",
    scan: "Arbiscan.io",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 11501,
    url: "https://scan-mainnet.bevm.io",
    verifyurl: "https://scan-mainnet.bevm.io/contract-verification",
    name: "BEVM",
    scan: "Scan-mainnet.bevm.io",
    nativeToken: "BTC",
    base_fee: BASE_FEE.BTC_TOCKABLE,
    regular_base_fee: BASE_FEE.BTC_REGULAR,
  },
  {
    chainId: 60808,
    url: "https://explorer.gobob.xyz",
    verifyurl: "https://explorer.gobob.xyz/contract-verification",
    name: "BOB",
    scan: "Explorer.gobob.xyz",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 167000,
    url: "https://taikoscan.io",
    verifyurl: "https://taikoscan.io/verifycontract",
    name: "Taiko",
    scan: "Taikoscan.io/verifycontract",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 11155111,
    url: "https://sepolia.etherscan.io",
    verifyurl: "https://sepolia.etherscan.io/verifyContract",
    name: "Sepolia",
    scan: "Sepolia.etherscan.io",
    nativeToken: "SepoliaETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 17000,
    url: "https://holesky.etherscan.io",
    verifyurl: "https://holesky.etherscan.io/verifyContract",
    name: "Holesky",
    scan: "Holesky.etherscan.io",
    nativeToken: "HolETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 59141,
    url: "https://sepolia.linea.build",
    verifyurl: "https://sepolia.lineascan.build/verifyContract",
    name: "Linea Sepolia",
    scan: "Sepolia.lineascan.build",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 30732,
    url: "https://explorer.devnet.imola.movementlabs.xyz/#/?network=testnet",
    verifyurl:
      "https://explorer.devnet.imola.movementlabs.xyz/#/?network=testnet/verifyContract",
    name: "MEVM Testnet",
    scan: "Explorer.devnet.imola.movementlabs.xyz",
    nativeToken: "MOVE",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 30,
    url: "https://explorer.rootstock.io",
    verifyurl: "https://explorer.rootstock.io",
    name: "Rootstock",
    scan: "Explorer.rootstock.io",
    nativeToken: "RBTC",
    base_fee: BASE_FEE.BTC_TOCKABLE,
    regular_base_fee: BASE_FEE.BTC_REGULAR,
  },
  {
    chainId: 25,
    url: "https://cronoscan.com",
    verifyurl: "https://cronoscan.com/verifycontract",
    name: "Cronos Mainnet",
    scan: "Cronoscan.com",
    nativeToken: "CRO",
    base_fee: BASE_FEE.CRO_TOCKABLE,
    regular_base_fee: BASE_FEE.CRO_REGULAR,
  },
  {
    chainId: 8217,
    url: "https://kaiascan.io",
    verifyurl: "https://kaiascan.io/contract",
    name: "Kaia",
    scan: "Kaiascan.io",
    nativeToken: "KAIA",
    base_fee: BASE_FEE.KAIA_TOCKABLE,
    regular_base_fee: BASE_FEE.KAIA_REGULAR,
  },
  {
    chainId: 7700,
    url: "https://tuber.build",
    verifyurl: "https://tuber.build",
    name: "Canto",
    scan: "Tuber.build",
    nativeToken: "CANTO",
    base_fee: BASE_FEE.CANTO_TOCKABLE,
    regular_base_fee: BASE_FEE.CANTO_REGULAR,
  },
  {
    chainId: 1135,
    url: "https://blockscout.lisk.com",
    verifyurl: "https://blockscout.lisk.com/contract-verification",
    name: "Lisk",
    scan: "Blockscout.lisk.com",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 2818,
    url: "https://explorer.morphl2.io",
    verifyurl: "https://explorer.morphl2.io/contract-verification",
    name: "Morph L2",
    scan: "Explorer.morphl2.io",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 33139,
    url: "https://apescan.io",
    verifyurl: "https://apescan.io/verifycontract",
    name: "Apechain",
    scan: "Apescan.io",
    nativeToken: "APE",
    base_fee: BASE_FEE.APE_TOCKABLE,
    regular_base_fee: BASE_FEE.APE_REGULAR,
  },
  {
    chainId: 252,
    url: "https://fraxscan.com",
    verifyurl: "https://fraxscan.com/verifycontract",
    name: "Fraxtal",
    scan: "Fraxscan.com",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 57073,
    url: "https://explorer.inkonchain.com",
    verifyurl: "https://explorer.inkonchain.com/contract-verification",
    name: "Ink",
    scan: "Explorer.inkonchain.com",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },

  {
    chainId: 984122,
    url: "https://explorer.forma.art",
    verifyurl: "https://explorer.forma.art/contract-verification",
    name: "Forma",
    scan: "Explorer.forma.art",
    nativeToken: "TIA",
    base_fee: BASE_FEE.TIA_TOCKABLE,
    regular_base_fee: BASE_FEE.TIA_REGULAR,
  },
  {
    chainId: 1301,
    url: "https://sepolia.uniscan.xyz",
    verifyurl: "https://sepolia.uniscan.xyz/verifycontract",
    name: "Unichain Sepolia",
    scan: "Sepolia.uniscan.xyz",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 80084,
    url: "https://bartio.beratrail.io",
    verifyurl: "https://bartio.beratrail.io/verifycontract",
    name: "Berachain bArtio",
    scan: "Bartio.beratrail.io",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 33111,
    url: "https://curtis.explorer.caldera.xyz",
    verifyurl: "https://curtis.explorer.caldera.xyz/contract-verification",
    name: "Apechain Curtis",
    scan: "Curtis.explorer.caldera.xyz.io",
    nativeToken: "APE",
    base_fee: BASE_FEE.APE_TOCKABLE,
    regular_base_fee: BASE_FEE.APE_REGULAR,
  },
  {
    chainId: 984123,
    url: "https://explorer.sketchpad-1.forma.art",
    verifyurl: "https://explorer.sketchpad-1.forma.art/contract-verification",
    name: "Forma Sketchpad",
    scan: "Explorer.sketchpad-1.forma.art",
    nativeToken: "TIA",
    base_fee: BASE_FEE.TIA_TOCKABLE,
    regular_base_fee: BASE_FEE.TIA_REGULAR,
  },

  {
    chainId: 2810,
    url: "https://explorer-holesky.morphl2.io",
    verifyurl: "https://explorer-holesky.morphl2.io/contract-verification",
    name: "Morph Holesky",
    scan: "Explorer-holesky.morphl2.io",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 480,
    url: "https://worldscan.org",
    verifyurl: "https://worldscan.org/verifycontract",
    name: "Worldchain",
    scan: "Worldscan.org",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 1868,
    url: "https://soneium.blockscout.com",
    verifyurl: "https://soneium.blockscout.com/contract-verification",
    name: "Soneium",
    scan: "Soneium.blockscout.com",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 55244,
    url: "https://explorer.superposition.so",
    verifyurl: "https://explorer.superposition.so/contract-verification",
    name: "Superposition",
    scan: "Explorer.superposition.so",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 1380012617,
    url: "https://mainnet.explorer.rarichain.org",
    verifyurl: "https://mainnet.explorer.rarichain.org/contract-verification",
    name: "rari",
    scan: "Mainnet.explorer.rarichain.org",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 185,
    url: "https://explorer.mintchain.io",
    verifyurl: "https://explorer.mintchain.io/contract-verification",
    name: "mint",
    scan: "Explorer.mintchain.io",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 666666666,
    url: "https://explorer.degen.tips",
    verifyurl: "https://explorer.degen.tips/contract-verification",
    name: "degen",
    scan: "Explorer.degen.tips",
    nativeToken: "DEGEN",
    base_fee: BASE_FEE.DEGEN_TOCKABLE,
    regular_base_fee: BASE_FEE.DEGEN_REGULAR,
  },
  {
    chainId: 690,
    url: "https://explorer.redstone.xyz",
    verifyurl: "https://explorer.redstone.xyz/contract-verification",
    name: "redstone",
    scan: "Explorer.redstone.xyz",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 33979,
    url: "https://funkiscan.io",
    verifyurl: "https://funkiscan.io/verifycontract",
    name: "funkichain",
    scan: "Funkiscan.io",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 8333,
    url: "https://explorer.b3.fun",
    verifyurl: "https://explorer.b3.fun/contract-verification",
    name: "b3",
    scan: "Explorer.b3.fun",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 2911,
    url: "https://explorer.hychain.com",
    verifyurl: "https://explorer.hychain.com", // should find
    name: "hychain",
    scan: "Explorer.hychain.com",
    nativeToken: "TOPIA",
    base_fee: BASE_FEE.TOPIA_TOCKABLE,
    regular_base_fee: BASE_FEE.TOPIA_REGULAR,
  },
  {
    chainId: 7560,
    url: "https://cyberscan.co",
    verifyurl: "https://cyberscan.co/verify-contract",
    name: "cyber",
    scan: "Cyberscan.co",
    nativeToken: "ETH",
    base_fee: BASE_FEE.ETH_TOCKABLE,
    regular_base_fee: BASE_FEE.ETH_REGULAR,
  },
  {
    chainId: 1329,
    url: "https://www.seiscan.app",
    verifyurl: "https://www.seiscan.app", //should find
    name: "sei",
    scan: "Seiscan.co",
    nativeToken: "SEI",
    base_fee: BASE_FEE.SEI_TOCKABLE,
    regular_base_fee: BASE_FEE.SEI_REGULAR,
  },
];
