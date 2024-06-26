"use client";
import Link from "next/link";
import { useState } from "react";
import ImagePlaceHolder from "@/svgs/image_placeholder";
import { NFT_STORAGE_GATEWAY } from "@/tock.config";
import Button from "@/components/design/button";

export default function CollectionPreview({ collection }) {
  return (
    <div className="flex flex-col items-center w-[300px] bg-tock-semiblack rounded-2xl">
      {collection.image && (
        <div className="h-[300px] object-cover mt-[2px]">
          <img
            className="rounded-xl"
            // src={`${IPFS_GATEWAY}/${project.image}`}
            src={`https://${collection.image}.${NFT_STORAGE_GATEWAY}`}
            width="297"
            height="297"
          ></img>
        </div>
      )}
      {!collection.image && (
        <div className="w-[297px] mt-[2px]">
          <ImagePlaceHolder className="rounded-2xl" />
        </div>
      )}

      <p className="mt-4 text-sm text-zinc-300 font-bold">{collection.name}</p>
      <p className="mt-1 text-sm text-zinc-300">Price</p>
      <p className="mt-1 text-sm text-zinc-300">Status</p>

      <div className=""></div>
      <Link
        className="w-full p-2"
        href={`/c/${collection.slug}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="primary" className="w-full">
          Mint
        </Button>
      </Link>
    </div>
  );
}
