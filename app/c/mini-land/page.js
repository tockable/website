// import MintProviderTockable from "@/contexts/mint-context-tockable";
// import MintpadDappDetopia from "./mintpad-mint-app-detopia";

// const lands = [
//   "/test/L-1.png",
//   "/test/L-2.png",
//   "/test/L-3.png",
//   "/test/L-4.png",
// ];

// const block = [
//   "/test/empty.png",
//   "/test/B-1.png",
//   "/test/B-2.png",
//   "/test/B-3.png",
//   "/test/B-4.png",
//   "/test/B-5.png",
//   "/test/B-6.png",
//   "/test/B-7.png",
// ];
// const front = [
//   "/test/empty.png",
//   "/test/F-1.png",
//   "/test/F-2.png",
//   "/test/F-3.png",
//   "/test/F-4.png",
//   "/test/F-5.png",
//   "/test/F-6.png",
//   "/test/F-7.png",
// ];
// const side = [
//   "/test/empty.png",
//   "/test/S-1.png",
//   "/test/S-2.png",
//   "/test/S-3.png",
//   "/test/S-4.png",
// ];
// const top = [
//   "/test/empty.png",
//   "/test/T-1.png",
//   "/test/T-2.png",
//   "/test/T-3.png",
//   "/test/T-4.png",
//   "/test/T-5.png",
//   "/test/T-6.png",
//   "/test/T-7.png",
// ];
// export default function Page() {
//   return (
//     <MintProviderTockable>
//       <MintpadDappDetopia
//         lands = {lands}
//         layers={["block", "front", "top", "side"]}
//         fileNames={[block, front, top, side]}
//       />
//     </MintProviderTockable>
//   );
// }

import { TOCKABLE_METADATA } from "@/constants/metadata";
import MintpadLandingDeetopia from "./detopia-mintpad-landing";
import { getContractAbi } from "@/actions/contract/metadata";

export async function generateMetadata() {
  return TOCKABLE_METADATA;
}

export default async function Page() {
  let project = {
    uuid: "m",
    version: 2,
    ipfsProvider: "pinata",
    creator: "0xB0b401d4761317E272E02C9513771768a1013387",
    chainData: { name: "Linea", chainId: "59144" },

    dropType: "temp",
    name: "Miniland",
    description:
      "Welcome to Linea [L'] Miniland. Miniland is an experimental project that let you to modulate and design your ERC-721 land before minting. Let's build the Miniland with fun and chaos! ",
    website: "",
    twitter: "",
    discord: "",
    slug: "mini-land",
    image: "QmQSytDsVWSxrzr1rGa8HGxV3qP1xTjPtWST8Dt8FchpeZ",
    cover: "QmVAHKiDVMu2WeoqjHJ6oza1Cu1gKSxqVXhTyPehNXGaoS",
    tokenName: "Miniland",
    tokenSymbol: "MLND",
    duplicateVerification: false,
    firstTokenId: 1,
    roles: [
      {
        id: 0,
        name: "public",
        quota: "50",
        price: "0",
        allowedAddresses: [],
      },
    ],
    sessions: [
      {
        id: 0,
        name: "public",
        allocation: "100000",
        roles: [0],
        start: "2024-07-07T22:11",
        end: "2024-08-09T22:11",
      },
    ],
    signer: "0x3849b3aC6a490cD2962B7Cd19d6C437585D29f42",
    contractAddress: "Not deployed yet",
    layers: ["BG", "HEAD", "FACE", "HAIR"],
    fileNames: [
      ["Banana.png", "Blue.png", "Green.png", "Orange.png", "Violet.png"],
      ["Caramel.png", "Chocolate.png", "Mocha.png", "Zombie.png"],
      ["HMM.png", "JUSTNORMALFACE.png", "NAH.png", "OMG.png", "YESSS.png"],
      ["Cool.png", "Elvis.png", "Simple.png", "TooGood.png", "YO.png"],
    ],
    cid: "bafybeihfnzom3gwprp6kpdx54rsre7gcm2ovyyze7irgqr22tv2y7ew4ui",
    cids: [
      "QmWDMRPPHAXWyG4s5RZfCTHWy5zGgVAAeNaMrxGWdEkXmL",
      "QmYy3YYTsQoxH7TtjpdcCzpXgrMtwFsZPix1B83pfKUXMh",
      "QmeDaf1saUWrHvHNDeZ3rtC7b3kmtPK2btwLxHTaoEWffv",
      "QmWVxoCNGXxZ3ujep7udohs9CTyLtoa2Gfen7okDn4sivV",
    ],
    paused: false,
    activeSession: 0,
    isDeployed: true,
    isPublished: true,
    isUnlimited: true,
    isVerified: false,
    totalSupply: 0,
    roleDeployed: true,
  };

  const abi = await getContractAbi(project);

  if (abi.length) {
    return <MintpadLandingDeetopia abi={abi} project={project} />;
  }
}
