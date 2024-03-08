import Link from "next/link";

export async function generateMetadata() {
  return {
    title: "Tockable.xyz",
    description:
      "Learn how to deploy a dynamic and customizable NFT collection drop with Tockable ERC721e NFT launchpad.",
    applicationName: "tockable.xyz",
    keywords: [
      "nft",
      "launchpad",
      "optimism",
      "blast",
      "mode",
      "blockchain",
      "ethereum",
      "erc721",
      "Tockable",
      "erc-721a",
      "dynamic nft",
      "customizable nft",
    ],
    authors: [{ name: "tockable.xyz" }],
    colorScheme: "dark",
    creator: "tockableteam",
    themeColor: "#231f20",
    twitter: {
      card: "summary_large_image",
      title: "Tockable.xyz",
      description:
        "Learn how to deploy a dynamic and customizable NFT collection drop with Tockable ERC721e NFT launchpad.",
      creator: "@tockablexyz",
      images: [
        "https://pbs.twimg.com/profile_banners/1629609068623978499/1696075598/1500x500",
      ],
      url: "https://tockable.xyz",
    },
    openGraph: {
      title: "Tockable.xyz",
      description:
        "Learn how to deploy a dynamic and customizable NFT collection drop with Tockable ERC721e NFT launchpad.",
      url: "https://tockable.xyz",
      siteName: "Tockable.xyz",
      images: [
        {
          url: "https://pbs.twimg.com/profile_banners/1629609068623978499/1696075598/1500x500",
          width: 1500,
          height: 500,
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };
}

export default function Page() {
  return (
    <>
      <div>
        <h1 className="font-bold mb-8 text-tock-blue text-xl">
          Launch a Tockable NFT collection
        </h1>
        <ol className="text-sm text-zinc-300 my-4">
          <li className="my-4">
            1. Go to your Tockable{" "}
            <Link
              className="text-blue-400 hover:text-blue-300"
              target="_blank"
              rel="noopener noreferrer"
              href="/creator/dashboard"
            >
              Dashboard
            </Link>
          </li>
          <li className="my-4">
            2. Connect wallet and sign in securely with Ethereum.
          </li>
          <li className="my-4">
            3. Click on{" "}
            <span className="text-tock-green">+ Create new project</span> ,name
            your project, choose{" "}
            <span className="text-zinc-200 font-bold">"Tockable Drop"</span> and
            select the network you want to build on.
          </li>
          <li className="my-4">
            4. On <span className="font-bold text-zinc-200">Details</span>{" "}
            section, fill and save the public info of your collection
            (Description, twitter, discord, profile image, etc.)
          </li>
          <li className="my-4">
            5. On <span className="font-bold text-zinc-200">Contract</span>{" "}
            section, provide contract info like token name, limited or unlimited
            supply, and make your desicion if you want to force only-unique
            tokens. Then deploy the contract.
            <div className="mt-6 mb-2 bg-orange-500/10 p-2 rounded-lg">
              <p className="text-tock-orange text-xs my-1">
                Please note that you can not choose Unlimied supply and the
                Duplicate verification at the same time. It's because in an
                Unlimited supplied contract, it's possible for collectors to
                create duplicated designs.
              </p>
            </div>
            <div className="mt-2 mb-10 bg-orange-500/10 p-2 rounded-lg">
              <p className="text-tock-orange text-xs my-1">
                <b>IMPORTANT*</b>: If you choose to prevent duplicated tokens,
                You should supply enough traits to backup your total supply.
              </p>
              <p className="text-tock-orange text-xs my-1">
                For instance: If you provide 5 background, 4 Faces & 4 Hairs,
                It's possible to generate only 5 * 4 * 4 = 80 unique design & we
                recomended to choose your total supply about 40 (~%50 of
                possible designs.) That's because when, for example, 80% of the
                total supply is minted, it means that many of the unique designs
                have been minted, and you don't want the collector to have a
                hardtime to find an available design.
              </p>
            </div>
          </li>
          <li className="my-4">
            <p>
              6. Deploying Tockable metadata is not that hard, but it is worth
              talking about it a few lines. For learn how to deploy Tockable
              drop <span className="font-bold text-zinc-200">Metadata</span>{" "}
              ,please refer to the{" "}
              <Link
                className="text-sm text-blue-400 hover:text-blue-300"
                href="/docs/tockable-metadata"
              >
                Tockable metadata
              </Link>{" "}
              on this doc.
            </p>
          </li>
          <li className="my-4">
            7. On <span className="font-bold text-zinc-200">Roles</span>{" "}
            section, you can add roles and manage whitelisted addresses with
            different minting price and amount. At the end, you can deploy the
            roles.
          </li>
          <li className="my-4">
            7. On <span className="font-bold text-zinc-200">Sessions</span>{" "}
            section, you can choose date and allowed roles for each minting
            sessions. Then deploy sessions.
          </li>
          <li className="my-4">
            8. <span className="font-bold text-zinc-200">Publish</span> and
            share your project with the world!
          </li>
          <li className="my-4">
            9. For Starting the mint and interact with contract like withdraw,
            admin mint, etc., please refer to the{" "}
            <Link
              className="text-sm text-blue-400 hover:text-blue-300"
              href="/docs/contract-actions"
            >
              Contract actions
            </Link>{" "}
            on this doc.
          </li>
        </ol>
      </div>
    </>
  );
}
