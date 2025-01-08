export async function generateMetadata() {
  return {
    title: "Tockable.org",
    description:
      "Learn how to interact with your contract on Tockable NFT platform",
    applicationName: "tockable.org",
    keywords: [
      "nft",
      "launchpad",
      "base",
      "tia",
      "airdrop",
      "blockchain",
      "ethereum",
      "Tockable",
      "erc 721a",
      "smart contract",
      "interact with contract",
      "withdraw",
    ],
    authors: [{ name: "tockable.org" }],
    colorScheme: "dark",
    creator: "tockableteam",
    themeColor: "#231f20",
    twitter: {
      card: "summary_large_image",
      title: "Tockable.org",
      description:
        "Learn how to interact with your contract on Tockable NFT platform",
      creator: "@tockable_org",
      images: [
        "https://pbs.twimg.com/profile_banners/1629609068623978499/1696075598/1500x500",
      ],
      url: "https://tockable.org",
    },
    openGraph: {
      title: "Tockable.org",
      description:
        "Learn how to interact with your contract on Tockable NFT platform",
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
          Contract Actions
        </h1>
        <p className="text-sm text-zinc-300">
          Creators are able to interact with their deployed contracts on the{" "}
          <span className="font-bold text-zinc-200">Actions</span> page.
          Currently, the following actions are available:
        </p>
      </div>
      <div className="mt-16">
        <h2 className="text-tock-blue font-bold mb-2">Set Session</h2>
        <p className="text-sm text-zinc-300 leading-relaxed">
          After deploying sessions, you can set/change your active minting
          session here.
        </p>
        {/* <div className="mt-2 bg-orange-500/10 p-2 rounded-lg">
          <p className="text-tock-orange text-xs my-1">
            If you want to set the active session for the first time, you must
            also start the mint at the <b>Pause/Unpause</b> section.
          </p>
        </div> */}
        <div className="mt-6 mb-2 bg-green-500/10 p-2 rounded-lg">
          <p className="text-tock-green text-xs my-1">
            You can always update your sessions on the <b>Session</b> page.
          </p>
        </div>
        <div className="mt-2 mb-10 bg-orange-500/10 p-2 rounded-lg">
          <p className="text-tock-orange text-xs my-1">
            Currently, the sessions are <b>NOT</b> changed automatically and
            must be changed manually at the time you want.
          </p>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-tock-blue font-bold mb-2">Owner mint</h2>
        <p className="text-sm text-zinc-300 leading-relaxed">
          This tab is only available for regular contracts. If you deployed a
          Tockable contract, you can go to your mint page and use{" "}
          <b>Mint as owner</b>
          options (which is only available for the owner) to mint without any
          fees.
        </p>
      </div>

      <div className="mt-16">
        <h2 className="text-tock-blue font-bold mb-2">Withdraw</h2>
        <p className="text-sm text-zinc-300 leading-relaxed">
          You can withdraw your sale income (as the native chain currency) on
          this section.
        </p>

        <div className="mt-6 mb-2 bg-green-500/10 p-2 rounded-lg">
          <p className="text-tock-green text-xs my-1">
            If you deployed your contract on <b>Blast</b> network, you can earn
            additional income by claiming gas fees.
          </p>
          <p className="text-xs">
            {" "}
            <a
              className="text-blue-400 hover:text-blue-300"
              href="https://docs.blast.io/building/guides/gas-fees"
              target="_blank"
              rel="noopener noreferrer"
            >
              learn about claiming gas fees on <b>Blast</b> &gt;
            </a>
          </p>
        </div>
      </div>
      <div className="mt-16">
        <h2 className="text-tock-blue font-bold mb-2">Metadata</h2>
        <p className="text-sm text-zinc-300 leading-relaxed">
          This tab is only available for regular contracts. You can change your
          metadata CID, freeze it, or add/remove .json extension.
        </p>
        <div className="mt-2 bg-orange-500/10 p-2 rounded-lg">
          <p className="text-tock-orange text-xs my-1">
            If your metadata works perfectly and you don't want to change it.
            you should freeze your metadata to assure your collectors that their
            NFT metadata will not change in the future.
          </p>
        </div>
        <div className="mt-2 mb-10 bg-orange-500/10 p-2 rounded-lg">
          <p className="text-tock-orange text-xs my-1">
            By default, Tockable scan your metadata CID, detect and apply the
            extension setting. If metadata is not loading correctly, you can
            change your metadata extension setting here.
          </p>
        </div>
      </div>
      <div className="mt-16">
        <h2 className="text-tock-blue font-bold mb-2">Pause/Unpause</h2>
        <p className="text-sm text-zinc-300 leading-relaxed">
          You can Pause or Unpause your mint sessions at anytime you want. The
          owner mint will be available on paused state.
        </p>

        <div className="mt-2 mb-10 bg-orange-500/10 p-2 rounded-lg">
          <p className="text-tock-orange text-xs my-1">
            The minting is paused by default, ذut as soon as a session is set,
            minting becomes possible.
          </p>
        </div>
      </div>
    </>
  );
}
