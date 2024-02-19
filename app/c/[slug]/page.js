import { fetchProjectMintData } from "@/actions/mintpad/mintpad";
import { TOCKABLE_METADATA } from "@/constants/metadata";
import { IPFS_GATEWAY } from "@/tock.config";
import MintpadLanding from "./components/mintpad-landing";
import NotFound from "@/components/not-found/not-found";
import { getContractAbi } from "@/actions/contract/metadata";

export async function generateMetadata({ params }) {
  let project = null;
  const res = await fetchProjectMintData(params.slug);

  if (res.success) project = res.payload;

  if (!project) return TOCKABLE_METADATA;

  return {
    title: `${project.name} @Tockable`,
    description: project.description,
    applicationName: "tockable.xyz",
    keywords: [
      project.chainData,
      "dynamic nft",
      "nft",
      "launchpad",
      "tockable",
      "mint",
      "blockchain",
    ],
    authors: [{ name: project.twitter }],
    colorScheme: "dark",
    creator: project.creator,
    themeColor: "#231f20",
    twitter: {
      card: "summary_large_image",
      title: `${project.name} @Tockable`,
      description: project.description,
      creator: project.twitter,
      images: [`${IPFS_GATEWAY}/${project.image}`],
      url: `https://tockable.xyz/c/${project.slug}`,
    },
    openGraph: {
      title: `${project.name} @Tockable`,
      description: project.description,
      url: `https://tockable.xyz/c/${project.slug}`,
      siteName: "Tockable.xyz",
      images: [
        {
          url: `${IPFS_GATEWAY}/${project.cover}`,
          width: 1200,
          height: 300,
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function Page({ params }) {
  let project = null;
  let abi = [];

  const res = await fetchProjectMintData(params.slug);

  if (res.success) {
    project = res.payload;
    abi = await getContractAbi(project);
  }

  if (abi.length) {
    return <MintpadLanding abi={abi} project={project} />;
  }

  if (!project) {
    return <NotFound />;
  }
}
