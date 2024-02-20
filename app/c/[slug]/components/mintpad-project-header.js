import CoverPlaceholder from "@/svgs/cover_placeholder";
import { NFT_STORAGE_GATEWAY } from "@/tock.config";

export default function MintpadHeader({ cover }) {
  return (
    <header className="mb-4">
      {!cover.length && <CoverPlaceholder />}
      {cover.length && (
        <img
          className=" h-[25vw] w-full object-cover"
          src={`https://${project.cover}.${NFT_STORAGE_GATEWAY}`}
        />
      )}
    </header>
  );
}
