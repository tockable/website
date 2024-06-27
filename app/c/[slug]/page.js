import { fetchProjectMintData } from "@/actions/mintpad/mintpad";
import { TOCKABLE_METADATA } from "@/constants/metadata";
import MintpadLanding from "./components/mintpad-landing";
import NotFound from "@/components/not-found/not-found";
import { getContractAbi } from "@/actions/contract/metadata";

export async function generateMetadata({ params }) {
  let project = null;
  const res = await fetchProjectMintData(params.slug);

  if (res.success) project = res.payload;

  if (!project) return TOCKABLE_METADATA;

  const keywords = [
    project.dropType === "tockable" ? "dynamic nft" : "valuable nft",
    project.chainData.name,
    "nft",
    "launchpad",
    "tockable",
    "mint",
    "blockchain",
  ];

  return {
    title: `${project.name} @Tockable`,
    description: project.description,
    applicationName: "Tockable.xyz",
    keywords,
    authors: [{ name: project.twitter }],
    colorScheme: "dark",
    creator: project.twitter,
    themeColor: "#231f20",
    twitter: {
      card: "summary_large_image",
      title: `${project.name} @Tockable`,
      description: project.description,
      creator: project.twitter,
      images: [`https://${project.image}.ipfs.nftstorage.link`],
      url: `https://tockable.xyz/c/${project.slug}`,
    },
    openGraph: {
      title: `${project.name} @Tockable`,
      description: project.description,
      url: `https://tockable.xyz/c/${project.slug}`,
      siteName: "Tockable.xyz",
      images: [
        {
          url: `https://${project.image}.ipfs.nftstorage.link`,
          width: 400,
          height: 400,
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

  if (res.success === true) {
    project = res.payload;
    abi = await getContractAbi(project);
  }

  if (res.success === false) {
    return <p>{res.message}</p>;
  }

  if (
    res.notFound === true ||
    project.isPublished === false ||
    project.isPublished === 0
  ) {
    return <NotFound />;
  }

  if (abi.length) {
    return <MintpadLanding abi={abi} project={project} />;
  }
}
