import { EXPLORE_CHAINS } from "@/tock.config";
import { getCollectionlistByChainId } from "@/actions/explore/explore-api";
import CollectionPreview from "./components/collection-preview";
import CollectionSkletton from "./components/collection-skletton";
import NoCollectionFound from "./components/no-collection-found";

export default async function Page({ params }) {
  const chainId = EXPLORE_CHAINS[params.chain.toLowerCase()];
  const collectionList = await getCollectionlistByChainId(chainId);



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
        <NoCollectionFound params={params} />
      )}
    </div>
  );
}
