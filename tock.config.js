// TOCKABLE
export const BASEURL = "https://tockable.org";
export const TOCKABLE_VERSION = "0.4.3";
export const SOCIAL = {
  twitter: "https://twitter.com/tockable_org",
  discord: "https://discord.gg",
  mirror: "https://mirror.xyz",
};

// IPFS
export const IPFS_GATEWAY = "https://ipfs.io/ipfs";
export const NFT_STORAGE_GATEWAY = "ipfs.nftstorage.link";

// TOCK ENGINE
export const MAX_LAYERS = 40;
export const MAX_FILES_PER_LAYER = 20;
export const TOCKABLE_ADDRESS = process.env.NEXT_PUBLIC_TOCKABLE_ADDRESS;
export const MAX_MINT_PER_TX = 5;

export const TXP = {
  tockable: 100,
  regular: 50,
  contractTockable: 1000,
  contractRegular: 750,
};

export const DROP_TYPES = [
  // {
  //   supported: false,
  //   type: "tockable",
  //   typeNo: 0,
  //   currentVersion: 2,
  //   title: "Tockable drop",
  //   description:
  //     "Create an NFT collection where collectors can make their own NFT during the mint, unlimited or fixed supply.",
  // },
  // {
  //   supported: true,
  //   type: "temp",
  //   typeNo: 3,
  //   currentVersion: 2,
  //   title: "Tock-Temp (Experimental)",
  //   description:
  //     "Create an NFT collection where collectors can make their own NFT during the mint, unlimited or fixed supply",
  // },
  {
    supported: true,
    type: "regular",
    typeNo: 1,
    currentVersion: 2,
    title: "Regular drop",
    description:
      "Create a traditional NFT collection with fixed total supply and pre-uploaded IPFS metadata",
  },
  {
    supported: true,
    type: "mono",
    typeNo: 2,
    currentVersion: 1,
    title: "Edition",
    description:
      "All tokens share a similar metadata like an Image/Html/json, Useful for Editions, erc721 OATs, Tickets, and subscriptions.",
  },
];

// DB
export const db_path = process.env.SQL_PATH;

// Tockable Factory contracts
export const FACTORY_CONTRACTS = {
  regular: {
    84532: "0x4c2d27E0b7794a1ACd3cBc7040D84BE050a4D2d1", // Base Sepolia
    10: "0xC53a9C966AE638259b33B742b44FcC915a695324", // OP
    8453: "0xdD508782388F98C34f0c967eb751D8cF2E89b3d5", // Base
    7777777: "0xA656574cfEA8Ba5B8c774ffFc5DE2365e2445dd6", // Zora
    34443: "0xa3bf4C0f12ADa79143F1Ff572D2751678453197B", // Mode
    480: "0xCef0786944c5FbcEBEd639E5a86D746b458ED865", // Worldchain
    252: "0xCef0786944c5FbcEBEd639E5a86D746b458ED865", // Fraxtal
    1135: "0xCef0786944c5FbcEBEd639E5a86D746b458ED865", // Lisk
    60808: "0xCef0786944c5FbcEBEd639E5a86D746b458ED865", // BOB
    57073: "0xCef0786944c5FbcEBEd639E5a86D746b458ED865", // Ink
  },
  mono: {
    10: "0x4EF0641d662AF6576a876Ca83D5338d24c748206", // OP
    8453: "0x8319822bdE93AAA12E76F5708BC9636ED39Feb03", // Base
    7777777: "0x4Aba2f5f1aE0332188D7E393e75908AcD97D318D", // Zora
    34443: "0xD679ab6dD9faB0b0C9710FB4B3EcF40b6ee71949", // Mode
    480: "0x2dD978216513868004b83044A64621c097DF9D33", // Worldchain
    252: "0x5F1469fC8c859650B4E0CB45633622fb10F52465", // Fraxtal
    1135: "0x5F1469fC8c859650B4E0CB45633622fb10F52465", // Lisk
    60808: "0x5F1469fC8c859650B4E0CB45633622fb10F52465", // BOB
    57073: "0x5F1469fC8c859650B4E0CB45633622fb10F52465", // Ink
  },
};
