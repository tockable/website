import { TXP } from "@/tock.config";

export async function generateMetadata() {
  return {
    title: "Tockable.xyz",
    description:
      "Tockable distributes points (TXP). Learn how to earn rewards,points and TXP by collecting NFTs.",
    applicationName: "tockable.xyz",
    keywords: [
      "nft",
      "launchpad",
      "optimism",
      "blast",
      "mode",
      "blockchain",
      "ethereum",
      "Tockable",
      "erc 721a",
      "airdrop",
      "TXP",
      "points",
      "reward",
    ],
    authors: [{ name: "tockable.xyz" }],
    colorScheme: "dark",
    creator: "tockableteam",
    themeColor: "#231f20",
    twitter: {
      card: "summary_large_image",
      title: "Tockable.xyz",
      description:
        "Tockable distributes points (TXP). Learn how to earn rewards,points and TXP by collecting NFTs.",
      creator: "@tockablexyz",
      images: [
        "https://pbs.twimg.com/profile_banners/1629609068623978499/1696075598/1500x500",
      ],
      url: "https://tockable.xyz",
    },
    openGraph: {
      title: "Tockable.xyz",
      description:
        "Tockable distributes points (TXP). Learn how to earn rewards,points and TXP by collecting NFTs.",
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
          Tockable points (TXP)
        </h1>
        <p className="text-sm text-zinc-300">
          Currently, Tockable distributes points (TXP). TXPs are awarded to each
          wallet address based on the following activities on Tockable platform:
        </p>
        <ul className="text-sm font-bold text-zinc-200 mt-12">
          <li className="my-6 p-2 border border-zinc-600 rounded-2xl">
            - Each mint from a Tockable drop collections (cusomizable NFTs):{" "}
            <p className="mt-2 w-24 text-center text-tock-black p-2 bg-tock-green rounded-xl">
              {TXP.tockable}TXP
            </p>
          </li>
          <li className="my-6 p-2 border border-zinc-600 rounded-2xl">
            - Each mint from a Regular drop collections:{" "}
            <p className="mt-2 w-24 text-center text-tock-black p-2 bg-tock-green rounded-xl">
              {TXP.regular}TXP
            </p>
          </li>
          <li className="my-6 p-2 border border-zinc-600 rounded-2xl">
            - Deploying a Tocable contract in which at least 5 tokens are
            minted:
            <p className="text-zinc-400 font-normal text-xs">
              (Owner mints are not counted.)
            </p>
            <p className="mt-2 w-24 text-center text-tock-black p-2 bg-tock-green rounded-xl">
              {TXP.contractTockable}TXP
            </p>
          </li>
          <li className="my-6 p-2 border border-zinc-600 rounded-2xl">
            - Deploying a regular contract in which at least 5 tokens are
            minted:{" "}
            <p className="text-zinc-400 font-normal text-xs">
              (Owner mints are not counted.)
            </p>
            <p className="mt-2 w-24 text-center text-tock-black p-2 bg-tock-green rounded-xl">
              {TXP.contractRegular}TXP
            </p>
          </li>
        </ul>
        <p className="text-zinc-300 font-normal text-sm mt-12">
          A dashboard for viewing TXPs will be provided soon.
        </p>
      </div>
    </>
  );
}
