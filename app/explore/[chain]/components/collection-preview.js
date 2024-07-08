"use client";
import Link from "next/link";
import ImagePlaceHolder from "@/svgs/image_placeholder";
import { NFT_STORAGE_GATEWAY } from "@/tock.config";
import Button from "@/components/design/button";

export default function CollectionPreview({ collection }) {
  const src = !collection.ipfs
    ? `https://${collection.image}.${NFT_STORAGE_GATEWAY}`
    : `https://ipfs.io/ipfs/${collection.image}`;
  return (
    <div className="flex flex-col items-center w-[300px] bg-tock-semiblack rounded-2xl">
      {collection.image && (
        <div className="h-[300px] object-cover mt-[2px]">
          <img className="rounded-xl" src={src} width="297" height="297"></img>
        </div>
      )}
      {!collection.image && (
        <div className="w-[297px] mt-[2px]">
          <ImagePlaceHolder className="rounded-2xl" />
        </div>
      )}

      <p className="mt-4 text-sm text-zinc-300 font-bold">{collection.name}</p>
      <p className="mt-1 text-xs text-zinc-400">
        Price: {collection.price == 0 ? "Free" : collection.price}
      </p>
      <p className="mt-1 text-xs text-zinc-400">
        Minted: {collection.minted}/
        {collection.totalSupply == 0 ? "Unlimited" : collection.totalSupply}
      </p>
      <p className="mt-1 text-xs text-zinc-400">
        Status:{" "}
        {collection.minted === collection.totalSupply
          ? "Finished"
          : collection.paused == 1
          ? "Paused"
          : "Live"}
      </p>

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
