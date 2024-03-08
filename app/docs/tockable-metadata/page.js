import Image from "next/image";

export async function generateMetadata() {
  return {
    title: "Tockable.xyz",
    description:
      "Learn how to add dynamic NFT metadata to your contract and create your minting dapp.",
    applicationName: "tockable.xyz",
    keywords: [
      "nft",
      "dynamic nft",
      "customizable nft",
      "minting dapp",
      "dapp",
      "launchpad",
      "optimism",
      "blast",
      "mode",
      "blockchain",
      "ethereum",
      "Tockable",
      "erc 721a",
    ],
    authors: [{ name: "tockable.xyz" }],
    colorScheme: "dark",
    creator: "tockableteam",
    themeColor: "#231f20",
    twitter: {
      card: "summary_large_image",
      title: "Tockable.xyz",
      description:
        "Learn how to add dynamic NFT metadata to your contract and create your minting dapp.",
      creator: "@tockablexyz",
      images: [
        "https://pbs.twimg.com/profile_banners/1629609068623978499/1696075598/1500x500",
      ],
      url: "https://tockable.xyz",
    },
    openGraph: {
      title: "Tockable.xyz",
      description:
        "Learn how to add dynamic NFT metadata to your contract and create your minting dapp.",
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
    <div>
      <h1 className="font-bold mb-8 text-tock-blue text-xl">
        How to add Tockable metadata
      </h1>

      <p className="text-sm text-zinc-300 leading-relaxed">
        - After deploying the contract, you've reached the exciting part! This
        is where your minting dapp is built. For the convenience, this section
        has been designed in such a way that handling NFT metadata and creating
        the dapp can be done as easily as possible. In the following, we will
        explain with an example.
      </p>
      <div className="mt-12">
        <h1 className="font-bold mb-2 text-tock-blue text-lg">
          Adding Tockable metadata step by step
        </h1>
        <p className="text-sm text-zinc-300 leading-relaxed">
          - Let's say that you have designed your collection, foldered and named
          your raw layer files in this way. (In Tockable drop, you don't need to
          generate all collection images, just layars are enough.)
        </p>
        <figure className="flex flex-col items-center justify-center mt-2 mb-6">
          <Image
            src="/docs/sample-1.webp"
            href="folder-structure"
            width={300}
            height={300}
          />
          <figcaption className="mt-2 text-xs text-zinc-400 text-center">
            Better to have a proper folder structure to avoid mistakes.
          </figcaption>
        </figure>
        <p className="text-sm text-zinc-300 leading-relaxed">
          - On <span className="font-bold text-zinc-300">Metadata</span> page,
          click on <span className="text-tock-green">+ Add Layer</span>, choose
          a name (e.g. Background). This name will be included in NFT metadata.
        </p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          - Drag/Drop your first layer files (e.g. Background) into the box.
        </p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          - Repeat the previous step for all the layers you have.
        </p>
        <figure className="flex flex-col items-center justify-center mt-2 mb-6">
          <Image
            src="/docs/sample-2.webp"
            href="adding-metadata"
            width={800}
            height={800}
          />
          <figcaption className="mt-2 text-xs text-zinc-400 text-center">
            Create a layer for each trait and drag/drop the files.
          </figcaption>
        </figure>

        <p className="text-sm text-zinc-300 leading-relaxed">
          - When you done, you can test your app before deploying by clicking on
          the <span className="text-sky-300">Build & Test App</span> button. If
          something is wrong, you can go back and edit your layers.
        </p>
      </div>
      <div className="mt-12">
        <h2 className="font-bold mb-2 text-tock-blue text-lg">
          Deploy and create the minting dapp
        </h2>
        <p className="text-sm text-zinc-300 leading-relaxed">
          - At this place you have 2 options to deploy the metadata:
        </p>
        <h3 className="font-bold mt-6 mb-4 text-tock-blue">
          Option 1: "I've uploaded my files and have my CIDs"
        </h3>
        <p className="text-sm text-zinc-300 leading-relaxed">
          - Use one of your favourite IPFS pinning services (e.g. Pinata, NFT
          storage, etc.).
        </p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          - Upload each folder as a "Directory".
        </p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          - Fill (copy/paste) the CID fields with corresponded CID carefully and
          deploy.
        </p>
        <div className="mt-6 mb-10 bg-orange-500/10 p-2 rounded-lg">
          <p className="text-tock-orange text-xs my-1">
            <b>IMPORTANT*</b>: Please note that you should provide your CID
            without any https://, http://, ipfs:// or another prefix at the
            start, or any / at the end.
          </p>
        </div>
        <h2 className="font-bold mb-2 text-tock-blue">
          Option 2: I want to upload using Tockable
        </h2>
        <p className="text-sm text-zinc-300 leading-relaxed">
          - Just choose this option, and wait for Tockable to automatically
          upload your files. After uploading, you can deploy your metadata.
        </p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          - This feature currently on Beta (experimental) phase, but you can
          give it a try!
        </p>
      </div>
    </div>
  );
}
