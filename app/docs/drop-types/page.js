import { generateMetadata } from "@/app/page";
import Link from "next/link";

export async function generateMetadata() {
  return {
    title: "Tockable.xyz",
    description:
      "Learn about Tockable customizable and regular NFT collection drops.",
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
    ],
    authors: [{ name: "tockable.xyz" }],
    colorScheme: "dark",
    creator: "tockableteam",
    themeColor: "#231f20",
    twitter: {
      card: "summary_large_image",
      title: "Tockable.xyz",
      description:
        "Learn about Tockable customizable and regular NFT collection drops.",
      creator: "@tockablexyz",
      images: [
        "https://pbs.twimg.com/profile_banners/1629609068623978499/1696075598/1500x500",
      ],
      url: "https://tockable.xyz",
    },
    openGraph: {
      title: "Tockable.xyz",
      description:
        "Learn about Tockable customizable and regular NFT collection drops.",
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
          Available Drop Types
        </h1>
        <p className="text-sm text-zinc-300">
          Currently, Tockable offers two ERC-721 NFT collection drop types:
        </p>
        <ul className="text-sm font-bold text-zinc-200 my-4">
          <li className="my-1">
            - Regular NFT drop{" "}
            <span className="text-zinc-400 text-xs font-norma">
              (Random NFTs)
            </span>
          </li>
          <li className="my-1">
            - Tockable NFT drop{" "}
            <span className="text-zinc-400 text-xs font-norma">
              (Customizable NFTs)
            </span>
          </li>
        </ul>
      </div>
      <div className="mt-16">
        <h2 className="text-tock-blue font-bold mb-2">Regular NFT drop</h2>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Regular NFT collection drop is just like many of the NFT collections
          we all know. We name it "Regular" because we offer a special NFT drop
          called "Tockable" (We will get to it quickly!). Bored Ape yach club
          (BAYC) and Crypto punks are two famous examples of Regular/traditional
          NFT collection. You generate all of your collection's images and
          metadata before minting. Collection total supply is known and limited
          (e.g. 1000, 10000, etc.), and the collectors will mint one or more of
          your tokens at your mintpage dapp and will be surprised with their
          random NFT.
        </p>
        <Link
          className="text-xs text-blue-400 hover:text-blue-300"
          href="/docs/launch-regular-nft-collection"
        >
          Learn how to create a Tockable NFT collection
        </Link>
      </div>
      <div className="mt-16">
        <h2 className="text-tock-blue font-bold mb-2">Tockable NFT drop</h2>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Tockable NFT collection drop is a new type introduced by Tockable.
          With Tockable, you can easily create and publish your own minting dapp
          that collectors can use to design & customize their NFTs before
          minting.
        </p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Tockable collection creates a fun and interactive mint experience for
          collectors, which makes your collection more special than other
          collections.
        </p>

        <p className="text-sm mt-6 text-zinc-200 mb-4 font-bold leading-relaxed">
          With Tockable drop:
        </p>
        <ul className="text-sm text-zinc-300 mb-2 leading-relaxed">
          <li className="my-1">
            - You don't need to generate/upload your collection before minting,
            it will be created during the mint process!
          </li>
          <li className="my-1">
            - You can create LIMITED or UNLIMITED supplies!
          </li>
          <li className="my-1">
            - You can verify uniqueness of your NFTs on-chain
          </li>
        </ul>
        <Link
          className="text-xs text-blue-400 hover:text-blue-300"
          href="/docs/launch-tockable-nft-collection"
        >
          Learn how to create a Tockable NFT collection
        </Link>
      </div>
    </>
  );
}
