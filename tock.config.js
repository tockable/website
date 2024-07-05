export const BASEURL = "https://tockable.xyz";
export const IPFS_GATEWAY = "https://ipfs.io/ipfs";
export const NFT_STORAGE_GATEWAY = "ipfs.nftstorage.link";
export const MAX_LAYERS = 40;
export const MAX_FILES_PER_LAYER = 20;
export const TOCKABLE_ADDRESS = "0x38A4118936Dd9F7d5d2b7eD9B04333e129a95d97";
export const MAX_MINT_PER_TX = 5;

export const SOCIAL = {
  twitter: "https://twitter.com/tockablexyz",
  discord: "https://discord.gg",
  mirror: "https://mirror.xyz",
};
export const TOCKABLE_VERSION = "0.3.13";

export const SUPPORTED_CHAINS = [
  { name: "Ethereum ♦", value: "1", cleanName: "ethereum" },
  { name: "BEVM🔥", value: "11501", cleanName: "bevm" },
  { name: "BOB🔥", value: "60808", cleanName: "bob" },
  { name: "Taiko🔥", value: "167000", cleanName: "taiko" },
  { name: "Base", value: "8453", cleanName: "base" },
  { name: "Zora", value: "7777777", cleanName: "zora" },
  { name: "Arbitrum One", value: "42161", cleanName: "arbitrum" },
  { name: "Optimism", value: "10", cleanName: "optimism" },
  { name: "Linea ", value: "59144", cleanName: "linea" },
  { name: "Blast", value: "81457", cleanName: "blast" },
  { name: "Mode", value: "34443", cleanName: "mode" },
  { name: "Polygon", value: "137", cleanName: "polygon" },
  // { name: "Linea Goerli ⬛️", value: "59140" },
  // { name: "Polygon mumbai", value: "80001" },
  // { name: "Blast Sepolia", value: "168587773" },
];

export const EXPLORE_CHAINS = {
  ethereum: 1,
  bevm: 11501,
  bob: 60808,
  taiko: 167000,
  base: 8453,
  zora: 7777777,
  arbitrum: 42161,
  optimism: 10,
  linea: 59144,
  blast: 81457,
  mode: 34443,
  polygon: 137,
};

export const TXP = {
  tockable: 100,
  regular: 50,
  contractTockable: 1000,
  contractRegular: 750,
};

export const DROP_TYPES = [
  {
    type: "tockable",
    typeNo: 0,
    currentVersion: 2,
    title: "Tockable drop",
    description:
      "Create an NFT collection where collectors can make their own NFT during the mint, unlimited or fixed supply.",
  },
  {
    type: "regular",
    typeNo: 1,
    currentVersion: 2,
    title: "Regular drop",
    description:
      "Create a traditional NFT collection with fixed total supply and pre-uploaded IPFS metadata",
  },
  {
    type: "mono",
    typeNo: 2,
    currentVersion: 1,
    title: "Edition",
    description:
      "All tokens share a similar image, Useful for Editions, erc721 OATs, Tickets, and subscriptions.",
  },
];

export const db_path = process.env.SQL_PATH;
