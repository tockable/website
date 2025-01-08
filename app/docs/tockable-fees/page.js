export async function generateMetadata() {
  return {
    title: "Tockable.org",
    description:
      "Learn about fixed and clear fee system of Tockable Launchpad.",
    applicationName: "tockable.org",
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
    ],
    authors: [{ name: "tockable.org" }],
    colorScheme: "dark",
    creator: "tockableteam",
    themeColor: "#231f20",
    twitter: {
      card: "summary_large_image",
      title: "Tockable.org",
      description:
        "Learn about fixed and clear fee system of Tockable Launchpad.",
      creator: "@tockable_org",
      images: [
        "https://pbs.twimg.com/profile_banners/1629609068623978499/1696075598/1500x500",
      ],
      url: "https://tockable.org",
    },
    openGraph: {
      title: "Tockable.org",
      description:
        "Learn about fixed and clear fee system of Tockable Launchpad.",
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
        <h1 className="font-bold mb-8 text-tock-blue text-xl">Tockable fees</h1>
        <p className="text-sm text-zinc-300">
          Tockable is considered as one of the platforms with the lowest
          platform fee in the market. Tockable collect a fixed fee from each NFT
          with a clear fee system.
        </p>
        <ul className="text-sm font-bold text-zinc-200 mt-12">
          <li className="my-6 p-2 border border-zinc-600 rounded-2xl">
            - Each mint from a Tockable drop collections (customizable NFTs):{" "}
            <p className="mt-2 text-zinc-400 mt-4 font-normal">
              For networks with ETH native token:{" "}
              <span className="text-tock-green">0.00015 ETH</span>
            </p>
            <p className="mt-2 text-zinc-400 font-normal">
              For POLYGON <span className="text-tock-green">0.6 MATIC</span>
            </p>
          </li>
          <li className="my-6 p-2 border border-zinc-600 rounded-2xl">
            - Each mint from a Regular drop collections:{" "}
            <p className="mt-2 text-zinc-400 mt-4 font-normal">
              For networks with ETH native token:{" "}
              <span className="text-tock-green">0.000075 ETH</span>
            </p>
            <p className="mt-2 text-zinc-400 font-normal">
              For POLYGON <span className="text-tock-green">0.3 MATIC</span>
            </p>
          </li>
        </ul>
      </div>
    </>
  );
}
