export const BASEURL = "http://tockable.xyz";
export const IPFS_GATEWAY = "https://ipfs.io/ipfs";
export const NFT_STORAGE_GATEWAY = "ipfs.nftstorage.link";
export const MAX_LAYERS = 6;
export const MAX_FILES_PER_LAYER = 10;
export const TOCKABLE_ADDRESS = "0x38A4118936Dd9F7d5d2b7eD9B04333e129a95d97";
export const MAX_MINT_PER_TX = 5;

export const SOCIAL = {
  twitter: "https://twitter.com/tockablexyz",
  discord: "https://discord.gg",
  mirror: "https://mirror.xyz",
};
export const TOCKBALE_VERSION = "0.2.2";

export const SUPPORTED_CHAINS = [
  { name: "Ethereum ♦", value: "1" },
  { name: "Optimism 🔴", value: "10" },
  // { name: "Optimism goerli", value: "420" },
  { name: "Base 🔵", value: "8453" },
  // { name: "Base goerli", value: "84531" },
  { name: "Linea ⬛️", value: "59144" },
  { name: "Blast", value: "81457" },
  { name: "Mode", value: "34443" },
  { name: "Polygon 🟣", value: "137" },
  { name: "Linea Goerli ⬛️", value: "59140" },
  { name: "Polygon mumbai", value: "80001" },
  { name: "Blast Sepolia", value: "168587773" },
];

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
      "Create a Tockable drop, unlimited or fixed supply, customizable metadata during the mint",
  },
  {
    type: "regular",
    typeNo: 1,
    currentVersion: 1,
    title: "Regular drop",
    description:
      "Create a traditional NFT collection with fixed supply and pre-uploaded metadata",
  },
];

{
  /* <option value="7777777">Zora</option> */
}
{
  /* <option value="42161">Arbitrum One</option> */
}
