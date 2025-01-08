import Link from "next/link";

export async function generateMetadata() {
  return {
    title: "Tockable.org",
    description:
      "Learn how to deploy an NFT collection drop with Tockable ERC721 NFT launchpad.",
    applicationName: "tockable.org",
    keywords: [
      "nft",
      "launchpad",
      "base",
      "tia",
      "airdrop",
      "blockchain",
      "ethereum",
      "erc721",
      "Tockable",
      "erc-721a",
    ],
    authors: [{ name: "tockable.org" }],
    colorScheme: "dark",
    creator: "tockableteam",
    themeColor: "#231f20",
    twitter: {
      card: "summary_large_image",
      title: "Tockable.org",
      description:
        "Learn how to deploy an NFT collection drop with Tockable ERC721 NFT launchpad.",
      creator: "@tockable_org",
      images: [
        "https://pbs.twimg.com/profile_banners/1629609068623978499/1696075598/1500x500",
      ],
      url: "https://tockable.org",
    },
    openGraph: {
      title: "Tockable.org",
      description:
        "Learn how to deploy an NFT collection drop with Tockable ERC721 NFT launchpad.",
      url: "https://tockable.org",
      siteName: "Tockable.org",
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
          Launch a Regular NFT collection
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
            <span className="text-zinc-200 font-bold">"Regular Drop"</span> and
            select the network you want to build on.
          </li>
          <li className="my-4">
            4. On <span className="font-bold text-zinc-200">Details</span>{" "}
            section, fill and save the public info of your collection
            (Description, twitter, discord, profile image, etc.)
          </li>
          <li className="my-4">
            5. On <span className="font-bold text-zinc-200">Contract</span>{" "}
            section, provide collection total supply (Max: 10000) and other
            info, then deploy the contract.
          </li>
          <li className="my-4">
            <p>
              {" "}
              6. On <span className="font-bold text-zinc-200">
                Metadata
              </span>{" "}
              section, copy/paste your metadata IPFS CID that you have
              previously uploaded to IPFS using your favourite IPFS pinning
              service (e.g. Pinata, NFT storage, etc.), and deploy.
            </p>
            <div className="mt-6 mb-10 bg-orange-500/10 p-2 rounded-lg">
              <p className="text-tock-orange text-xs my-1">
                <b>IMPORTANT*</b>: Please note that you should provide your CID
                without any https://, http://, ipfs:// or another prefix at the
                start, or any / at the end.
              </p>{" "}
              <p className="text-tock-orange text-xs mt-4">
                <b>IMPORTANT**</b>: If your metadata works perfectly and you
                don't want to change it. you should freeze your metadata in{" "}
                <b>Dashboard-&gt;Actions-&gt;Metadata</b> to assure your
                collectors that their NFT metadata will not change in the
                future.
              </p>
            </div>
          </li>
          <li className="my-4">
            7. On <span className="font-bold text-zinc-200">Roles</span>{" "}
            section, you can add roles and manage whitelisted addresses with
            different minting price and amount. At the end, you can deploy the
            roles.
          </li>
          <li className="my-4">
            7. On <span className="font-bold text-zinc-200">Sessions</span>{" "}
            section, you can choose minting date and allowed roles for each
            minting sessions, Deploy sessions.
          </li>
          <li className="my-4">
            8. <span className="font-bold text-zinc2300">Publish</span> and
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
