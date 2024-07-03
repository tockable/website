"use client";
import Link from "next/link";
import { useState } from "react";
import ImagePlaceHolder from "@/svgs/image_placeholder";
import { NFT_STORAGE_GATEWAY } from "@/tock.config";
import Button from "@/components/design/button";

export default function CollectionSkletton() {
  return (
    <div className="flex flex-col items-center w-[300px] bg-tock-semiblack rounded-2xl animate-pulse">
      <div className="h-[300px] mt-[2px]">
        <div className="rounded-xl bg-zinc-800 w-[297px] h-[297px]"></div>
      </div>

      <div className="flex flex-col w-full gap-2 p-2 justify-center items-center">
        <div className="rounded-2xl h-4 p-2 bg-zinc-700 w-[50%]"></div>
        <div className="rounded-2xl h-4 bg-zinc-700 w-full"></div>
        <div className="rounded-2xl h-4 bg-zinc-700 w-full"></div>
      </div>
      <div className='p-2 w-full'>
        <Button
          variant="primary"
          disabled={true}
          className="w-full disabled:bg-zinc-800"
        >
          {" "}
        </Button>
      </div>
    </div>
  );
}
