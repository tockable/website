"use client";

import { createDb } from "@/scripts/createdb";
import { createSupportDb } from "@/scripts/createSupportDb";

export default function Page() {
  async function db() {
    const res = await createDb();
    console.log(res);
  }

  async function support() {
    const res = await createSupportDb();
    console.log(res);
  }

  return (
    <div>
      <div>
        <button className="p-2 border  hover:bg-zinc-400" onClick={() => db()}>
          create db
        </button>
      </div>
      <div>
        <button
          className="p-2 border  hover:bg-zinc-400"
          onClick={() => support()}
        >
          create support
        </button>
      </div>
    </div>
  );
}
