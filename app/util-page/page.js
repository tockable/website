"use client";

import { createSupportDb } from "@/scripts/createSupportDb";

export default function Page() {
  async function create() {
    const res = await createSupportDb();
    console.log(res);
  }
  return (
    <button className="p-2 bg-red-200" onClick={() => create()}>
      create
    </button>
  );
}
