import CoverPlaceholder from "@/svgs/cover_placeholder";
import { NFT_STORAGE_GATEWAY } from "@/tock.config";

export default function MintpadHeader({ project }) {
  const coverSrc =
    project.hasOwnProperty("ipfsProvider") && project.ipfsProvider == "pinata"
      ? `https://ipfs.io/ipfs/${project.cover}`
      : `https://${project.cover}.${NFT_STORAGE_GATEWAY}`;

  return (
    <header className="mb-4">
      {!project.cover.length && <CoverPlaceholder />}
      {project.cover.length && (
        <img className=" h-[25vw] w-full object-cover" src={coverSrc} />
      )}
    </header>
  );
}
