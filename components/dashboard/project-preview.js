import Link from "next/link";
import { useState, useEffect } from "react";
import { IPFS_GATEWAY } from "@/tock.config";
import Button from "../design/button/button";
import getChainData from "@/utils/chain-utils";
import ImagePlaceHolder from "@/svgs/image_placeholder";
import Loading from "../loading/loading";

export default function ProjectPreview({ project }) {
  const [chainName, setChainName] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLoading() {
    setLoading(true);
  }

  useEffect(() => {
    const _chainData = getChainData(Number(project.chainId));
    setChainName(_chainData.name);
  }, []);

  return (
    <div className="flex flex-col items-center px-8 pt-6 pb-8 bg-tock-semiblack rounded-2xl">
      {project.image && (
        <img
          className="rounded-xl"
          src={`${IPFS_GATEWAY}/${project.image}`}
          width="206"
        ></img>
      )}
      {!project.image && (
        <div className="w-[206px] rounded-2xl">
          <ImagePlaceHolder />
        </div>
      )}

      <p className="mt-4 text-md text-zinc-300 font-bold">{project.name}</p>
      <p className="mt-1 text-xs text-zinc-400">{chainName}</p>
      <div className="my-4 text-center">
        <p className="my-1 text-xs">
          {project.isDeployed ? (
            <span className="text-tock-green">Deployed</span>
          ) : (
            <span className="text-tock-orange">Not deployed</span>
          )}
        </p>
        <p className="my-1 text-xs">
          {project.isPublished ? (
            <span className="text-tock-green">Published</span>
          ) : (
            <span className="text-tock-orange">Not published</span>
          )}
        </p>
      </div>
      <Link href={`/launchpad/${project.uuid}`}>
        <Button className="ml-4" variant="secondary" onClick={handleLoading}>
          {!loading && <span> Go to project</span>}
          {loading && <Loading isLoading={loading} size={10} />}
        </Button>
      </Link>
    </div>
  );
}
