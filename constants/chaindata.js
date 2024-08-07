const BASE_FEE = {
  ETH_TOCKABLE: 0.00015,
  ETH_REGULAR: 0.000075,
  POLYGON_TOCKABLE: 0.6,
  POLYGON_REGULAR: 0.3,
  BTC_TOCKABLE: 0.000008,
  BTC_REGULAR: 0.000004,
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
    scan: "Base-sepolia.blockscout.com",
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
    // url: "https://explorer.mode.network",
    // verifyurl: "https://explorer.mode.network/contract-verification",
    verifyurl: "https://modescan.io/verifycontract",
    name: "Mode",
    // scan: "Explorer.mode.network",
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
];
