"use client";
import Link from "next/link";
import Button from "@/components/design/button";
import { capitalize } from "@/utils/string-utils";
export default function NoCollectionFound({ params }) {
  return (
    <div className="flex flex-col p-4 mt-20 justify-center items-center bg-zinc-800/40 backdrop-blur-sm rounded-xl">
      <p className="text-center text-md text-zinc-300">
        Be the first creator on {capitalize(params.chain)}!
      </p>
      <Link rel="noopener noreferrer" target="_blank" href="/creator/dashboard">
        <Button className="mt-4" variant={"primary"}>
          Create Project!
        </Button>
      </Link>
    </div>
  );
}
