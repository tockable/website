import { getCollectionlistByChainId } from "@/actions/explore/explore-api";
import CollectionPreview from "./components/collection-preview";
import { redirect } from "next/navigation";
import NoCollectionFound from "./components/no-collection-found";
import { TOCKABLE_CHAINS } from "@/contexts/chains";

export default async function Page({ params }) {
  const tockable_type = process.env.NEXT_PUBLIC_TOCKABLE_TYPE;

  const found = TOCKABLE_CHAINS[tockable_type]
    .filter(
      (chain) =>
        process.env.NEXT_PUBLIC_TOCKABLE_TYPE === "testnet" &&
        chain.value !== "1"
    )
    .find((c) => c.network === params.chain.toLowerCase());

  // {SUPPORTED_CHAINS.filter(
  //   (chain) =>
  //     process.env.NEXT_PUBLIC_TOCKABLE_TYPE === "testnet" &&
  //     chain.value !== "1"
  // ).map((c, i)

  if (!found) {
    redirect(`/explore/${process.env.NEXT_PUBLIC_EXPLORE}`);
  } else {
    const collectionList = await getCollectionlistByChainId(found.id);

    return (
      <div className="flex justify-center">
        {collectionList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-6">
            {collectionList.map((c, i) => (
              <div className="shrink-0" key={"collection_" + i}>
                <CollectionPreview collection={c} />
              </div>
            ))}
          </div>
        ) : (
          <NoCollectionFound chainName={found.name} />
        )}
      </div>
    );
  }
}
