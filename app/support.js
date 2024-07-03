"use client";

import Link from "next/link";
export default function Support() {
  return (
    <div className="rounded-lg z-30 fixed flex justify-center items-center bottom-2 right-2 w-32 text-sm w-32 bg-yellow-300 text-center text-tock-black py-2">
      <div>
        <div className="text-xs font-bold">Any problem?</div>
        <Link
          className="rounded-xl text-blue-400 hover:text-blue-300 font-bold text-xs"
          href="/support"
          rel="noopener noreferrer"
          target="_blank"
        >
          Support &gt;
        </Link>
      </div>
    </div>
  );
}
