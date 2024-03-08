"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
// import { IPFS_GATEWAY } from "@/tock.config";
import { NFT_STORAGE_GATEWAY } from "@/tock.config";
import getChainData from "@/utils/chain-utils";
import ImagePlaceHolder from "@/svgs/image_placeholder";
import Loading from "@/components/loading/loading";
import Button from "@/components/design/button";

export default function ProjectPreview({ project }) {
  const [chainName, setChainName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoading = () => setLoading(true);

  useEffect(() => {
    const _chainData = getChainData(Number(project.chainId));
    setChainName(_chainData.name);
  }, []);

  return (
    <div className="flex flex-col items-center px-8 pt-6 pb-8 bg-tock-semiblack rounded-2xl">
      {project.image && (
        <div className="h-[206px] object-cover">
          <img
            className="rounded-xl"
            // src={`${IPFS_GATEWAY}/${project.image}`}
            src={`https://${project.image}.${NFT_STORAGE_GATEWAY}`}
            width="206"
            height="206"
          ></img>
        </div>
      )}
      {!project.image && (
        <div className="w-[206px]">
          <ImagePlaceHolder className="rounded-2xl" />
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
      <Link href={`/creator/launchpad/${project.uuid}/details`}>
        <Button variant="secondary" onClick={handleLoading} disabled={loading}>
          {loading ? (
            <Loading isLoading={loading} size={10} />
          ) : (
            <span>Go to project</span>
          )}
        </Button>
      </Link>
    </div>
  );
}
