"use client";
import Link from "next/link";
import Button from "@/components/design/button";
import { capitalize } from "@/utils/string-utils";
export default function NoCollectionFound({ params }) {
  return (
    <div className="flex flex-col w-full mt-20 justify-center items-center">
      <p className="text-center text-lg text-zinc-500">
        {`Be the first creator on ${capitalize(params.chain)}`}{" "}
      </p>
      <Link rel="noopener noreferrer" target="_blank" href="/creator/dashboard">
        <Button className="mt-4" variant={"primary"}>
          Create Project!
        </Button>
      </Link>
    </div>
  );
}
