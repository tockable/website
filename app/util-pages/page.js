"use client";

import { alter } from "@/scripts/createSupportDb";

export default function Page() {
  async function task() {
    const res = await alter();
    console.log(res);
  }
  return (
    <button className="p-2 bg-red-200" onClick={() => task()}>
      create
    </button>
  );
}
