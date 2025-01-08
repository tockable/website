"use client";
import Link from "next/link";
import Button from "@/components/design/button";

export default function NoCollectionFound({ chainName }) {
  return (
    <div className="flex flex-col p-4 mt-20 justify-center items-center">
      <p className="text-center text-sm text-zinc-300">
        Be the first creator on {chainName}!
      </p>
      <Link rel="noopener noreferrer" target="_blank" href="/creator/dashboard">
        <Button className="mt-4" variant={"primary"}>
          Create Project!
        </Button>
      </Link>
    </div>
  );
}
